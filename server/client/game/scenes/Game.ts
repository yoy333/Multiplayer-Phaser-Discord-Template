import { Scene } from 'phaser';
import io, {type Socket} from 'socket.io-client'
import {playerInfo} from '../../../common/SocketProtocols'
import { ClientModelManager } from '../managers/ClientModelManager';

export class Game extends Scene{

    socket?: typeof Socket;
    model?: ClientModelManager;

    constructor ()
    {
        super('Game');
    }

    preload(){
        
    }


    cursors?:Phaser.Types.Input.Keyboard.CursorKeys
    leftKeyPressed = false
    rightKeyPressed = false
    upKeyPressed = false


    create ()
    {
        this.model = new ClientModelManager(this.add)

        this.socket = io();

        this.socket.on('gameState',  (players:playerInfo[]) => {
            if(!this.socket)
                throw new Error("no socket :(")
            this.model?.addAllPlayers(this.add, players, this.socket?.id)
        });

        this.socket.on('newPlayer', (player:playerInfo)=>{
            this.model?.addPlayer(this.add, player, 'otherPlayer');
        });
        this.socket.on('playerDisconnect',  (id:string)=>{
            console.log(id)
            this.model?.removePlayer(id)
        });

        this.input.once('pointerdown', () => {

            this.scene.start('GameOver');

        });

        this.socket.on('playerUpdates',  (players:playerInfo[])=>{
            this.model?.updateAllPos(players)
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
}
