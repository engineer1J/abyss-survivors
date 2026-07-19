import Phaser from "phaser";
import { PLAYER_CONFIG } from "../data/playerConfig";

export class Player extends Phaser.GameObjects.Arc {
  hp: number;
  readonly maxHp: number;
  exp = 0;
  private invulnerableUntil = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, PLAYER_CONFIG.radius, 0, 360, false, PLAYER_CONFIG.color);
    this.maxHp = PLAYER_CONFIG.maxHp;
    this.hp = this.maxHp;
    scene.add.existing(this);
  }

  get isDead(): boolean {
    return this.hp <= 0;
  }

  private get isInvulnerable(): boolean {
    return this.scene.time.now < this.invulnerableUntil;
  }

  takeDamage(amount: number): void {
    if (this.isInvulnerable || this.isDead) return;
    this.hp = Math.max(0, this.hp - amount);
    this.invulnerableUntil = this.scene.time.now + PLAYER_CONFIG.invulnerableMs;
  }

  gainExp(amount: number): void {
    this.exp += amount;
  }
}
