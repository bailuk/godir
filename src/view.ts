
import { Gdk, Gtk } from './gtk'
import { ListView } from './list';
import { Menu } from './menu';

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

    public readonly status : any
    public readonly list : ListView
    public readonly search : any
    public readonly menu : Menu
    public readonly locationMenu : Menu

    private scrolled : any

    private controller : any = null

    
    constructor() {
        const win = this.createWindow()
        this.connectSignals(win)

        

        this.search =  new Gtk.SearchEntry()
        this.search.on('search-changed', () => {
            this.controller.updateFilter(this.search.getText())
        })

        this.status = this.statusCreate()
        this.list = new ListView()

        win.add(this.createVBox())
        win.showAll()

        this.menu = new Menu(this.scrolled).execution()
        this.locationMenu = new Menu(this.scrolled).location()
    }

    
    public setController(controller : any) : void {
        this.controller = controller
        this.list.setController(controller)
        this.menu.setController(controller)
        this.locationMenu.setController(controller)
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


            if (key.state == 20) {

                if (key.keyval == 102 || key.keyval == 115) {
                    this.search.grabFocus()
                    return true
                }


                if (key.keyval == 104 || key.keyval == 65360) {
                    this.controller.home()
                    return true
                } 

                if (key.keyval == 117 || key.keyval == 65362) {
                    this.controller.parent()
                    return true
                } 
            }

            if (key.keyval == 65505) {
                this.menu.popup()
                return true
            }


            if (key.keyval == 65506) {
                this.locationMenu.popup()
                return true
            }

            if (key.keyval == 65289) {
                if (!this.search.hasFocus()) {
                    this.search.grabFocus()
                    return true
                }
            }


            if (key.keyval == KEY_ESC) {
                Gtk.mainQuit()
                return true
            }

            if (key.keyval == KEY_ENTER) {
                return this.controller.select()
            }

            console.log(key.string, key.keyval, key.state)
            return false
        })
    }


    private createHBox() : any {
        const hbox = new Gtk.HBox()

        const places = new Gtk.PlacesSidebar()
        places.on('open-location', (location, flags) => {
            console.log(location.getBasename, location.getParseName)
        })
        hbox.packStart(places, false, true, this.PADDING)

        const vbox = this.createVBox()
        hbox.packStart(vbox, true, true, this.PADDING)
        return hbox
    }

    private createVBox() : any {
        const vbox = new Gtk.VBox()

        vbox.packStart(this.status, false, true, this.PADDING)
        vbox.packStart(this.search, false, true, this.PADDING)

        this.scrolled = new Gtk.ScrolledWindow()
        vbox.packStart(this.scrolled, true, true, this.PADDING)
        this.scrolled.add(this.list.getWidget())

        const link = new Gtk.LinkButton()
        vbox.packEnd(link, false, true, this.PADDING)
        link.setUri('https://github.com/bailuk/godir')
        link.setLabel('About')
    
        const info = new Gtk.Label()
        vbox.packEnd(info, false, true, this.PADDING)
        info.setText('Ctl+h: Home, Ctl+u: Parent')
   
        return vbox;
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

