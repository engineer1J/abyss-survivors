import Phaser from "phaser";

/**
 * 고정 크기로 미리 생성한 도형 오브젝트를 재사용하는 풀.
 * acquire/release만으로 순환하며, 게임 도중 GameObject를 새로 생성/파괴하지 않는다.
 */
export class ObjectPool<T extends Phaser.GameObjects.Arc> {
  private readonly free: T[] = [];
  private readonly activeList: T[] = [];

  constructor(private readonly factory: () => T, initialSize: number) {
    for (let i = 0; i < initialSize; i++) {
      this.free.push(this.factory());
    }
  }

  acquire(): T {
    const item = this.free.pop() ?? this.factory();
    item.setActive(true);
    item.setVisible(true);
    this.activeList.push(item);
    return item;
  }

  release(item: T): void {
    const index = this.activeList.indexOf(item);
    if (index === -1) return;
    const lastIndex = this.activeList.length - 1;
    this.activeList[index] = this.activeList[lastIndex];
    this.activeList.pop();
    item.setActive(false);
    item.setVisible(false);
    this.free.push(item);
  }

  get actives(): readonly T[] {
    return this.activeList;
  }

  get activeCount(): number {
    return this.activeList.length;
  }
}
