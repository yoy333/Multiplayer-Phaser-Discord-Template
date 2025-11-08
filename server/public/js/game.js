import * as Phaser from './phaser.esm.min.js'
var config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};
console.log(Phaser.Math)
var game = new Phaser.Game(config);
function preload() {}
function create() {}
function update() {}