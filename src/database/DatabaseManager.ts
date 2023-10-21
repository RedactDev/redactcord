import { Client } from "quickpostgres";
import { RedactError } from "../error/RedactError";
import { Database } from "./Database";

export class DatabaseManager {
    private static databaseManager: DatabaseManager = new DatabaseManager();

    public static getDatabaseManager(): DatabaseManager {
        return this.databaseManager;
    }

    private databases: Map<string, Database> = new Map();
    private defaultDatabase: Database = new Database();

    constructor() {}

    getDatabase(name: string): Database | undefined {
        return this.databases.get(name);
    }
    
    hasDatabase(name: string): boolean {
        return this.databases.has(name);
    }
    registerDatabase(name: string, database: Database): this {
        this.databases.set(name, database);
        return this;
    }
    unregisterDatabase(name: string): this {
        this.databases.delete(name);
        return this;
    }
    setDefaultDatabase(name: string): this {
        const db = this.getDatabase(name);
        if (!db) throw new RedactError("Invalid Database name", "Couldnt' find database in the database list.");
        this.defaultDatabase = db;
        return this;
    }

    getDefaultDatabase(): Database {
        return this.defaultDatabase;
    }
}