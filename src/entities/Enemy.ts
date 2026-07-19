import Phaser from "phaser";
import { ENEMY_CONFIG } from "../data/enemyConfig";

export class Enemy extends Phaser.GameObjects.Arc {
  hp = 0;
  speed = 0;
  contactDamage = 0;
  expValue = 0;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, ENEMY_CONFIG.radius, 0, 360, false, ENEMY_CONFIG.color);
    scene.add.existing(this);
    this.setActive(false);
    this.setVisible(false);
  }

  spawn(x: number, y: number): void {
    this.hp = ENEMY_CONFIG.maxHp;
    this.speed = ENEMY_CONFIG.moveSpeed;
    this.contactDamage = ENEMY_CONFIG.contactDamage;
    this.expValue = ENEMY_CONFIG.expValue;
    this.setPosition(x, y);
  }

  /** 데미지를 적용하고, 체력이 0 이하가 되면 true를 반환한다. */
  takeDamage(amount: number): boolean {
    this.hp -= amount;
    return this.hp <= 0;
  }
}
