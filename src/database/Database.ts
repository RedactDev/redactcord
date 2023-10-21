import { MySQLDriver, QuickDB } from "quick.db";
import { YamlConfiguration } from "../configuration/Configuration";
import { RedactError } from "../error/RedactError";
import { MongoDriver } from "quickmongo";
import PostgresAPI from "quickpostgres";
import { Logger } from "../logger/Logger";

export class Database {

    public quick?: QuickDB | PostgresAPI.Client;
    private yamlDatabase: YamlConfiguration;
    private logger: Logger = Logger.getLogger();

    constructor() {
        
        this.yamlDatabase = new YamlConfiguration("redact.database.yml");

        const type  = this.yamlDatabase.getString("type");
        let enabled = this.yamlDatabase.getBoolean("enabled");
        if (!enabled) enabled = false;
        if (!type) throw new RedactError("Invalid Type", "Invalid database type.");

        if (!enabled) {
            this.logger.warn("(Database): The database is not enabled.");
            return;
        }

        switch (type) {
            case "flat": {
                let flatData: { [key: string]: any } | undefined = this.yamlDatabase.getObject("flat");
                if (!flatData) flatData = this.createDefaultFlatData();
                this.quick = new QuickDB({
                    filePath: flatData["filePath"]
                });
                break;
            }
            case "mongo": {
                let flatData: { [key: string]: any } | undefined = this.yamlDatabase.getObject("mongo");
                if (!flatData) flatData = this.createDefaultMongoData();
                this.quick = new QuickDB({
                    driver: new MongoDriver(flatData["url"])
                });
                break;
            }
            case "postgres": {
                let flatData: { [key: string]: any } | undefined = this.yamlDatabase.getObject("postgres");
                if (!flatData) flatData = this.createDefaultPostgresData();
                this.quick = new PostgresAPI.Client(flatData["url"]);
                (async () => {
                    if (this.isPostgres())
                        this.quick.connect();
                })();
                break;
            }
            case "mysql": {
                let flatData: { [key: string]: any } | undefined = this.yamlDatabase.getObject("postgres");
                if (!flatData) flatData = this.createDefaultMySQLData();
                this.quick = new QuickDB({
                    driver: new MySQLDriver({
                        host: flatData["host"],
                        user: flatData["user"],
                        password: flatData["password"],
                        database: flatData["database"],
                    })
                });
                break;
            }
            default: throw new RedactError("Unknown Database Type", "The database type given is unknown.")
        }
    }

    getDatabase(): QuickDB | PostgresAPI.Client | undefined {

        return this.quick;
    }

    isPostgres(): this is { quick: PostgresAPI.Client } {
        return this.quick instanceof PostgresAPI.Client;
    }

    isQuick(): this is { quick: QuickDB } {
        return this.quick instanceof QuickDB;
    }

    createDefaultFlatData() {
        return {
            filePath: ""
        }
    }

    createDefaultMongoData() {
        return {
            url: ""
        }
    }

    createDefaultPostgresData() {
        return {
            url: ""
        }
    }

    createDefaultMySQLData() {
        return {
            host: "",
            user: "",
            database: "",
            password: ""
        }
    }
}