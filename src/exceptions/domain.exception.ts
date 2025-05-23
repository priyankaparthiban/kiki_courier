export class DomainException extends Error {
    constructor(message: string) {
        super(`\n\n${message}`);
        this.name = 'DomainException';
    }
}

export class InvalidPackageDetailsException extends DomainException {
    constructor(pkgId: string, reason: string) {
        super(`Invalid package details for ${pkgId}: ${reason}`);
        this.name = 'InvalidPackageDetailsException';
    }
}

export class AllPackageTooHeavyException extends DomainException {
    constructor(message: string) {
        super(`${message}`);
        this.name = 'AllPackageTooHeavyException';
    }
}

export class NoVehiclesAvailableException extends DomainException {
    constructor(message: string) {
        super(`${message}`);
        this.name = 'NoVehiclesAvailableException';
    }
}

export class NoPackagesToScheduleException extends DomainException {
    constructor(message: string) {
        super(`${message}`);
        this.name = 'NoPackagesToScheduleException';
    }
}



