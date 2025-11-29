import { Scene } from 'phaser';
import io, {type Socket} from 'socket.io-client'
import {playerInfo} from '../../../common/SocketProtocols'

export class Game extends Scene
{

    socket: typeof Socket | null = null;
    players?:Phaser.GameObjects.Group

    constructor ()
    {
        super('Game');
    }

    preload(){

    }

    create ()
    {
        this.socket = io();
        this.players = this.add.group();

        this.socket.on('gameState',  (players:playerInfo[]) => {
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
        const player = this.add.image(playerI.x, playerI.y, sprite)
         .setOrigin(0.5, 0.5).setDisplaySize(53, 40);
        
        if (playerI.team === 'blue') 
            player.setTint(0x0000ff);
        else 
            player.setTint(0xff0000);
        
    }
}
