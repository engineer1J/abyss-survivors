import Phaser from "phaser";
import { PLAYER_CONFIG } from "../data/playerConfig";

export class Player extends Phaser.GameObjects.Sprite {
  static readonly textureKey = "player";

  hp: number;
  readonly maxHp: number;
  exp = 0;
  private invulnerableUntil = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, Player.textureKey);
    this.maxHp = PLAYER_CONFIG.maxHp;
    this.hp = this.maxHp;

    // 시각 크기(spriteDiameter)는 충돌 판정 radius와 무관하게 별도로 설정됨
    this.setScale(PLAYER_CONFIG.spriteDiameter / Math.max(this.width, this.height));

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
