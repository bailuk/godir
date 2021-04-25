
import { readdirSync, statSync } from 'fs'
import { Cache } from './cache'
import { dirname, basename } from 'path'


export class Directory {
    private readonly name : string
    private readonly parentPath : string

    private children : Directory[] = []
    private parent : Directory = null

    constructor(parentPath: string, name : string) {
        this.name = name
        this.parentPath = parentPath
    }

    public static split(path: string, onSplit : (parentPath: string, name : string) => void) : void{
        const dirName = dirname(path)
        const baseName = basename(path)

        if (dirName !== null && baseName != null) {
            onSplit(dirName, baseName)
        }
    }

    public scan(cache : Cache) {
        if (this.children.length >  0) return

        const path = this.getPath()

        try {
            const files = readdirSync(path);

            files.forEach(file => {
                if (file.charAt(0) !== '.') { 
                    try {
                        const stats = statSync(`${path}/${file}`)
                        if (stats.isDirectory()) {
                            this.addChild(cache, file)
                        }
                    } catch {
                        console.log(`ERROR: ${path}/${file}`)
                    }
                }
            });
        } catch  {
            console.log(`ERROR: ${path}`)
        }
    }


    public getParent(cache : Cache) : Directory {
        if (this.parent == null) {
            Directory.split(this.getParentPath(), (dirName, baseName) => {
                this.parent = cache.insert(dirName, baseName)
            })
        }

        return this.parent
    }



    public forEachChild(onChild: (child: Directory) => void) : void {
        this.children.forEach(child => {onChild(child)});
    }

    public getName() : string {
        return this.name
    }


    public getPath() : string {
        if (this.parentPath == '/') {
            return `/${this.name}`
        } else {
            return `${this.parentPath}/${this.name}`
        }
    }


    public getParentPath() : string {
        return this.parentPath
    }


    private addChild(cache : Cache, name : string) : void {
        const child : Directory = cache.insert(this.getPath(), name)
        this.children.push(child)
    }


    public scanChildren(cache : Cache) {
        this.forEachChild((child) => {child.scan(cache)})
    }


    public scanRecursive(cache : Cache) {
        this.scan(cache)
        this.forEachChild((child) => {child.scanRecursive(cache)})
    }


    
    public equals(dir : Directory) : boolean {
        return (dir !== null && this.equalsStr(dir.getParentPath(), dir.getName()))
    }

    public equalsStr(path : string, name : string) : boolean {
        return (name == this.getName() && path == this.getParentPath())
    }

    public log() {
        console.log(this.getPath())
    }


    public logChildren() {
        this.forEachChild((child) => {child.log()})
    }


    public logRecursive() {
        this.log()
        this.forEachChild((child) => {child.logRecursive()})
    }
}