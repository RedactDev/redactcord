import { readdirSync, statSync } from "fs";
import path from "path";
import { RedactError } from "../error/RedactError";

export class Loader<E> {

    public loadFrom(folder: string, deep: boolean = false, iscwd: boolean = true) {
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
                let p = ``;
                if (iscwd) {
                    p += path.join(process.cwd(), folder, item)
                } else {
                    p += path.join(folder, item)
                }
                const r = require(p);
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