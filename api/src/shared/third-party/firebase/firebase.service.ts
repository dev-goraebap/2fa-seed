import { Injectable } from "@nestjs/common";
import * as firebaseAdmin from 'firebase-admin';
import * as firebaseAdminSdk from './firebase-admin-sdk.json';

/**
 * @description
 * 파이어베이스 서비스
 * 
 * - 같은 디렉토리 안에 `firebase-admin-sdk.json` 파일을 위치해주세요.
 * - tsconfig.json 파일에서 `"resolveJsonModule": true` 옵션을 추가해주세요.
 * - [참고 문서] https://firebase.google.com/docs/admin/setup?hl=ko
 */
@Injectable()
export class FirebaseService {

    constructor() {
        firebaseAdmin.initializeApp({
            credential: firebaseAdmin.credential.cert(
                firebaseAdminSdk as firebaseAdmin.ServiceAccount
            )
        });
    }
}