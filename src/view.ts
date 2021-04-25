
import { Gtk } from './gtk'
import { ListView } from './list';

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
    public  readonly list : ListView
    private readonly search : any

    private controller : any = null

    
    constructor() {
        const win = this.createWindow()
        this.connectSignals(win)

        this.search =  new Gtk.SearchEntry()

        this.status = this.statusCreate()
        this.list = new ListView()

        this.createVBox(win)
        
        win.showAll()
    }

    
    public setController(controller : any) : void {
        this.controller = controller
        this.list.setController(controller)
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

            if (key.keyval == 65289) {
                if (this.search.hasFocus()) {
                    this.list.grabFocus()
                } else {
                    this.search.grabFocus()
                }
                return true
            }
                
            if (key.keyval == KEY_ESC) {
                Gtk.mainQuit()
                return true
            }

            if (key.keyval == KEY_ENTER) {
                const index = this.list.getSelectedIndex()
                if (index > -1) {
                    this.controller.select(index)
                    this.search.grabFocus()
                    return true
                }
            }

            /*
            if (key.keyval == KEY_UP) {
                const index = this.list.getSelectedIndex()
                if (index > 0) this.list.select(index-1)
                this.search.grabFocus()
                return true
            }

            if (key.keyval == KEY_DOWN) {
                const index = this.list.getSelectedIndex()
                if (index > -1) this.list.select(index+1)
                this.search.grabFocus()
                return true
            }
            */
            console.log(key.string, key.keyval, key.state)
            return false
        })
    }



    private createVBox(win: any) {
        const vbox = new Gtk.VBox()
        win.add(vbox)

        vbox.packStart(this.status, false, true, this.PADDING)
        vbox.packStart(this.search, false, true, this.PADDING)

        const scrolled = new Gtk.ScrolledWindow()
        vbox.packStart(scrolled, true, true, this.PADDING)
        scrolled.add(this.list.getWidget())

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

    public setStatusText(text : string) : void {
        this.status.setText(text)
    }
}

