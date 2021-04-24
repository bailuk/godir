
import { Cache } from './cache';
import { Directory } from './directory';
import { View } from './view';


export class Controller {

    // view
    private readonly view : View

    // model
    private dir : Directory = null
    private model : Directory[] = []
    private readonly cache = new Cache()

    
    constructor(view : View) {
        this.view = view
        this.view.setController(this)
    }


    public fillList(dirname : string, basename : string) : void {
        this.dir = this.cache.insert(dirname, basename)
        const parent = this.dir.getParent(this.cache)

        this.model = []

        if (parent !== null) {
            this.model.push(parent)
        }

        this.model.push(this.dir)

        this.dir.scan(this.cache)
        this.dir.forEachChild((child: Directory) => {
            this.model.push(child)
        })

        this.syncModelView()
    }


    public select(index : number) {
        if (index < this.model.length) {
            const dir = this.model[index]
            if (dir.equals(this.dir)) {
                console.log(`open ${dir.getPath()}`)
            } else {
                this.fillList(dir.getParentPath(), dir.getName())
            }
        }
    }


    private syncModelView() {
        this.view.listClear()
        this.model.forEach(dir => {
            this.view.listInsertItem(dir)
        })
        this.view.listShowAll()
        this.view.setStatusText(this.dir.getPath())
    }
}

