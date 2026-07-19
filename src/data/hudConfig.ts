import Phaser from "phaser";

export const HUD_CONFIG = {
  fpsText: { x: 10, y: 10, fontSize: "16px", color: "#ffffff" },
  enemyCountText: { x: 10, y: 30, fontSize: "16px", color: "#ffffff" },
  hpBar: {
    x: 10,
    y: 54,
    width: 200,
    height: 16,
    backgroundColor: 0x330000,
    fillColor: 0x4dff88,
  },
  gameOverText: { fontSize: "48px", color: "#ff4d6d" },
  restartHintText: { fontSize: "18px", color: "#ffffff", offsetY: 50 },
  restartKey: Phaser.Input.Keyboard.KeyCodes.R,
} as const;
