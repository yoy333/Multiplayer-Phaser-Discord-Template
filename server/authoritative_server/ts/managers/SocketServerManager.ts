import {Board} from '../scenes/board'
import { Server as SocketIOServer } from 'socket.io';

export class SocketServerManager{
    board: Board
    io: SocketIOServer

    constructor(board: Board, io:SocketIOServer){
        this.board = board
        this.io = io
    }

    startAcceptingConnection(){
        window.io.on('connection',  (socket)=>{
            console.log(`user ${socket.id} connected`);
            socket.on('disconnect',  () => {
                console.log(`user ${socket.id} disconnected`)
                if(!this.board.model)
                    throw new Error("un-initialized game manager")
                this.board.model.removePlayer(socket.id);
                socket.emit('playerDisconnect', socket.id);
                // socket.disconnect()
            });

            if(!this.board.model)
                    throw new Error("un-initialized game manager")
                
            let newPlayer = this.board.model.addPlayer(socket.id);
            // send the players object to the new player
            socket.emit('gameState', this.board.model.getGameState());
            // update all other players of the new player
            socket.broadcast.emit('newPlayer', newPlayer.getInfo());
        });
    }
}