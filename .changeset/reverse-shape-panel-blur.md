---
'theme-switch-animation': minor
---

`reverse` 补接 `SQUARE` / `RECTANGLE` / `CIRCLE_BLUR`（接入面 5 → 8 个类型），三者的反向构造是**静止盒子 + 渐变补集**（蒙版盒子完全静止、只动注册属性），不碰正向那条 `mask-size` / `mask-position` 路径，因此不引入设备像素对齐抖动：

- **SQUARE / RECTANGLE**：四块边缘板 `add`（默认合成，免 `@supports`），中心掏「触发点 ± 半宽」的洞从全屏收到 0。RECTANGLE 的洞按轴归一保持视口比例，不与 SQUARE 的正方形洞撞观感。
- **CIRCLE_BLUR**：径向洞 + 宽羽化，羽化宽度对齐正向 `feGaussianBlur` 的像素 σ，收拢软边与正向模糊边观感一致；末帧过冲一整段羽化宽，零残留。

三类型探针实测首帧全隐 / 末帧零残留 / 推进单调（6400 采样点），引擎矩阵 WebKit / Chrome / Firefox 录像全绿。形状族其余 4 个（`DIAMOND` / `HEXAGON` / `TRIANGLE` / `STAR`）维持不接入：静止盒子绕路依赖轴对齐洞边界，对斜线轮廓不成立。文档站画廊三张卡同步挂 `Reverse` 三档控件。
