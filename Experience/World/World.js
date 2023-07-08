import * as THREE from 'three'
import Experience from '../Experience.js'
import Room from './Room.js'
import Floor from './Floor.js'
import Controls from './controls.js'
import Environment from './Environment.js'

export default class World {
  constructor() {
    this.experience = new Experience()
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.canvas = this.experience.canvas
    this.camera = this.experience.camera
    this.resources = this.experience.resources
    this.theme = this.experience.theme

    this.resources.on('ready', () => {
      this.environment = new Environment();
      this.floor = new Floor();
      this.room = new Room();
      this.Controls = new Controls();
    })

    this.theme.on('switch', theme => {
      this.switchTheme(theme)
    })
  }
  switchTheme(theme) {
    if (this.environment) {
      this.environment.switchTheme(theme)
    }
  }

  resize() { }

  update() {
    if (this.room) {
      this.room.update()
    }
    if (this.Controls) {
      this.Controls.update()
    }
  }
}
