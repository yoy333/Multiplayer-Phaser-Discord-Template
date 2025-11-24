import Phaser from 'phaser'
import { Server as SocketIOServer } from 'socket.io';


// defined in index.js
declare global {
  interface Window {
    gameLoaded: () => void;
    io: SocketIOServer;
  }
}

//const io = new SocketIOServer(window.server);
const config : Phaser.Types.Core.GameConfig = {
  autoFocus: false,
  type: Phaser.HEADLESS,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: {x:0, y: 0}
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

function preload() {}
function create() {
  window.io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
      console.log('user disconnected');
    });
  });
}
function update() {}
const game = new Phaser.Game(config);

window.gameLoaded();