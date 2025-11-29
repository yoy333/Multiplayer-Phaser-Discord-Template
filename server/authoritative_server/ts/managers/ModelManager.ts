import {Board} from '../scenes/board'

import {playerInfo, Sendalbe} from '../../../common/SocketProtocols'


const players:Map<string, Player> = new Map()
type playerRep = Phaser.Types.Physics.Arcade.ImageWithDynamicBody

export class ModelManager{
    board:Board

    constructor(board:Board){
        this.board = board;
    }

    addPlayer(id:string):Player {
        let rotation = 0;
        let x = Math.floor(Math.random() * 700)+50;
        let y = Math.floor(Math.random() * 500) + 50;

        const playerRep = this.board.physics.add.image(x, y, 'ship')
        .setOrigin(0.5, 0.5)
        .setDisplaySize(53, 40);

        playerRep.setDrag(100);
        playerRep.setAngularDrag(100);
        playerRep.setMaxVelocity(200);

        let newPlayer = new Player(id,  x, y, rotation, playerRep)

        players.set(id, newPlayer)
        this.board.playerGroup?.add(newPlayer.rep)


        return newPlayer;
    }

    removePlayer(id:string){
        //destroy object in phaser
        players.forEach((player) => {
            if (player.id === id) {
                this.board.playerGroup?.remove(player.rep)
                player.rep.destroy();
            }
        });

        // destroy object on our map
        players.delete(id);
    }

    getGameState():playerInfo[]{
        let arr:playerInfo[] = []
        players.forEach(p=>{
            arr.push(p.getInfo())
        })
        return arr;
    }
}

export class Player implements Sendalbe{
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