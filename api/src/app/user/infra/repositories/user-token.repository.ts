import { Injectable } from "@nestjs/common";
import { UserTokenModel } from "../../models";


@Injectable()
export class UserTokenRepository {

    async findUserTokenByRefreshToken(refreshToken: string): Promise<UserTokenModel> {
        return null;
    }

    async save(entity: UserTokenModel): Promise<void | UserTokenModel> {
        return null;
    }

    async remove(entity: UserTokenModel): Promise<void> {

    }
}