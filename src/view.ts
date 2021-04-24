
import { Gtk } from './gtk'
import { Directory } from './directory';

const KEY_SPC   = 32
const KEY_G     = 103
const KEY_N     = 110
const KEY_P     = 112
const KEY_DOWN  = 65364
const KEY_LEFT  = 65361
const KEY_RIGHT = 65363
const KEY_UP    = 65362
const KEY_ESC   = 65307
const KEY_ENTER = 65293

export class View {
    readonly PADDING : Number = 5

    private readonly status : any
    private readonly list : any
    private readonly search : any

    private controller : any = null

    
    constructor() {
        const win = this.createWindow()
        this.connectSignals(win)

        this.search =  new Gtk.SearchEntry()
        this.status = this.statusCreate()
        this.list = this.listCreate()

        this.createVBox(win)
        
        win.showAll()
    }

    public setController(controller : any) : void {
        this.controller = controller
    }

    private createWindow() {
        const result = new Gtk.Window({
            title: 'GoDir',
            type: Gtk.WindowType.TOPLEVEL,
            window_position: Gtk.WindowPosition.CENTER
        })
        result.setDefaultSize(600, 500)
        return result
    }


    private connectSignals(win: any) {
        win.on('destroy', Gtk.mainQuit)
        // win.on('focus-out-event', () => {
        //     Gtk.mainQuit()
        //     return true
        // })
        
        win.on('key-press-event', (key) => {

            if (key.keyval == KEY_ESC) {
                Gtk.mainQuit()
                return true
            }

            if (key.keyval == KEY_ENTER) {
                const index = this.listGetSelectedIndex()
                if (index > -1) {
                    this.controller.select(index)
                    return true
                }
            }

            if (key.keyval == KEY_UP) {
                const index = this.listGetSelectedIndex()
                if (index > 0) this.listSelectRow(index-1)
                return true
            }

            if (key.keyval == KEY_DOWN) {
                const index = this.listGetSelectedIndex()
                if (index > -1) this.listSelectRow(index+1)
                return true
            }

            console.log(key.string, key.keyval, key.state)
            return false
        })
    }


    private listGetSelectedIndex() {
        const row = this.list.getSelectedRow()
        if (row !== null) return row.getIndex()
        return -1
    }

    private createVBox(win: any) {
        const vbox = new Gtk.VBox()
        win.add(vbox)

        vbox.packStart(this.status, false, true, this.PADDING)
        vbox.packStart(this.search, false, true, this.PADDING)

        const scrolled = new Gtk.ScrolledWindow()
        vbox.packStart(scrolled, true, true, this.PADDING)
        scrolled.add(this.list)

        const link = new Gtk.LinkButton()
        vbox.packEnd(link, false, true, this.PADDING)
        link.setUri('https://github.com/bailuk/godir')
        link.setLabel('About')
    
        const info = new Gtk.Label()
        vbox.packEnd(info, false, true, this.PADDING)
        info.setText('Info')
    }

    private statusCreate() : any {
        const status = new Gtk.Label()
        status.setHalign(Gtk.Align.START)
        return status
    }

    private listCreate() : any {
        const list = new Gtk.ListBox()
        list.setActivateOnSingleClick(false)
        list.on('row-activated', (row : any) => {
            const index = row.getIndex()
            this.controller.select(index)
        })

        return list
    }

    public listClear() : void {
        const children  = this.list.getChildren()

        children.forEach(element => {
            this.list.remove(element)
        });
        
    }

    public listInsertItem(dir : Directory) : void {
        let item  = new Gtk.Label()
        item.setText(dir.getPath())
        item.setPadding(this.PADDING, this.PADDING)
        item.setHalign(Gtk.Align.START)
        this.list.insert(item, -1)
    }

    listSelectRow(rowIndex: number) {
        const row = this.list.getRowAtIndex(rowIndex)
        if (row !== null) {
            this.list.selectRow(row)
            this.search.grabFocus()
        }
    }

    public listShowAll() : void {
        this.list.showAll()
    }

    public setStatusText(text : string) : void {
        this.status.setText(text)
    }
}

