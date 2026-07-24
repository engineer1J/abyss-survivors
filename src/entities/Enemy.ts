import Phaser from "phaser";
import { ENEMY_KINDS, type EnemyKindConfig } from "../data/enemyConfig";

export class Enemy extends Phaser.GameObjects.Sprite {
  hp = 0;
  speed = 0;
  contactDamage = 0;
  expValue = 0;
  radius = 0;
  preferredDistance = 0;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, ENEMY_KINDS[0].textureKey);
    scene.add.existing(this);
    this.setActive(false);
    this.setVisible(false);
  }

  spawn(x: number, y: number, kind: EnemyKindConfig): void {
    this.setTexture(kind.textureKey);
    // frame 기준(스케일 미적용) 크기로 계산해야 재사용 시 이전 스케일이 누적되지 않음
    this.setScale(kind.spriteDiameter / Math.max(this.frame.width, this.frame.height));

    this.hp = kind.maxHp;
    this.speed = kind.moveSpeed;
    this.contactDamage = kind.contactDamage;
    this.expValue = kind.expValue;
    this.radius = kind.radius;
    this.preferredDistance = kind.preferredDistance ?? 0;
    this.setPosition(x, y);
  }

  /** 데미지를 적용하고, 체력이 0 이하가 되면 true를 반환한다. */
  takeDamage(amount: number): boolean {
    this.hp -= amount;
    return this.hp <= 0;
  }
}
