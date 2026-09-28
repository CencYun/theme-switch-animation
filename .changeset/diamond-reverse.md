---
'theme-switch-animation': minor
---

`reverse` 补接 `DIAMOND`（接入面 8 → 9 个类型）：菱形洞从视口四边向触发点收拢。

- **构造**：两条对角「洞式条带」默认 `add`——透明区 = 两芯交集 = 菱形（`max(|dx+dy|, |dx−dy|) = |dx|+|dy|` 恒等式），条带两端实心保证末帧零残留；免 `@supports`（设计阶段猜测的 intersect + 门控被预检证伪：intersect 给出的是两芯并集 = 八角星）。
- **几何**：触发点投影 `S = L/2 + (触发点 − 视口中心)·u` 烘进 px 常量；`from = 1.05 × v0`（`v0` = 四角 (|dx|+|dy|)/√2 最大值，菱形盖住视口的充要条件）、`to = 0`。
- **预检**：jitter-lab 与 CIRCLE reverse / SQUARE reverse / DIAMOND 正向同时间轴 A/B——帧证据（菱形洞顶点精确命中预测位置、四条 45° 直边收缩）+ 与 CIRCLE-reverse 区分度（5.0–6.4%）≈ 已发布家族自身量级（SQUARE-vs-CIRCLE 正向 1.1–7.2%）。文档站画廊 DIAMOND 卡挂 `Reverse` 三档控件。
