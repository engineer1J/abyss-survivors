export const AUTO_WEAPON_CONFIG = {
  /** 발사 간격 (ms) */
  fireIntervalMs: 500,
  /** 투사체 속도 (px/s) */
  projectileSpeed: 520,
  /** 투사체 반지름(px) */
  projectileRadius: 6,
  /** 투사체 색상 */
  projectileColor: 0xffe066,
  /** 투사체 데미지 */
  damage: 20,
  /** 이 거리 밖의 적은 타겟으로 잡지 않음 (px) */
  targetRange: 850,
  /** 투사체 최대 생존 시간 (ms), 초과 시 풀에 반납 */
  lifetimeMs: 2000,
  /** 오브젝트 풀 초기 크기 */
  poolSize: 40,
} as const;
