import { ApiProperty } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { EmailDuplicateCheckResultDTO as TEmailDuplicateCheckDTO } from 'domain-shared/user';

export class EmailDuplicateCheckResultDTO implements TEmailDuplicateCheckDTO {
    @ApiProperty({ description: '중복 여부' })
    readonly isDuplicate: boolean;

    static from(isDuplicate: boolean): EmailDuplicateCheckResultDTO {
        return plainToInstance(EmailDuplicateCheckResultDTO, {
            isDuplicate
        } as EmailDuplicateCheckResultDTO);
    }
}