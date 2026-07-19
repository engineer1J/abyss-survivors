import Phaser from "phaser";
import { GEM_CONFIG } from "../data/gemConfig";

export class ExpGem extends Phaser.GameObjects.Arc {
  expValue = 0;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, GEM_CONFIG.radius, 0, 360, false, GEM_CONFIG.color);
    scene.add.existing(this);
    this.setActive(false);
    this.setVisible(false);
  }

  drop(x: number, y: number, expValue: number): void {
    this.setPosition(x, y);
    this.expValue = expValue;
  }
}
