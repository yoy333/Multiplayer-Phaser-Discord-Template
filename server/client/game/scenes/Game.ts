import { Scene } from 'phaser';
import {io, Socket} from 'socket.io-client'

export class Game extends Scene
{

    socket:null|Socket = null;

    constructor ()
    {
        super('Game');
    }

    preload(){

    }

    create ()
    {
        this.socket = io()

        this.input.once('pointerdown', () => {

            this.scene.start('GameOver');

        });
    }
}
