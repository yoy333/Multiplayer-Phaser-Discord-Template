import Phaser from 'phaser'

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
function create() {}
function update() {}
const game = new Phaser.Game(config);

// gameLoaded defined in index.js
declare global {
  interface Window {
    gameLoaded: () => void; // tells the server to listen
  }
}
window.gameLoaded();