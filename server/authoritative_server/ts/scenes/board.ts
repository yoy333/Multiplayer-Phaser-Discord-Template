import {Scene} from 'phaser'

import { SocketServerManager } from '../managers/SocketServerManager'
import {ModelManager} from '../managers/ModelManager'

export class Board extends Scene{
    constructor(){
        super('board')
    }

    preload(){
        
    }

    playerGroup?: Phaser.Physics.Arcade.Group
    socket?: SocketServerManager
    model?: ModelManager

    create() {
        this.playerGroup = this.physics.add.group()

        this.socket = new SocketServerManager(this, window.io)
        this.model = new ModelManager(this)

        this.socket.startAcceptingConnection()
    }

    update(){

    }
} 