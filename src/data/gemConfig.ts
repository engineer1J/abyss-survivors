export const GEM_CONFIG = {
  /** 원 반지름(px) */
  radius: 5,
  /** 도형 색상 */
  color: 0x63e6be,
  /** 플레이어에게 끌려갈 때의 속도 (px/s) */
  attractSpeed: 560,
  /** 이 거리 안으로 들어오면 실제로 흡수(획득) 처리 (px) */
  collectRadius: 18,
  /** 오브젝트 풀 초기 크기 */
  poolSize: 220,
} as const;
