import { playerInfo, Input } from '../../../common/SocketProtocols';
import {Board} from '../scenes/board'
import { Server as SocketIOServer } from 'socket.io';

export class SocketServerManager{
    board: Board
    io: SocketIOServer

    constructor(board: Board, io:SocketIOServer){
        this.board = board
        this.io = io
    }

    managePlayerEntryExits(
        addPlayer:(id:string)=>[playerInfo[],playerInfo],
        removePlayer:(id:string)=>void
    ){
        this.io.on('connection',  (socket)=>{
            console.log(`user ${socket.id} connected`);
            socket.on('disconnect',  () => {
                console.log(`user ${socket.id} disconnected`)
                removePlayer(socket.id)
                this.io.emit('playerDisconnect', socket.id);
                // socket.disconnect()
            });

            socket.on('playerInput', (inputData)=>{
                this.handlePlayerInput(socket.id, inputData);
            });
            
            let [gameState, newPlayer] = addPlayer(socket.id);

            // send the players object to the new player
            socket.emit('gameState', gameState);
            // update all other players of the new player
            socket.broadcast.emit('newPlayer', newPlayer);
        });
    }

    handlePlayerInput(playerId:string, input:Input) {
        if(!this.board.model)
            throw new Error("no model")

        this.board.model.players.forEach((player, id) => {
            if (playerId === id) {
                if(!this.board.model)
                    throw new Error("no model")
                let player = this.board.model.players.get(id)
                if(!player)
                    throw new Error("player not found at id: "+id)
                player.input = input;
            }
        });
    }
}