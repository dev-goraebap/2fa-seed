export class BaseFirebaseModel {
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt: Date;

    constructor() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}