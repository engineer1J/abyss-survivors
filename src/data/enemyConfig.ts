export const ENEMY_CONFIG = {
  /** 동시 생존 최대 마리 수 */
  maxAlive: 200,
  /** 스폰 시도 간격 (ms) */
  spawnIntervalMs: 150,
  /** 화면(카메라 뷰) 가장자리로부터 추가로 떨어뜨려 스폰하는 여유 거리 (px) */
  spawnMargin: 80,
  /** 원 반지름(px) */
  radius: 12,
  /** 도형 색상 */
  color: 0xff4d6d,
  /** 이동 속도 (px/s) */
  moveSpeed: 95,
  /** 체력 */
  maxHp: 40,
  /** 플레이어 접촉 시 주는 데미지 */
  contactDamage: 10,
  /** 처치 시 드랍하는 경험치 양 */
  expValue: 5,
  /** 오브젝트 풀 초기 크기 (maxAlive보다 여유 있게) */
  poolSize: 220,
} as const;
