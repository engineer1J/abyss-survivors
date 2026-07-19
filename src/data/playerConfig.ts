export const PLAYER_CONFIG = {
  /** 원 반지름(px) */
  radius: 14,
  /** 도형 색상 */
  color: 0x4fd1c5,
  /** 이동 속도 (px/s) */
  moveSpeed: 220,
  /** 최대 체력 */
  maxHp: 100,
  /** 이 거리 안의 젬은 플레이어 쪽으로 끌려오기 시작함 (px) */
  pickupRadius: 110,
  /** 피격 후 무적 시간 (ms) */
  invulnerableMs: 500,
} as const;
