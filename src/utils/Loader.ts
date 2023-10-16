import { readdirSync, statSync } from "fs";
import path from "path";
import { RedactError } from "../error/RedactError";

export class Loader<E> {

    public loadFrom(folder: string, deep: boolean = false) {
        const arr: E[] = [];
        const hirearchy = readdirSync(folder);

        for (const item of hirearchy) {

            if (statSync(path.join(folder, item)).isDirectory())
            {
                if (deep)
                    arr.push(...(this.loadFrom(path.join(folder, item))));
            }
            else
            {
                if (!item.endsWith(".js") || !item.endsWith(".ts"))
                    throw new RedactError("Invalid Extension", "An invalid extension was found in a file name: \"" + item + "\". Make sure it's .ts or .js");
                const r = require(path.join(folder, item));
                let clazz: E;
                try {
                    clazz = r();
                } catch (err) {
                    throw new RedactError("Not Exported", "The class exported in " + item + " is either null. Please check the class again.");
                }

                arr.push(clazz);
            }

        }

        return arr;
    }

}