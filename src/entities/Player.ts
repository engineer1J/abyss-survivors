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

    // 예전 원(Arc)과 비슷한 크기로 보이도록 반지름*2를 스프라이트의 긴 변에 맞춰 스케일
    const targetDiameter = PLAYER_CONFIG.radius * 2;
    this.setScale(targetDiameter / Math.max(this.width, this.height));

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
