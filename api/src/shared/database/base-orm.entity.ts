import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from "typeorm";

export class BaseOrmEntity {
    @CreateDateColumn({ comment: '생성일시' })
    readonly createdAt: Date;

    @UpdateDateColumn({ comment: '수정일시' })
    readonly updatedAt: Date;

    @DeleteDateColumn({ comment: '삭제일시' })
    readonly deletedAt: Date;
}