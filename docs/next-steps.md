# 待办

> 本文件只装**还开着的待办**，做完一项删一项。2026-09-14 ~ 09-24 的十轮已完结记录（原 §1–§10
> 台账）已随 docs 精简移出工作树，随时可查 git 历史：`git log --all -- docs/next-steps.md`。
> 引擎矩阵环境（PW_DIR / FF_WORK_DIR）的固定路径见 AGENTS.md「引擎矩阵」行。

## §1 扩展执行清单（2026-09-28 排定，按优先级从上往下做）

> 条目编号沿用 `docs/animation-roadmap.md` §3（构造、历史判定与待验点都在那边，这里只装执行顺序与验收线）。
> 总原则：每项先 core + 画廊拿结论（roadmap §5），门面同步攒批押后（§6）；每项落地时同步 `requirements.md`
> 的 spec 与 §10 修订记录。单项验收 = 门禁四件套 + `pnpm verify:package` + `pnpm test:acceptance` +
> 引擎矩阵（WebKit + Firefox 录像取证）。

- [ ] **P3-8 参数化小项**（不占类型名额，顺手清）
      ① `CURTAIN` 接入 `direction`：垂直幕布 = `centerBandGradient` 补轴实参（90 或 180）+ `to = 视口高 + 2 × 软边`；
      ② `QR_GRID` 格距常量放开为选项（区间校验静默回落，同 slatWidth 策略）；
      ③ 可选圆点格：单层平铺 radial，免 `@supports`；圆点直径终值 ≥ 格距 × √2 才有无缝末帧；
      四向 `direction` 锚定观感过一遍。

- [ ] **P3-9 QUAD 十字四向——先预检，绿了才碰 core**（解冻项；预检通过进实现时先在 requirements §10 补修订记录）
      预检：jitter-lab 里与 CIRCLE@中心 / SQUARE@中心 / CURTAIN 同时间轴 A/B（P1-4 教训：必须和同类项并排比），
      判据 = 十字缝是肉眼可读的身份特征（约束 4）；不绿 → 整个撤回并记 roadmap §4，成本只花在预检。
      绿了再实现：正向 = `centerBandGradient(90)` ∩ `centerBandGradient(180)` + `@supports` 门控（基线降级 = CURTAIN）；
      反向 = 四层边缘板 `add`。**共享 var 必须按轴归一**（宽 / 高不等时 `calc(var × k)` 缩放），
      不然一轴先走完、后半程退化成单轴（COMB 式死区）。

- [ ] **P3-10 `reverse` 补接第二批：DIAMOND**（对角几何换算重，可自由延期或砍）
      两条对角反带 `intersect` + `@supports` 门控，基线降级 = 径向洞（观感退化成 CIRCLE reverse）；
      触发点偏移烘进 stop 的 px 常量。验收同 P3-7 的探针口径。

- [ ] **P2-2 LOGO_MASK 启动期：先出消毒规则设计稿，讨论过再立项**（解冻项；本项不排代码）
      产出 `docs/logo-mask-design.md`（活文档，命名先例同 `reverse-option-design.md`）：
      白名单只收 `<path d>` / `<polygon points>` / `viewBox`、拒绝其余一切 + 专项单测清单；
      内切半径取 `getBBox` 实测（库本来就跑 DOM 测量）、外接方框兜底。
      XSS 面与附带问题的底稿见 roadmap §3 P2-2。

## §2 外部输入触发的排查项（≠ 已验，等使用者反馈）

- [ ] **（等使用者反馈再排查，≠ 已验）系统缩放 125% / 150% 真机肉眼观感**：已覆盖的是 forced
      `deviceScaleFactor`（浏览器光栅路径，seek 模式出真设备像素）；未覆盖的是 OS 整屏分面缩放。
      反馈进来先跑：
      `MSYS2_ARG_CONV_EXCL='*' node scripts/jitter-lab/run.mjs --type=<类型> --reverse=false --direction=expand --variant=clean --dsf=1.25 --samples=24`
      读汇总里的「含真极值线」帧数（三档 CURTAIN 基线 = 1，且那一帧是 t=0 起始帧设计上透光，不是伪影）。

- [ ] **（等使用者反馈再排查，≠ 已验）Safari / iOS 真机**：已覆盖 Playwright WebKit（webkit-2359，
      逐类型 15/15 + `CIRCLE` 收起洞半径逐帧插值）；未覆盖设备端合成器与触控路径。
      反馈进来按这份 ~15 分钟手动清单跑：

      1. 准备：Mac 上 `pnpm i && pnpm build && cd playgrounds/vue && pnpm build && npx vite preview --host --port 5224`，
         iPhone 与 Mac 同一局域网访问 `http://<mac-ip>:5224/`。
      2. **macOS Safari 18+**：CIRCLE 卡点两次（Reverse 停在 auto）——切暗应是暗色圆从按钮**扩散**、
         切亮应是暗色圆**收起进按钮**，约 750ms 平滑；失败形态：瞬间切换（`@property` 失效）或前半段不动、
         50% 处一跳。15 个按钮各点一次，各有各的形状/方向动画。3 秒内连点 10 次，结束后 `<html>` class、
         按钮文案、`localStorage['theme-switch-animation']` 三者一致，控制台无红错。duration 1000ms +
         easing linear 点一次 CIRCLE 收起，确认匀速（`var()` 缓动生效）。开「减弱动态效果」应直切且状态正确。
      3. **iOS Safari 18+**：重复上一步的核对点；圆心跟随点击位置（页面滚到中部再点）；
         横竖屏各收起一次，看边缘有无锯齿/线条（Apple GPU 合成路径与桌面不同）。
