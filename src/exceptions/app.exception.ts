export class AppException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AppException';
    }
}

export class InvalidEnvVariableException extends AppException {
    constructor(key: string, message?: string) {
        super(`Invalid environment variable '${key}': ${message ?? 'Invalid or missing value'}`);
        this.name = 'InvalidEnvVariableException';
    }
}

export class InvalidOfferConfigException extends AppException {
    constructor(message: string) {
        super(`Invalid Offer Config: ${message}`);
        this.name = 'InvalidOfferConfigException';
    }
}

export class InvalidInputFormatException extends AppException {
    constructor(expected: string) {
        super(`Invalid input format. Expected: ${expected}`);
        this.name = 'InvalidInputFormatException';
    }
}

export class MissingInputException extends AppException {
    constructor(field: string) {
        super(`Missing input. Expected: ${field}`);
        this.name = 'MissingInputException';
    }
}

export class InsufficientInputException extends AppException {
    constructor(message: string) {
        super(`Insufficient Input. Expected: ${message}`);
        this.name = 'MissingInputException';
    }
}

export class UnknownException extends AppException {
    constructor(message: string) {
        super(`${message}`);
        this.name = 'UnknownException';
    }
}
