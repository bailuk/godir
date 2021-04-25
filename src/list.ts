
import { Gtk } from './gtk'
import { Directory } from './directory';
import { Controller } from './controller';


export class ListView {
    readonly PADDING : Number = 5

    private readonly list : any
    private controller : any

    
    constructor() {
        this.list = new Gtk.ListBox()
        this.list.setActivateOnSingleClick(false)
    }


    public setController(controller : Controller) : void {
        if (controller == null) {
            this.controller = controller
            this.list.on('row-activated', (row : any) => {
                const index = row.getIndex()
                this.controller.select(index)
            })
        }
    }

    public getWidget() : any {
        return this.list;
    }
    

    public getSelectedIndex() : number {
        const row = this.list.getSelectedRow()
        if (row !== null) return row.getIndex()
        return -1
    }

    public clear() : void {
        const children  = this.list.getChildren()

        children.forEach(element => {
            this.list.remove(element)
        });
        
    }

    public insert(markup : string) : void {
        let item  = new Gtk.Label()
        item.setMarkup(markup)
        item.setBack
        item.setPadding(this.PADDING, this.PADDING)
        item.setHalign(Gtk.Align.START)
        this.list.insert(item, -1)
    }

    public select(rowIndex: number) : void {
        const row = this.list.getRowAtIndex(rowIndex)
        if (row !== null) {
            row.grabFocus()
            this.list.selectRow(row)
        }
    }

    public showAll() : void {
        this.list.showAll()
    }
}

