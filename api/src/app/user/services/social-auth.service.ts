import { BadRequestException, Injectable } from "@nestjs/common";

import { SecureTokenService } from "src/shared/security";
import { FirebaseService, MailService } from "src/shared/third-party";

import { AuthResultDTO, SocialRegisterDTO } from "../dto";
import { UserSessionRepository } from "../infra/repositories/user-session.repository";
import { UserSocialRepository } from "../infra/repositories/user-social.repository";
import { UserRepository } from "../infra/repositories/user.repository";
import { UserSessionModel } from "../models/user-session.model";
import { UserSocialModel } from "../models/user-social.model";
import { UserModel } from "../models/user.model";
import { generateRandomNickname } from "../utils/generate-random-nickname";

@Injectable()
export class SocialAuthService {

    constructor(
        private readonly firebaseService: FirebaseService,
        private readonly mailService: MailService,
        private readonly secureTokenService: SecureTokenService,
        private readonly userSocialRepository: UserSocialRepository,
        private readonly userSessionRepository: UserSessionRepository,
        private readonly userRepository: UserRepository,
    ) { }

    async login(socialId: string, deviceId: string): Promise<AuthResultDTO> {
        // 1. 소셜 회원이 없으면 소셜 회원가입 필요
        const social: UserSocialModel = await this.userSocialRepository.findSocialBySocialId(socialId);
        if (!social) {
            return AuthResultDTO.fromNeedSocialRegister();
        }

        // 2. 인증세션이 없으면 OTP 인증 필요
        let userSession: UserSessionModel = await this.userSessionRepository.findSessionByUserIdWithDeviceId(social.userId, deviceId);
        if (!userSession) {
            let user: UserModel = await this.userRepository.findUserById(social.userId);
            user = user.withUpdateOtp();
            await this.userRepository.save(user);
            await this.mailService.send(user.email, user.otp);
            return AuthResultDTO.fromNeedOtp();
        }

        // 3. JWT 토큰 리소스 생성
        const accessToken: string = this.secureTokenService.generateJwtToken(userSession.id, { deviceId });
        const expiresIn: number = this.secureTokenService.getJwtExpiresIn(accessToken);
        const refreshToken: string = this.secureTokenService.generateOpaqueToken();

        // 4. 새로운 리프레시토큰을 인증세션에 업데이트
        userSession = userSession.withUpdateRefreshToken(refreshToken);
        await this.userSessionRepository.save(userSession);

        // 5. 토큰 리소스 반환
        return AuthResultDTO.fromSuccess(accessToken, expiresIn, refreshToken);
    }

    async register(socialId: string, dto: SocialRegisterDTO): Promise<void> {
        return await this.firebaseService.runInTransaction(async () => {
            // 1. 이메일 중복 채크
            let user: UserModel = await this.userRepository.findUserByEmail(dto.email);
            if (user) {
                throw new BadRequestException('이미 가입된 이메일입니다.');
            }

            // 2. 소셜 중복 채크
            let social: UserSocialModel = await this.userSocialRepository.findSocialBySocialId(socialId);
            if (social) {
                throw new BadRequestException('이미 가입된 소셜 계정입니다.');
            }

            // 3. 회원 모델 생성 및 저장
            const randomNickname: string = generateRandomNickname();
            user = UserModel.create({
                email: dto.email,
                nickname: randomNickname,
            });
            console.log(user);
            await this.userRepository.save(user);

            // 4. 소셜 회원 모델 생성 및 저장
            social = UserSocialModel.create({
                provider: dto.provider,
                socialId: socialId,
                userId: user.id,
            });
            console.log(social);
            await this.userSocialRepository.save(social);

            // 5. 이메일로 OTP 발송
            await this.mailService.send(dto.email, user.otp);
        });
    }
}