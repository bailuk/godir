import { Directory } from "./directory";



export class Cache {
    private readonly maxLen = 50

    private readonly cache : Directory[] = []

    constructor() {}

    private push(dir : Directory) : void {
        if (this.cache.indexOf(dir) < 0) {
            this.cache.push(dir)

            if (this.cache.length > this.maxLen) {
                this.cache.shift()
            }
        }
    }


    private find(parentPath : string, name : string) {
        let result = null

        this.cache.every((element) => {
            if (element.getName() == name && element.getParentPath() == parentPath) {
                result = element
                return false // break
            } else {
                return true
            }
        })

        return result
    }


    public insert (parentPath : string, name : string) : Directory {
        let result = this.find(parentPath, name)

        if (result == null) {
            result = new Directory(parentPath, name)
            this.push(result)
        }
        return result
    }


    public log() : void {
        this.cache.forEach(element => {
            element.log()
        });
    }
}
