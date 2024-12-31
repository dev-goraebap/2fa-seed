import { Injectable } from "@nestjs/common";
import { UserSessionRepository } from "../infra/repositories/user-session.repository";
import { UserSessionModel } from "../models/user-session.model";

@Injectable()
export class UserSessionService {

    constructor(
        private readonly userSessionRepository: UserSessionRepository
    ) { }

    async getUserSessions(userId: string): Promise<UserSessionModel[]> {
        return await this.userSessionRepository.findSessionsByUserId(userId);
    }

    async getUserSession(userId: string, deviceId: string): Promise<UserSessionModel> {
        return await this.userSessionRepository.findSessionByUserIdWithDeviceId(userId, deviceId);
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