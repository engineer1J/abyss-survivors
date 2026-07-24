// 색상 기반(흰색) 배경 제거 스크립트.
// 이미지 가장자리에서 시작하는 흰색 영역만 flood fill로 찾아 투명화한다
// (캐릭터 내부에 흰색/밝은 하이라이트가 있어도 배경과 연결되지 않으면 보존됨).
// 경계 픽셀은 흰색에 가까운 정도에 따라 알파를 부드럽게 낮춰 안티에일리어싱 티가 덜 나게 한다.
import sharp from "sharp";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

const TARGETS = [
  { input: "assets/raw/player_ref.png", output: "assets/sprites/player.png" },
  { input: "assets/raw/enemy_angler_ref.png", output: "assets/sprites/enemy_angler.png" },
  { input: "assets/raw/enemy_tentacle_ref.png", output: "assets/sprites/enemy_tentacle.png" },
  { input: "assets/raw/enemy_jellyfish_ref.png", output: "assets/sprites/enemy_jellyfish.png" },
];

const WHITE_THRESHOLD = 245; // 이 값 이상이면 "배경 흰색" 후보로 취급
const FEATHER_THRESHOLD = 200; // 이 값 이상~WHITE_THRESHOLD 미만이면 경계에서 알파를 부드럽게 감쇠

async function removeWhiteBackground(inFile, outFile) {
  const image = sharp(inFile).ensureAlpha();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const isWhiteish = (idx) => {
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    return r >= WHITE_THRESHOLD && g >= WHITE_THRESHOLD && b >= WHITE_THRESHOLD;
  };

  const visited = new Uint8Array(width * height);
  const isBackground = new Uint8Array(width * height);
  const stack = [];

  const pushIfWhite = (x, y) => {
    const p = y * width + x;
    if (visited[p]) return;
    visited[p] = 1;
    const idx = p * channels;
    if (isWhiteish(idx)) {
      isBackground[p] = 1;
      stack.push(p);
    }
  };

  for (let x = 0; x < width; x++) {
    pushIfWhite(x, 0);
    pushIfWhite(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    pushIfWhite(0, y);
    pushIfWhite(width - 1, y);
  }

  while (stack.length > 0) {
    const p = stack.pop();
    const x = p % width;
    const y = (p / width) | 0;

    const neighbors = [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ];
    for (const [nx, ny] of neighbors) {
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      const np = ny * width + nx;
      if (visited[np]) continue;
      visited[np] = 1;
      const idx = np * channels;
      if (isWhiteish(idx)) {
        isBackground[np] = 1;
        stack.push(np);
      }
    }
  }

  for (let p = 0; p < width * height; p++) {
    const idx = p * channels;
    if (isBackground[p]) {
      data[idx + 3] = 0;
      continue;
    }

    const x = p % width;
    const y = (p / width) | 0;
    const neighbors = [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ];
    let touchesBackground = false;
    for (const [nx, ny] of neighbors) {
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      if (isBackground[ny * width + nx]) {
        touchesBackground = true;
        break;
      }
    }
    if (!touchesBackground) continue;

    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const minChannel = Math.min(r, g, b);
    if (minChannel >= FEATHER_THRESHOLD) {
      const t = (minChannel - FEATHER_THRESHOLD) / (WHITE_THRESHOLD - FEATHER_THRESHOLD);
      const alpha = Math.round(255 * (1 - Math.min(Math.max(t, 0), 1)));
      data[idx + 3] = Math.min(data[idx + 3], alpha);
    }
  }

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  await sharp(data, { raw: { width, height, channels } })
    .trim({ threshold: 10 }) // 투명해진 배경 여백 제거, 캐릭터에 맞춰 타이트하게 크롭
    .png()
    .toFile(outFile);
}

async function run() {
  for (const { input, output } of TARGETS) {
    const inFile = path.join(projectRoot, input);
    const outFile = path.join(projectRoot, output);
    await removeWhiteBackground(inFile, outFile);
    console.log(`Saved: ${outFile}`);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
