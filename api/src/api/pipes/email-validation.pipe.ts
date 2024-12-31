import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

import { USER_RULES } from 'domain-shared/user';

@Injectable()
export class EmailValidationPipe implements PipeTransform<string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (!USER_RULES.email.regex.test(value)) {
      throw new BadRequestException(USER_RULES.email.regexErrMsg);
    }
    return value;
  }
}