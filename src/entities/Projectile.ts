import Phaser from "phaser";
import { AUTO_WEAPON_CONFIG } from "../data/weaponConfig";

export class Projectile extends Phaser.GameObjects.Arc {
  private vx = 0;
  private vy = 0;
  damage = 0;
  private remainingMs = 0;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, AUTO_WEAPON_CONFIG.projectileRadius, 0, 360, false, AUTO_WEAPON_CONFIG.projectileColor);
    scene.add.existing(this);
    this.setActive(false);
    this.setVisible(false);
  }

  fire(x: number, y: number, dirX: number, dirY: number): void {
    this.setPosition(x, y);
    this.vx = dirX * AUTO_WEAPON_CONFIG.projectileSpeed;
    this.vy = dirY * AUTO_WEAPON_CONFIG.projectileSpeed;
    this.damage = AUTO_WEAPON_CONFIG.damage;
    this.remainingMs = AUTO_WEAPON_CONFIG.lifetimeMs;
  }

  /** 이동시키고, 수명이 다 되었으면 true(반납 필요)를 반환한다. */
  step(deltaMs: number): boolean {
    const dt = deltaMs / 1000;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.remainingMs -= deltaMs;
    return this.remainingMs <= 0;
  }
}
