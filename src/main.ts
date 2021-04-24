import {gi, Gtk} from './gtk'

import {View} from './view'
import {Controller} from './controller'


function main() {
    gi.startLoop()
    Gtk.init()
    const view = new View()
    const controller = new Controller(view)
    controller.fillList('/home', 'lukas')
    
    Gtk.main()
}


console.log('welcome')
main()
console.log('bye')
