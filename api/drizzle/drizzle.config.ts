import type { Config } from "drizzle-kit";

/**
 * @description
 * 참고용 drizzle 설정파일 입니다.
 * 같은 경로에 drizzle-dev.config.ts, drizzle-prod.config.ts 파일을 추가하고
 * 환경에 맞게 url, authToken을 설정해주세요.
 */
export default {
    schema: "./db/schema.ts",
    out: "./migrations",
    dialect: "turso",
    dbCredentials: {
        url: '',
        authToken: '',
    },
} satisfies Config;