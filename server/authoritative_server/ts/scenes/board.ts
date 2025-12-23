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

        //@ts-ignore
        this.socket = new SocketServerManager(this, window.io)
        this.model = new ModelManager(this)

        this.socket.managePlayerEntryExits(
            (id)=>{
                if(!this.model)
                    throw new Error("model manager undefined")

                let newPlayer = this.model.addPlayer(id);

                return [this.model.getGameState(), newPlayer.getInfo()]
            },
            (id)=>{
                if(!this.model)
                    throw new Error("un-initialized game manager")
                this.model.removePlayer(id);
            }
        )
    }

    update(){
        if(!this.model)
            throw new Error("model not initialized")
        this.model.players.forEach((player, id) => {
            const input = player.input;
            if (input.left) {
                player.rep.setAngularVelocity(-300);
            } else if (input.right) {
                player.rep.setAngularVelocity(300);
            } else {
                player.rep.setAngularVelocity(0);
            }
            if (input.up) {
                this.physics.velocityFromRotation(player.rotation + 1.5, 200, player.rep.body.acceleration);
            } else {
                player.rep.setAcceleration(0);
            }
            
            player.x = player.rep.x;
            player.y = player.rep.y;
            player.rotation = player.rep.rotation;
        });
        this.physics.world.wrap(this.model.players, 5);
        //@ts-ignore
        window.io.emit('playerUpdates', this.model.getGameState());
    }
} 