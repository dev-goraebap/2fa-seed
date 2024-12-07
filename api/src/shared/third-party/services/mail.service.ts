import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from 'nodemailer';
import { EnvConfig } from "src/shared/config";

@Injectable()
export class MailService {

    private transporter: nodemailer.Transporter;

    constructor(
        private readonly configService: ConfigService<EnvConfig>
    ) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('MAIL_HOST'), // SMTP 서버 주소
            port: this.configService.get('MAIL_PORT'), // SMTP 포트 (일반적으로 587 사용)
            secure: false, // TLS를 사용할지 여부 (true는 포트 465에서 사용)
            auth: {
                user: this.configService.get('MAIL_USERNAME'), // 이메일 계정
                pass: this.configService.get('MAIL_PASSWORD'), // 이메일 비밀번호 또는 앱 비밀번호
            },
        });
    }

    async send(email: string, otp: string) {
        try {
            const info = await this.transporter.sendMail({
                from: '"NestJS App" <no-reply@example.com>',
                to: email,
                subject: '제목',
                text: otp,
            });
            console.log('Email sent:', info.messageId);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }
}