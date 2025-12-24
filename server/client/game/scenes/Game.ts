import { Scene } from 'phaser';
import io, {type Socket} from 'socket.io-client'
import {playerInfo} from '../../../common/SocketProtocols'

export class Game extends Scene{

    socket: typeof Socket | null = null;
    playerGroup?:Phaser.GameObjects.Group

    constructor ()
    {
        super('Game');
    }

    preload(){
        
    }

    players?:Map<string, Phaser.GameObjects.Image>

    cursors?:Phaser.Types.Input.Keyboard.CursorKeys
    leftKeyPressed = false
    rightKeyPressed = false
    upKeyPressed = false


    create ()
    {
        this.socket = io();
        console.log(this.socket)
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

        this.socket.on('playerUpdates',  (players:playerInfo[])=>{
            if(!this.players)
                throw new Error("no players")
            players.forEach( (info)=>{
                if(!this.players)
                        throw new Error("no players")
                this.players.forEach(function (player, id) {
                    if (info.id === id) {
                        player.setRotation(info.rotation);
                        player.setPosition(info.x, info.y);
                    }
                });
            });
        });

        if(!this.input.keyboard)
            throw new Error("no keyboard detected")
        this.cursors = this.input.keyboard.createCursorKeys();

        this.leftKeyPressed = false;
        this.rightKeyPressed = false;
        this.upKeyPressed = false;
    }

    update(){
        const left = this.leftKeyPressed;
        const right = this.rightKeyPressed;
        const up = this.upKeyPressed;

        if(!this.cursors)
            throw new Error("no cursors")

        if (this.cursors.left.isDown) {
            this.leftKeyPressed = true;
        } else if (this.cursors.right.isDown) {
            this.rightKeyPressed = true;
        } else {
            this.leftKeyPressed = false;
            this.rightKeyPressed = false;
        }
        if (this.cursors.up.isDown) {
            this.upKeyPressed = true;
        } else {
            this.upKeyPressed = false;
        }

        if(!this.socket)
            throw new Error("no socket")

        if (left !== this.leftKeyPressed || right !== this.rightKeyPressed || up !== this.upKeyPressed)
            this.socket.emit('playerInput', { left: this.leftKeyPressed , right: this.rightKeyPressed, up: this.upKeyPressed });
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
