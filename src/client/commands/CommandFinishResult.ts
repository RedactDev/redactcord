export class CommandFinishResult {

    private isVoid: boolean;
    private error: boolean = false;
    private errorValue: string = "";
    private value?: any;

    constructor(isVoid: boolean, value?: any) {
        this.isVoid = isVoid;
        this.value = isVoid ? undefined : value;
    }

    public isResultVoid(): boolean {
        return this.isVoid;
    }

    public setError(error: string) {
        this.isVoid = false;
        this.value = undefined;
        this.error = true;
        this.errorValue = error;
    }

    public getErrorValue(): string {
        return this.errorValue;
    }

    public isError(): boolean {
        return this.error;
    }

    public getResultValue(): any | undefined {
        return this.value;
    }

}