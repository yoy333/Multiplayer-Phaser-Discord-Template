import {Physics, Scene} from 'phaser'

type playerRep = Phaser.Types.Physics.Arcade.ImageWithDynamicBody

export type playerInfo = {
    x:number,
    y:number,
    rot:number,
    id:string,
    team:string
}

class Player{
  id: string
  x: number
  y: number
  rotation:number
  team:string
  rep:playerRep


  constructor(id: string, x: number, y: number, rotation: number, rep:playerRep){
    this.id = id
    this.x = x;
    this.y = y;
    this.rep = rep;
    this.rotation = rotation;
    this.team = (Math.floor(Math.random() * 2) == 0) ? 'red' : 'blue'
  }

  getInfo():playerInfo{
    return {
        x: this.x,
        y: this.y,
        rot: this.rotation,
        id: this.id,
        team: this.team
    }
  }
}

export class Game extends Scene{
    players:Map<string, Player>

    constructor(){
        super('board')
        this.players = new Map()
    }

    preload(){
        
    }

    create() {
        window.io.on('connection',  (socket)=>{
            console.log(`user ${socket.id} connected`);
            socket.on('disconnect',  () => {
                console.log(`user ${socket.id} disconnected`)
                this.removePlayer(socket.id);
                //socket.emit('disconnect', socket.id);
                socket.disconnect()
            });

            let newPlayer = this.addPlayer(socket.id);
            // send the players object to the new player
            socket.emit('currentPlayers', this.getGameState());
            // update all other players of the new player
            socket.broadcast.emit('newPlayer', newPlayer.getInfo());
        });
    }

    update(){

    }

    addPlayer(id:string):Player {
        let rotation = 0;
        let x = Math.floor(Math.random() * 700)+50;
        let y = Math.floor(Math.random() * 500) + 50;

        const playerRep = this.physics.add.image(x, y, 'ship')
        .setOrigin(0.5, 0.5)
        .setDisplaySize(53, 40);

        playerRep.setDrag(100);
        playerRep.setAngularDrag(100);
        playerRep.setMaxVelocity(200);

        let newPlayer = new Player(id,  x, y, rotation, playerRep)

        this.players.set(id, newPlayer)

        return newPlayer;
    }

    removePlayer(id:string){
        //destroy object in phaser
        this.players.forEach((player) => {
            if (player.id === id) {
                player.rep.destroy();
            }
        });

        // destroy object on our map
        this.players.delete(id);
    }

    getGameState(){
        let arr:playerInfo[] = []
        this.players.forEach(p=>{
            arr.push(p.getInfo())
        })
        return arr;
    }
} 