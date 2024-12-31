import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtPayload } from "jsonwebtoken";

import { SecureTokenService } from "src/shared/security";
import { FirebaseService, MailService } from "src/shared/third-party";

import { AuthResultDTO, DeviceDTO, LoginDTO, RegisterDTO, RetryOtpDTO, VerifyOtpDTO } from "../dto";
import { UserSessionRepository } from "../infra/repositories/user-session.repository";
import { UserRepository } from "../infra/repositories/user.repository";
import { UserSessionModel } from "../models/user-session.model";
import { UserModel } from "../models/user.model";
import { generateRandomNickname } from "../utils/generate-random-nickname";

@Injectable()
export class AuthService {

    constructor(
        private readonly firebaseService: FirebaseService,
        private readonly mailService: MailService,
        private readonly secureTokenService: SecureTokenService,
        private readonly userRepository: UserRepository,
        private readonly userSessionRepository: UserSessionRepository,
    ) { }

    async checkEmailDuplicate(email: string): Promise<boolean> {
        const user = await this.userRepository.findUserByEmail(email);
        return user ? true : false;
    }

    async getCredentialOrThrow(accessToken: string): Promise<UserModel> {
        const payload: JwtPayload = this.secureTokenService.verifyJwtToken(accessToken);
        const user: UserModel = await this.userRepository.findUserById(payload.sub);
        if (!user) {
            throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
        }

        const errMsg: string = '인증세션이 유효하지 않습니다.';
        const userSession: UserSessionModel = await this.userSessionRepository.findSessionByUserIdWithDeviceId(user.id, payload.deviceId);
        if (!userSession) {
            throw new UnauthorizedException(errMsg);
        }

        if (!userSession.isActivated) {
            throw new UnauthorizedException(errMsg);
        }

        return user;
    }

    async login(deviceId: string, dto: LoginDTO): Promise<AuthResultDTO> {
        // 1. 이메일이 존재하는지 채크
        const user: UserModel = await this.userRepository.findUserByEmail(dto.email);
        let errMsg: string = '아이디 또는 비밀번호를 찾을 수 없습니다.';
        if (!user) {
            throw new BadRequestException(errMsg);
        }

        // 2. 비밀번호 검증
        if (!user.verifyPassword(dto.password)) {
            throw new BadRequestException(errMsg);
        }

        // 3. 인증세션이 없으면 새로운 인증세션 생성, 이메일로 OTP 발송, OTP 추가 인증 요구
        let userSession: UserSessionModel = await this.userSessionRepository.findSessionByUserIdWithDeviceId(user.id, deviceId);
        if (!userSession) {
            const userSession: UserSessionModel = UserSessionModel.create({
                userId: user.id,
                deviceId
            });
            await this.userSessionRepository.save(userSession);
            await this.mailService.send(dto.email, userSession.otp);
            return AuthResultDTO.fromNeedOtp();
        }

        // 4인증세션이 비활성화 상태이면 이메일로 OTP 발송, OTP 인증 요구
        if (!userSession.isActivated) {
            userSession = userSession.withUpdateOtp();
            await this.mailService.send(dto.email, userSession.otp);
            return AuthResultDTO.fromNeedOtp();
        }

        // 5. JWT 토큰 리소스 생성
        const accessToken: string = this.secureTokenService.generateJwtToken(user.id, { deviceId });
        const expiresIn: number = this.secureTokenService.getJwtExpiresIn(accessToken);
        const refreshToken: string = this.secureTokenService.generateOpaqueToken();

        // 6. 새로운 리프레시토큰을 인증세션에 업데이트
        userSession = userSession.withUpdateRefreshToken(refreshToken);
        await this.userSessionRepository.save(userSession);

        // 7. 토큰 리소스 반환
        return AuthResultDTO.fromSuccess(accessToken, expiresIn, refreshToken);
    }

    async register(deviceId: string, dto: RegisterDTO): Promise<void> {
        return this.firebaseService.runInTransaction(async () => {
            // 1. 이메일 중복 채크
            let user: UserModel = await this.userRepository.findUserByEmail(dto.email);
            if (user) {
                throw new BadRequestException('이미 가입된 이메일입니다.');
            }

            // 2. 회원 모델 생성 및 저장
            const randomNickname: string = generateRandomNickname();
            user = UserModel.create({
                email: dto.email,
                password: dto.password,
                nickname: randomNickname,
            });
            await this.userRepository.save(user);

            // 3. 회원 세션 모델 생성 및 저장
            const userSession: UserSessionModel = UserSessionModel.create({
                userId: user.id,
                deviceId
            });
            await this.userSessionRepository.save(userSession);

            // 4. 이메일로 OTP 발송
            await this.mailService.send(dto.email, userSession.otp);
        });
    }

    async retryOtp(deviceId: string, dto: RetryOtpDTO): Promise<void> {
        // 1. 이메일이 존재하는지 채크
        const user: UserModel = await this.userRepository.findUserByEmail(dto.email);
        if (!user) {
            throw new BadRequestException('이메일을 찾을 수 없습니다.');
        }

        // 2. 인증세션이 존재하는지 검증
        let userSession: UserSessionModel = await this.userSessionRepository.findSessionByUserIdWithDeviceId(user.id, deviceId);
        if (!userSession) {
            throw new BadRequestException('인증세션을 찾을 수 없습니다.');
        }

        // 3. 새로운 OTP로 인증세션 업데이트
        userSession = userSession.withUpdateOtp();
        await this.userSessionRepository.save(userSession);

        // 4. 이메일로 OTP 발송
        await this.mailService.send(dto.email, userSession.otp);
    }

    async verifyOtp(device: DeviceDTO, dto: VerifyOtpDTO): Promise<AuthResultDTO> {
        // 1. 이메일이 존재하는지 채크
        const user: UserModel = await this.userRepository.findUserByEmail(dto.email);
        if (!user) {
            throw new BadRequestException('이메일을 찾을 수 없습니다.');
        }

        // 2. 인증세션이 존재하는지 검증
        let userSession: UserSessionModel = await this.userSessionRepository.findSessionByUserIdWithDeviceId(user.id, device.deviceId);
        if (!userSession) {
            throw new BadRequestException('인증세션을 찾을 수 없습니다.');
        }

        // 3. OTP가 유효한지 검증
        if (!userSession.verifyOtp(dto.otp)) {
            throw new BadRequestException('OTP가 유효하지 않습니다.');
        }

        // 4. JWT 토큰 리소스 생성
        const accessToken: string = this.secureTokenService.generateJwtToken(user.id, { deviceId: device.deviceId });
        const expiresIn: number = this.secureTokenService.getJwtExpiresIn(accessToken);
        const refreshToken: string = this.secureTokenService.generateOpaqueToken();

        // 5. 인증세션에 디바이스 정보, 리프레시토큰 업데이트
        userSession = userSession.withUpdateDevice(device.deviceModel, device.deviceOs);
        userSession = userSession.withUpdateRefreshToken(refreshToken);
        await this.userSessionRepository.save(userSession);

        // 6. 토큰 리소스 반환
        return AuthResultDTO.fromSuccess(accessToken, expiresIn, refreshToken);
    }

    async refresh(refreshToken: string): Promise<AuthResultDTO> {
        // 1. 리프레시토큰을 가지는 인증세션이 존재하는지 검증
        let userSession: UserSessionModel = await this.userSessionRepository.findSessionByRefreshToken(refreshToken);
        const errMsg: string = '인증세션이 유효하지 않습니다.';
        if (!userSession) {
            throw new UnauthorizedException(errMsg);
        }

        // 2. 인증세션이 활성상태인지 검증
        if (!userSession.isActivated) {
            throw new UnauthorizedException(errMsg);
        }

        // 3. JWT 토큰 리소스 생성
        const accessToken: string = this.secureTokenService.generateJwtToken(userSession.userId, { deviceId: userSession.deviceId });
        const expiresIn: number = this.secureTokenService.getJwtExpiresIn(accessToken);
        refreshToken = this.secureTokenService.generateOpaqueToken();

        // 4. 새로운 리프레시토큰 업데이트
        userSession = userSession.withUpdateRefreshToken(refreshToken);
        await this.userSessionRepository.save(userSession);

        // 5. 토큰 리소스 반환
        return AuthResultDTO.fromSuccess(accessToken, expiresIn, refreshToken);
    }

    async logout(deviceId: string, user: UserModel) {
        const userSession: UserSessionModel = await this.userSessionRepository.findSessionByUserIdWithDeviceId(user.id, deviceId);
        if (!userSession) {
            throw new BadRequestException('인증세션을 찾을 수 없습니다.');
        }

        await this.userSessionRepository.remove(userSession);
    }
}