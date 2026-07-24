import Phaser from "phaser";
import playerSpriteUrl from "../../assets/sprites/player.png";
import enemyAnglerSpriteUrl from "../../assets/sprites/enemy_angler.png";
import enemyTentacleSpriteUrl from "../../assets/sprites/enemy_tentacle.png";
import enemyJellyfishSpriteUrl from "../../assets/sprites/enemy_jellyfish.png";
import { PLAYER_CONFIG } from "../data/playerConfig";
import { ENEMY_CONFIG, ENEMY_KINDS, type EnemyKindConfig } from "../data/enemyConfig";
import { AUTO_WEAPON_CONFIG } from "../data/weaponConfig";
import { GEM_CONFIG } from "../data/gemConfig";
import { HUD_CONFIG } from "../data/hudConfig";
import { ObjectPool } from "../core/ObjectPool";
import { Player } from "../entities/Player";
import { Enemy } from "../entities/Enemy";
import { Projectile } from "../entities/Projectile";
import { ExpGem } from "../entities/ExpGem";

interface WasdKeys {
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
}

const WORLD_GRID_SIZE = 20000;

const ENEMY_SPRITE_URLS: Record<string, string> = {
  enemy_angler: enemyAnglerSpriteUrl,
  enemy_tentacle: enemyTentacleSpriteUrl,
  enemy_jellyfish: enemyJellyfishSpriteUrl,
};

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: WasdKeys;

  private enemyPool!: ObjectPool<Enemy>;
  private projectilePool!: ObjectPool<Projectile>;
  private gemPool!: ObjectPool<ExpGem>;

  private fpsText!: Phaser.GameObjects.Text;
  private enemyCountText!: Phaser.GameObjects.Text;
  private hpBarFill!: Phaser.GameObjects.Rectangle;
  private restartKey!: Phaser.Input.Keyboard.Key;

  private isGameOver = false;

  constructor() {
    super("GameScene");
  }

  preload(): void {
    this.load.image(Player.textureKey, playerSpriteUrl);
    for (const kind of ENEMY_KINDS) {
      this.load.image(kind.textureKey, ENEMY_SPRITE_URLS[kind.textureKey]);
    }
  }

  create(): void {
    this.isGameOver = false;
    this.cameras.main.setBackgroundColor(0x0a0a0f);

    // 이동 확인용 배경 그리드 (색깔 있는 도형만 사용)
    this.add
      .grid(0, 0, WORLD_GRID_SIZE, WORLD_GRID_SIZE, 100, 100, 0x0a0a0f, 1, 0x1c1c28, 1)
      .setOrigin(0.5, 0.5)
      .setDepth(-10);

    this.player = new Player(this, 0, 0);
    this.cameras.main.startFollow(this.player, true, 0.15, 0.15);

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = {
      up: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    this.enemyPool = new ObjectPool(() => new Enemy(this), ENEMY_CONFIG.poolSize);
    this.projectilePool = new ObjectPool(() => new Projectile(this), AUTO_WEAPON_CONFIG.poolSize);
    this.gemPool = new ObjectPool(() => new ExpGem(this), GEM_CONFIG.poolSize);

    this.time.addEvent({
      delay: ENEMY_CONFIG.spawnIntervalMs,
      loop: true,
      callback: () => this.spawnEnemyIfRoom(),
    });

    this.time.addEvent({
      delay: AUTO_WEAPON_CONFIG.fireIntervalMs,
      loop: true,
      callback: () => this.fireWeaponAtNearestEnemy(),
    });

    this.fpsText = this.add
      .text(HUD_CONFIG.fpsText.x, HUD_CONFIG.fpsText.y, "FPS: 0", {
        fontFamily: "monospace",
        fontSize: HUD_CONFIG.fpsText.fontSize,
        color: HUD_CONFIG.fpsText.color,
      })
      .setScrollFactor(0)
      .setDepth(1000);
    this.enemyCountText = this.add
      .text(HUD_CONFIG.enemyCountText.x, HUD_CONFIG.enemyCountText.y, "Enemies: 0", {
        fontFamily: "monospace",
        fontSize: HUD_CONFIG.enemyCountText.fontSize,
        color: HUD_CONFIG.enemyCountText.color,
      })
      .setScrollFactor(0)
      .setDepth(1000);

    this.add
      .rectangle(
        HUD_CONFIG.hpBar.x,
        HUD_CONFIG.hpBar.y,
        HUD_CONFIG.hpBar.width,
        HUD_CONFIG.hpBar.height,
        HUD_CONFIG.hpBar.backgroundColor,
      )
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(1000);
    this.hpBarFill = this.add
      .rectangle(
        HUD_CONFIG.hpBar.x,
        HUD_CONFIG.hpBar.y,
        HUD_CONFIG.hpBar.width,
        HUD_CONFIG.hpBar.height,
        HUD_CONFIG.hpBar.fillColor,
      )
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(1001);

    this.restartKey = this.input.keyboard!.addKey(HUD_CONFIG.restartKey);
  }

  update(_time: number, delta: number): void {
    if (this.isGameOver) {
      if (Phaser.Input.Keyboard.JustDown(this.restartKey)) {
        this.scene.restart();
      }
      return;
    }

    this.updatePlayerMovement(delta);
    this.updateEnemies(delta);
    this.updateProjectiles(delta);
    this.updateGems(delta);
    this.updateHud();

    if (this.player.isDead) {
      this.handleGameOver();
    }
  }

  private updatePlayerMovement(delta: number): void {
    const dt = delta / 1000;
    let moveX = 0;
    let moveY = 0;

    if (this.cursors.left.isDown || this.wasd.left.isDown) moveX -= 1;
    if (this.cursors.right.isDown || this.wasd.right.isDown) moveX += 1;
    if (this.cursors.up.isDown || this.wasd.up.isDown) moveY -= 1;
    if (this.cursors.down.isDown || this.wasd.down.isDown) moveY += 1;

    if (moveX !== 0 || moveY !== 0) {
      const length = Math.hypot(moveX, moveY);
      this.player.x += (moveX / length) * PLAYER_CONFIG.moveSpeed * dt;
      this.player.y += (moveY / length) * PLAYER_CONFIG.moveSpeed * dt;
    }
  }

  private updateEnemies(delta: number): void {
    const dt = delta / 1000;

    for (const enemy of this.enemyPool.actives.slice()) {
      const dx = this.player.x - enemy.x;
      const dy = this.player.y - enemy.y;
      const dist = Math.hypot(dx, dy) || 1;

      // 원거리 부유형: 선호 거리 안으로는 접근하지 않고 그 자리에서 맴돈다
      if (dist > enemy.preferredDistance) {
        enemy.x += (dx / dist) * enemy.speed * dt;
        enemy.y += (dy / dist) * enemy.speed * dt;
      }

      if (dist <= PLAYER_CONFIG.radius + enemy.radius) {
        this.player.takeDamage(enemy.contactDamage);
      }
    }
  }

  private updateProjectiles(delta: number): void {
    for (const projectile of this.projectilePool.actives.slice()) {
      if (!projectile.active) continue;

      const expired = projectile.step(delta);
      if (expired) {
        this.projectilePool.release(projectile);
        continue;
      }

      for (const enemy of this.enemyPool.actives.slice()) {
        if (!enemy.active) continue;

        const dist = Phaser.Math.Distance.Between(projectile.x, projectile.y, enemy.x, enemy.y);
        if (dist <= AUTO_WEAPON_CONFIG.projectileRadius + enemy.radius) {
          this.projectilePool.release(projectile);
          const died = enemy.takeDamage(projectile.damage);
          if (died) this.killEnemy(enemy);
          break;
        }
      }
    }
  }

  private updateGems(delta: number): void {
    const dt = delta / 1000;

    for (const gem of this.gemPool.actives.slice()) {
      const dist = Phaser.Math.Distance.Between(gem.x, gem.y, this.player.x, this.player.y);

      if (dist <= GEM_CONFIG.collectRadius) {
        this.player.gainExp(gem.expValue);
        this.gemPool.release(gem);
        continue;
      }

      if (dist <= PLAYER_CONFIG.pickupRadius) {
        const dx = this.player.x - gem.x;
        const dy = this.player.y - gem.y;
        const d = Math.hypot(dx, dy) || 1;
        gem.x += (dx / d) * GEM_CONFIG.attractSpeed * dt;
        gem.y += (dy / d) * GEM_CONFIG.attractSpeed * dt;
      }
    }
  }

  private updateHud(): void {
    this.fpsText.setText(`FPS: ${Math.round(this.game.loop.actualFps)}`);
    this.enemyCountText.setText(`Enemies: ${this.enemyPool.activeCount}`);

    const hpRatio = Phaser.Math.Clamp(this.player.hp / this.player.maxHp, 0, 1);
    this.hpBarFill.setSize(HUD_CONFIG.hpBar.width * hpRatio, HUD_CONFIG.hpBar.height);
  }

  private killEnemy(enemy: Enemy): void {
    const gem = this.gemPool.acquire();
    gem.drop(enemy.x, enemy.y, enemy.expValue);
    this.enemyPool.release(enemy);
  }

  private spawnEnemyIfRoom(): void {
    if (this.isGameOver) return;
    if (this.enemyPool.activeCount >= ENEMY_CONFIG.maxAlive) return;

    const cam = this.cameras.main;
    const viewRadius = Math.hypot(cam.width, cam.height) / 2 / cam.zoom + ENEMY_CONFIG.spawnMargin;
    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
    const x = this.player.x + Math.cos(angle) * viewRadius;
    const y = this.player.y + Math.sin(angle) * viewRadius;

    this.enemyPool.acquire().spawn(x, y, this.pickEnemyKind());
  }

  private pickEnemyKind(): EnemyKindConfig {
    const totalWeight = ENEMY_KINDS.reduce((sum, kind) => sum + kind.spawnWeight, 0);
    let roll = Phaser.Math.FloatBetween(0, totalWeight);

    for (const kind of ENEMY_KINDS) {
      roll -= kind.spawnWeight;
      if (roll <= 0) return kind;
    }
    return ENEMY_KINDS[ENEMY_KINDS.length - 1];
  }

  private fireWeaponAtNearestEnemy(): void {
    if (this.isGameOver) return;

    const target = this.findNearestEnemy();
    if (!target) return;

    const dx = target.x - this.player.x;
    const dy = target.y - this.player.y;
    const dist = Math.hypot(dx, dy) || 1;
    if (dist > AUTO_WEAPON_CONFIG.targetRange) return;

    this.projectilePool.acquire().fire(this.player.x, this.player.y, dx / dist, dy / dist);
  }

  private findNearestEnemy(): Enemy | null {
    let nearest: Enemy | null = null;
    let nearestDistSq = Infinity;

    for (const enemy of this.enemyPool.actives) {
      const distSq = Phaser.Math.Distance.Squared(this.player.x, this.player.y, enemy.x, enemy.y);
      if (distSq < nearestDistSq) {
        nearestDistSq = distSq;
        nearest = enemy;
      }
    }

    return nearest;
  }

  private handleGameOver(): void {
    this.isGameOver = true;
    this.time.removeAllEvents();

    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    this.add
      .text(centerX, centerY, "GAME OVER", {
        fontFamily: "monospace",
        fontSize: HUD_CONFIG.gameOverText.fontSize,
        color: HUD_CONFIG.gameOverText.color,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(2000);

    this.add
      .text(centerX, centerY + HUD_CONFIG.restartHintText.offsetY, "Press R to Restart", {
        fontFamily: "monospace",
        fontSize: HUD_CONFIG.restartHintText.fontSize,
        color: HUD_CONFIG.restartHintText.color,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(2000);
  }
}
