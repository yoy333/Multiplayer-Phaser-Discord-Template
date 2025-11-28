import { Scene } from 'phaser';
import io, {type Socket} from 'socket.io-client'
import {playerInfo} from '../../../authoritative_server/ts/scenes/board'

export class Game extends Scene
{

    socket: typeof Socket | null = null;
    //players:Phaser.GameObjects.Group

    constructor ()
    {
        super('Game');
        //this.players = this.add.group();
    }

    preload(){

    }

    create ()
    {
        this.socket = io()

        this.socket.on('currentPlayers',  (players:playerInfo[]) => {
            if(!this.socket)
                throw new Error("invalid socket id")
            players.forEach( (player)=>{
                if (player.id === (this.socket as typeof Socket).id) {
                    this.displayPlayers(player, 'ship');
                }
            });
        });

        this.input.once('pointerdown', () => {

            this.scene.start('GameOver');

        });
    }

    displayPlayers(playerI:playerInfo, sprite:string) {
        const player = this.add.sprite(playerI.x, playerI.y, sprite).setOrigin(0.5, 0.5).setDisplaySize(53, 40);
        if (playerI.team === 'blue') 
            player.setTint(0x0000ff);
        else 
            player.setTint(0xff0000);
        //player.id = playerI.id;
        //self.players.add(player);
    }
}
