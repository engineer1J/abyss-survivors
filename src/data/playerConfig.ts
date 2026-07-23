export const PLAYER_CONFIG = {
  /** 충돌 판정 반지름(px) */
  radius: 14,
  /** 스프라이트 표시 지름(px), 충돌 판정과 별개 */
  spriteDiameter: 52,
  /** 이동 속도 (px/s) */
  moveSpeed: 220,
  /** 최대 체력 */
  maxHp: 100,
  /** 이 거리 안의 젬은 플레이어 쪽으로 끌려오기 시작함 (px) */
  pickupRadius: 110,
  /** 피격 후 무적 시간 (ms) */
  invulnerableMs: 500,
} as const;
