import { BadRequestException, Injectable } from "@nestjs/common";

import { SecureTokenService } from "src/shared/security";
import { FirebaseService } from "src/shared/third-party";

import { AuthResultDTO, CreateDeviceDTO } from "../dto";
import { UserSessionRepository } from "../infra/repositories/user-session.repository";
import { UserRepository } from "../infra/repositories/user.repository";
import { UserSessionModel } from "../models/user-session.model";
import { UserModel } from "../models/user.model";

@Injectable()
export class UserSessionService {

    constructor(
        private readonly firebaseService: FirebaseService,
        private readonly secureTokenService: SecureTokenService,
        private readonly userRepository: UserRepository,
        private readonly userSessionRepository: UserSessionRepository,
    ) { }

    async getUserSessions(userId: string): Promise<UserSessionModel[]> {
        return await this.userSessionRepository.findSessionsByUserId(userId);
    }

    async getUserSessionOrThrow(userId: string, deviceId: string): Promise<UserSessionModel> {
        const userSession: UserSessionModel = await this.userSessionRepository.findSessionByUserIdWithDeviceId(userId, deviceId);
        if (!userSession) {
            throw new BadRequestException('인증세션이 유효하지 않습니다.');
        }
        return userSession;
    }

    async create(dto: CreateDeviceDTO): Promise<AuthResultDTO> {
        return this.firebaseService.runInTransaction(async () => {
            // 1. 이메일이 존재하는지 채크
            let user: UserModel = await this.userRepository.findUserByEmail(dto.email);
            if (!user) {
                throw new BadRequestException('이메일을 찾을 수 없습니다.');
            }

            // 2. OTP가 유효한지 검증
            if (!user.verifyOtp(dto.otp)) {
                throw new BadRequestException('OTP가 유효하지 않습니다.');
            }

            // 3. 인증세션 중복 채크
            let userSession: UserSessionModel = await this.userSessionRepository.findSessionByUserIdWithDeviceId(user.id, dto.deviceId);
            if (userSession) {
                throw new BadRequestException('인증세션이 존재합니다.');
            }

            // 4. 인증세션 생성
            const refreshToken: string = this.secureTokenService.generateOpaqueToken();
            userSession = UserSessionModel.from({
                userId: user.id,
                deviceId: dto.deviceId,
                deviceModel: dto.deviceModel,
                deviceOs: dto.deviceOs,
                refreshToken: refreshToken,
            });
            await this.userSessionRepository.save(userSession);

            // 5. 조건적으로 회원 이메일 인증 상태 변경
            if (!user.isEmailVerified) {
                user = user.withUpdateEmailVerified();
                await this.userRepository.save(user);
            }

            // 6. JWT 토큰 리소스 생성
            const accessToken: string = this.secureTokenService.generateJwtToken(user.id, { deviceId: dto.deviceId });
            const expiresIn: number = this.secureTokenService.getJwtExpiresIn(accessToken);

            // 7. 토큰 리소스 반환
            return AuthResultDTO.fromSuccess(accessToken, expiresIn, refreshToken);
        });
    }


    async remove(userSession: UserSessionModel) {
        await this.userSessionRepository.remove(userSession);
    }

    async removes(userSessions: UserSessionModel[]) {
        for (const device of userSessions) {
            await this.remove(device);
        }
    }
}