import { BadRequestException, Logger } from "@nestjs/common";
import { ValidationError } from "class-validator";

const validationException = (error: ValidationError) => {
    const firstConstraintKey = Object.keys(error.constraints)[0];
    const firstConstraintMessage = error.constraints[firstConstraintKey];
    Logger.error(firstConstraintMessage);
    return new BadRequestException(firstConstraintMessage);
}

export const validationExceptionFactory = (errors: ValidationError[]): BadRequestException => {
    let error = errors.shift();
    if (error.constraints) {
        return validationException(error);
    }

    if (error.children) {
        error = error.children.shift();
        return validationException(error);
    }

    Logger.error('Validation failed');
    return new BadRequestException('Validation failed');
}