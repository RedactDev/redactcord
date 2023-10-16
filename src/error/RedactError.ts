export class RedactError extends Error {

    constructor(name: string, message: string) {
        super(`${name}: ${message}`);
    }

}