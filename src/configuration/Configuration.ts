import { Collection } from "discord.js";
import { readFileSync, writeFileSync } from "fs";
import lodash from "lodash";

export abstract class Configuration extends Collection<string, any> {

    private content: Record<string, any>;
    public filePath: string;
    public empty: boolean;

    constructor(filePath: string, content: Record<string, any>, empty: boolean) {
        super();
        this.filePath = filePath;
        this.empty = empty;
        this.content = content;;
        for (const [key, value] of Object.entries(content)) {
            this.set(key, value);
        }
    }

    set(key: string, value: any): this {
        super.set(key, value);
        this.content[key] = value;
        return this;
    }

    getBoolean(key: string): boolean | undefined {
        if (!this.has(key))
            return undefined;
        const value = this.get(key);
        if (!value || !lodash.isBoolean(value))
            return undefined;
        return value;
    }

    getString(key: string): string | undefined {
        if (!this.has(key))
            return undefined;
        const value = this.get(key);
        if (!lodash.isString(value))
            return undefined;
        return value;
    }

    getNumber(key: string): number | undefined {
        if (!this.has(key))
            return undefined;
        const value = this.get(key);
        if (!lodash.isNumber(value))
            return undefined;
        return value;
    }

    delete(key: string): boolean {
        const value = super.delete(key);
        if (value)
            delete this.content[key];
        return value;
    }

    getArray<V>(key: string): V[] | undefined {
        if (!this.has(key))
            return undefined;
        const value: V[] | undefined = this.get(key);
        if (!lodash.isArray(value))
            return undefined;
        return value;
    }

    getObject(key: string): object | undefined {
        if (!this.has(key))
            return undefined;
        const value: object | undefined = this.get(key);
        if (!lodash.isObject(value))
            return undefined;
        return value;
    }

    public abstract save(): void;
    
    toJson(): Record<string, any> {
        return this.content;
    }

    isFilled(): this is FullConfiguration {
        return !this.empty
    }

    isEmpty(): this is EmptyConfiguration {
        return this.empty;
    }

    /**
     * 
     * @returns 
     * @deprecated Use Configuration#toJson instead
     */
    toJSON(): any[] {
        return [];
    }
}

export class EmptyConfiguration extends Configuration {
    
    constructor(filePath: string) {
        super(filePath, {}, true);
    }

    public save(): void {
        writeFileSync(this.filePath, JSON.stringify(this.toJson(), null, 4));
    }
}

export class FullConfiguration extends Configuration {
    constructor(filePath: string) {
        super(filePath, JSON.parse(readFileSync(filePath, "utf-8")), false);
    }

    public save(): void {
        writeFileSync(this.filePath, JSON.stringify(this.toJson(), null, 4));
    }
}