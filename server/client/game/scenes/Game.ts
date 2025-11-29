import { Scene } from 'phaser';
import io, {type Socket} from 'socket.io-client'
import {playerInfo} from '../../../common/SocketProtocols'

export class Game extends Scene
{

    socket: typeof Socket | null = null;
    playerGroup?:Phaser.GameObjects.Group

    constructor ()
    {
        super('Game');
    }

    preload(){
        
    }

    players?:Map<string, Phaser.GameObjects.Image>

    create ()
    {
        this.socket = io();
        this.playerGroup = this.add.group();
        this.players = new Map()

        this.socket.on('gameState',  (players:playerInfo[]) => {
            console.log("gameState")
            if(!this.socket)
                throw new Error("invalid socket id")
            players.forEach( (player)=>{
                if (player.id === (this.socket as typeof Socket).id) {
                    this.displayPlayers(player, 'ship');
                } else {
                    this.displayPlayers(player, 'otherPlayer');
                }
            });
        });

        this.socket.on('newPlayer', (player:playerInfo)=>{
            console.log("new player")
            this.displayPlayers(player, 'otherPlayer');
        });
        this.socket.on('playerDisconnect',  (playerID:string)=>{
            console.log(playerID)
            if(!this.players)
                throw new Error("players group not created")
            this.players.forEach( (rep, id) => {
                if(playerID == id){
                    rep.destroy()
                    this.players?.delete(id)
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
        
        console.log(playerI.x, playerI.y, playerI.team)

        if (playerI.team === 'blue') 
            player.setTint(0x0000ff);
        else 
            player.setTint(0xff0000);
        
        if(!this.players)
            throw new Error("player map not created")
        this.players.set(playerI.id, player)
    }
}
