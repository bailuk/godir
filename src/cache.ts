import { Directory } from "./directory";



export class Cache {

    private readonly maxLen = 50
    private readonly cache : Directory[] = []


    constructor() {}


    private find(parentPath : string, name : string) : Directory {
        let result = null

        this.cache.every((dir) => {
            if (dir.equalsStr(parentPath, name)) {
                result = dir
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


    private push(dir : Directory) : void {
        const len = this.cache.unshift(dir)

        if (len > this.maxLen) {
            this.cache.pop()
        }
    }


    public log() : void {
        this.cache.forEach(dir => {
            dir.log()
        })
    }
}
