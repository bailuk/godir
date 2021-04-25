
import { Cache } from './cache';
import { Directory } from './directory';
import { View } from './view';

import { exec } from 'child_process';

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
        this.view.list.select(1)
    }


    public updateFilter(filter : string) {
        filter = filter.trim().toLowerCase()

        if (filter == '.') {
            filter = ''
        }
        
        if (filter == '..') {
            this.unfilterList()
            this.view.list.select(0)
        } else if (filter !== '') {
            this.filterList(filter)
        } else {
            this.unfilterList()
        }
    }


    public unfilterList() {
        this.fillList(this.dir.getParentPath(), this.dir.getName())
    }

    public filterList(filter : string) {
        this.model = []

        this.dir.forEachChild((child: Directory) => {
            if (child.getName().toLowerCase().includes(filter)) {
                this.model.push(child)
            }
        })

        this.syncModelView()
        this.view.list.select(0)
    }


    public select(index : number) {
        if (index < this.model.length) {
            const dir = this.model[index]
            if (dir.equals(this.dir)) {
                this.runThunar(dir)
                
            } else {
                this.fillList(dir.getParentPath(), dir.getName())
            }
        }
    }


    public runThunar(dir : Directory) {    
        const command = `thunar ${dir.getPath()}`

        exec(command, (err, stdout, stderr) => {
            if (err) {
                console.log(`ERROR: ${command}`)
                return;
            }
      
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
      });
    }
      

    private syncModelView() {
        this.view.list.clear()
        this.model.forEach(dir => {
            let path = dir.getParentPath()
            let name = dir.getName()

            if (path == '/') path = ''


            if (dir.equals(this.dir)) {
                this.view.list.insert(`<big>${path}/<b>${name}</b></big>`)
            } else {
                this.view.list.insert(`${path}/<b>${name}</b>`)
            }
        })
        this.view.list.showAll()
        this.view.setStatusText(this.dir.getPath())
    }
}

