import { Type } from "@nestjs/common";
import { Timestamp } from "firebase-admin/firestore";

import { plainToInstance } from "class-transformer";
import { OnlyProps } from "domain-shared/base";

/**
 * @description
 * Firestore에서 가져온 문서 데이터를 지정한 클래스 타입의 인스턴스로 변환하는 함수입니다.
 *
 * Firestore 문서 데이터를 직접 가져오면, 날짜/시간 필드(createdAt, updatedAt)는 Firestore의 Timestamp 객체 형태로 반환됩니다.
 * 이 함수에서는 Timestamp를 JavaScript의 Date 객체로 변환한 뒤, plainToInstance를 이용해 지정한 모델 클래스 인스턴스로 변환합니다.
 * 이를 통해 결과로 얻은 인스턴스는 클래스 메서드나 접근자를 정상적으로 사용할 수 있습니다.
 */
export function fromFirebase<T>(modelType: Type<T>, param: any): T {
    if (param.createdAt) {
        param.createdAt = (param.createdAt as Timestamp).toDate();
    }

    if (param.updatedAt) {
        param.updatedAt = (param.updatedAt as Timestamp).toDate();
    }

    return plainToInstance(modelType, param);
}

export class FirebaseModel {
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt: Date;

    constructor() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.deletedAt = null;
    }

    /**
     * @description
     * 인스턴스의 모든 속성 중 함수가 아닌 값만 추출하여 순수 객체로 반환합니다.
     * Firestore에 저장 가능한 형태의 plain object를 얻기 위해 사용합니다.
     */
    toPlainObject(): OnlyProps<this> {
        const data = {} as OnlyProps<this>;
        for (const key of Object.keys(this)) {
            const value = (this as any)[key];
            if (typeof value !== 'function') {
                data[key as keyof OnlyProps<this>] = value;
            }
        }
        return data;
    }
}