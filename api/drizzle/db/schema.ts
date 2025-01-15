import { sql } from "drizzle-orm";
import { text, sqliteTable, int  } from "drizzle-orm/sqlite-core";

import {USER_RULES} from "domain-shared/user";

const createdAt = int('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date());
const updatedAt = int('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date());
const deletedAt = int('deleted_at');

export const userTable = sqliteTable("users", {
    id: text({ length: 30 }).notNull().primaryKey(),
    nickname: text({ length: USER_RULES.nickname.max }).notNull(),
    email: text({ length: USER_RULES.email.max }).notNull().unique(),
    isEmailVerified: int('is_email_verified', { mode: 'boolean' }).notNull(),
    password: text({ length: 200 }),
    otp: text({ length: USER_RULES.otp.max }),
    otpExpiryDate: int('otp_expiry_date', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    createdAt,
    updatedAt,
    deletedAt
});

export const userSessionTable = sqliteTable("user_sessions", {
    id: text({ length: 30 }).notNull().primaryKey(),
    userId: text({ length: 30 }).notNull().unique(),
    refreshToken: text({ length: 100 }).notNull().unique(),
    refreshTokenExpiryDate: int('refresh_token_expiry_date', { mode: 'timestamp' }),
    lastRefreshingDate: int('last_refreshing_date', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    createdAt,
    updatedAt,
    deletedAt
});
