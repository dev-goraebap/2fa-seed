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
}