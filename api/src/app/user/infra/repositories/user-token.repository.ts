import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ActionRepository } from "src/shared/database";

import { UserTokenEntity } from "../entities";

@Injectable()
export class UserTokenRepository implements ActionRepository<UserTokenEntity> {

    constructor(
        @InjectRepository(UserTokenEntity)
        private readonly userTokenRepository: Repository<UserTokenEntity>,
    ) { }

    save(entity: UserTokenEntity): Promise<void | UserTokenEntity> {
        throw new Error("Method not implemented.");
    }

    remove(entity: UserTokenEntity): Promise<void> {
        throw new Error("Method not implemented.");
    }
}