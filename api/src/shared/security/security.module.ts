import { Global, Module } from "@nestjs/common";
import { SecureTokenService } from "./services";

@Global()
@Module({ 
    providers: [
        SecureTokenService
    ],
    exports: [
        SecureTokenService
    ],
})
export class SecurityModule {}