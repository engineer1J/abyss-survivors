export interface EnemyKindConfig {
  id: string;
  /** 텍스처 키 (스프라이트) */
  textureKey: string;
  /** 스폰 시 뽑힐 상대 가중치 */
  spawnWeight: number;
  /** 충돌 판정 반지름(px) */
  radius: number;
  /** 스프라이트 표시 지름(px), 충돌 판정과 별개 */
  spriteDiameter: number;
  /** 이동 속도 (px/s) */
  moveSpeed: number;
  /** 체력 */
  maxHp: number;
  /** 플레이어 접촉 시 주는 데미지 */
  contactDamage: number;
  /** 처치 시 드랍하는 경험치 양 */
  expValue: number;
  /**
   * 원거리 부유형 전용: 플레이어와 이 거리(px) 안으로는 접근하지 않고 맴돈다.
   * 미설정 시 끝까지 추격(근접형).
   */
  preferredDistance?: number;
}

export const ENEMY_CONFIG = {
  /** 동시 생존 최대 마리 수 */
  maxAlive: 200,
  /** 스폰 시도 간격 (ms) */
  spawnIntervalMs: 150,
  /** 화면(카메라 뷰) 가장자리로부터 추가로 떨어뜨려 스폰하는 여유 거리 (px) */
  spawnMargin: 80,
  /** 오브젝트 풀 초기 크기 (maxAlive보다 여유 있게) */
  poolSize: 220,
} as const;

export const ENEMY_KINDS: readonly EnemyKindConfig[] = [
  {
    // 아귀형: 이전 탐사자의 헬멧 렌즈·리벳을 흡수한 심해아귀. 빠르게 돌진하는 근접 위협.
    id: "angler",
    textureKey: "enemy_angler",
    spawnWeight: 3,
    radius: 16,
    spriteDiameter: 115, // 96 * 1.2
    moveSpeed: 175,
    maxHp: 35,
    contactDamage: 14,
    expValue: 6,
  },
  {
    // 촉수형: 갑주 파편을 뒤덮은 촉수 덩어리. 느리지만 물량으로 밀어붙임.
    id: "tentacle",
    textureKey: "enemy_tentacle",
    spawnWeight: 5,
    radius: 18,
    spriteDiameter: 162, // 108 * 1.5
    moveSpeed: 55,
    maxHp: 25,
    contactDamage: 8,
    expValue: 4,
  },
  {
    // 해파리형: 아직 오염되지 않은 순수 개체. 얕은 층의 약한 초반 적, 거리를 두고 부유.
    id: "jellyfish",
    textureKey: "enemy_jellyfish",
    spawnWeight: 4,
    radius: 12,
    spriteDiameter: 84,
    moveSpeed: 60,
    maxHp: 16,
    contactDamage: 5,
    expValue: 3,
    preferredDistance: 140,
  },
] as const;
