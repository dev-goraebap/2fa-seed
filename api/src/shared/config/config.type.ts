export type EnvConfig = {
    // 앱 기본 설정
    APP_PORT: string;

    // DB 설정
    DB_HOST: string;
    DB_PORT: string;
    DB_NAME: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_LOGGING: string;

    // 메일 설정
    MAIL_HOST: string;
    MAIL_PORT: string;
    MAIL_USERNAME: string;
    MAIL_PASSWORD: string;

    // 카카오 설정
    KAKAO_CLIENT_ID: string;
    KAKAO_REDIRECT_URI: string;

    // 구글 설정
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_REDIRECT_URI: string;

    // 보안토큰 설정
    ACCESS_TOKEN_SECRET: string;
    ACCESS_TOKEN_EXPIRES_IN: string;
    REFRESH_TOKEN_EXPIRES_IN: string;
}