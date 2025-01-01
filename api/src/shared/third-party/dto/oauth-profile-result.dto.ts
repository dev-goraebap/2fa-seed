import { ApiProperty } from "@nestjs/swagger";

export class OAuthProfileResultDTO {
    @ApiProperty()
    readonly socialId: string;

    @ApiProperty()
    readonly email?: string;

    @ApiProperty()
    readonly nickname?: string;

    @ApiProperty()
    readonly profileImageUrl?: string;
}