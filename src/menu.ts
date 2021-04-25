import { Controller } from './controller'
import { Gdk, Gtk } from './gtk'

export class Menu {
    private controller : Controller = null
    private readonly widget : any
    
    public execution() {
        [{
            label: '_Android Studio',
            action: () => { this.controller.execute('~/android-studio/bin/studio.sh ')}
        },{
            label: '_Visual Code',
            action: () => { this.controller.execute('code ')}
        },{
            label: '_Terminal',
            action: () => { this.controller.execute('xfce4-terminal --default-working-directory=')}
        },{
            label: 'T_hunar',
            action: () => { this.controller.execute('thunar ')}
        }].forEach(element => this.addItem(element))
        this.menu.showAll()
        return this
    }

     
    public location() {
        [{
                label: '_Home',
                action: () => { this.controller.home() }
            },{
                label: '_Parent',
                action: () => { this.controller.parent()}
            },{
                label: '_Root',
                action: () => { this.controller.fillList('/', '/')}
            },{
                label: '_Favorites',
                action: () => { this.controller.home() }
            }
        ].forEach(element => this.addItem(element))
        this.menu.showAll()
        return this
    }


    private addItem(element) {
        const item = new Gtk.MenuItem()
        item.setLabel(element.label)
        item.setUseUnderline(true)
        item.on('activate', element.action)
        this.menu.append(item)
    }

    private readonly menu : any


    constructor(widget: any) {
        this.widget = widget
        this.menu = new Gtk.Menu()
        this.menu.on('hide', ()=>{
            console.log('hide')
        })

        this.menu.on('key-press-event', (key) => {
            if (key.keyval == 65505 || key.keyval == 65506) {
                this.menu.hide()
                return true;
            }
            return false
        })
    }


    public popup() {
        this.menu.popupAtWidget(this.widget, Gdk.Gravity.SOUTH_EAST, Gdk.Gravity.SOUTH_EAST)
        return true
    }

    public setController(controller : any) : void {
        this.controller = controller
    }
}

