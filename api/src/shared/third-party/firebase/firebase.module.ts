import { Module } from "@nestjs/common";

import { cert, initializeApp, ServiceAccount } from "firebase-admin/app";
import { FirestoreService } from "./services";

/**
 * @description
 * 파이어베이스 모듈
 * 
 * - 같은 디렉토리 안에 `firebase-admin-sdk.json` 파일을 위치해주세요.
 * - tsconfig.json 파일에서 `"resolveJsonModule": true` 옵션을 추가해주세요.
 * - [참고 문서] https://firebase.google.com/docs/admin/setup?hl=ko
 */
@Module({
    providers: [
        FirestoreService,
    ],
    exports: [
        FirestoreService,
    ],
})
export class FirebaseModule {

    constructor() {
        import('./firebase-admin-sdk.json').then((serviceAccount) => {
            initializeApp({
                credential: cert(serviceAccount as ServiceAccount),
            });
            console.log('Init Firebase Admin SDK');
        });
    }
}