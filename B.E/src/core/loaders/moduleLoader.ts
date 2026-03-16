import fs from "fs"
import path from "path"
import { Express } from "express"

export default function moduleLoader(app: Express) {

    const modulesPath = path.join(__dirname, "../../modules")

    const modules = fs.readdirSync(modulesPath)

    modules.forEach((moduleName) => {
        const routeFile = path.join(
            modulesPath,
            moduleName,
            `${moduleName}.routes`
        )
        console.log(routeFile)

        if (fs.existsSync(routeFile + ".ts") || fs.existsSync(routeFile + ".js")) {

            const routes = require(routeFile).default

            app.use(`/api/${moduleName}`, routes)

        }
    })
}