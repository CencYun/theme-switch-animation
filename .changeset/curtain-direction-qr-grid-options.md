---
'theme-switch-animation': minor
---

参数化小项（不占类型名额）：`CURTAIN` 接入 `direction`，`QR_GRID` 格距与格子形状放开为选项。

- **`CURTAIN` + `direction`**（v1.15 前对该类型静默）：`direction` 在 CURTAIN 上映射的是**开合轴**而非四向——`ltr` / `rtl` → 水平幕布（左右开，观感一致，中线对称没有左右之分）、`ttb` / `btt` → **垂直幕布**（上下开），即只有两种视觉形态。默认 `ltr` 下注入 CSS 与此前逐字节一致。`reverse` 的两层板随轴切换（垂直轴 = 上板 180deg + 下板 0deg 向中线合拢）。
- **`QR_GRID` + `cellSize`**（px，合法区间 `[16, 200]`，默认 `64`，越界静默回落）：格距是每格方块/圆点的边长与平铺周期，软边按叶片同款比例策略收缩。
- **`QR_GRID` + `cellShape: 'square' | 'dot'`**（默认 `'square'`，非法值静默回落）：`'dot'` 为单层平铺 `radial-gradient` 圆点格，免 `@supports`（不需要双层 `intersect`），圆点直径终值 ≥ 格距 × √2 保证末帧无缝；圆点从每格中心**同步**生长，`direction` 对圆点格静默（单层平铺没有推进轴，四向观感一致）。
