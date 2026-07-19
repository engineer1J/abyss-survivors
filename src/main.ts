import Phaser from "phaser";
import { GameScene } from "./scenes/GameScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "app",
  width: 960,
  height: 640,
  backgroundColor: "#0a0a0f",
  scene: [GameScene],
};

new Phaser.Game(config);
