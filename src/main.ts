import {gi, Gtk} from './gtk'

import {View} from './view'
import {Controller} from './controller'
import {Directory} from './directory'
import {homedir} from 'os'

function main() {
    gi.startLoop()
    Gtk.init()
    const view = new View()
    const controller = new Controller(view)

    Directory.split(homedir(), (dirName, baseName) => {
        controller.fillList(dirName, baseName)
    })
    Gtk.main()
}


console.log('welcome')
main()
console.log('bye')
