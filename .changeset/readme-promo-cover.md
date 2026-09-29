---
'theme-switch-animation': patch
---

修 npm 包首页的裂图，并把 README 门面换成宣传片封面。

- **裂图根因**：`package.json` 的 `files: ['dist']`，`assets/` 不进 tarball，而 npm 的 README 渲染不解析
  `./assets/...` 相对路径——同一份 Markdown 在 GitHub 正常、在 npm 页面是裂图。门面图片与两处 `LICENSE`
  链接一并改为绝对地址（图片走 `raw.githubusercontent.com`，链接走 GitHub blob 页）。
- **门面改版**：删掉 `## 📸 预览` 小节（文档站首页截图 `assets/screen.jpg` 一并移除，README 不再需要静态截图），
  改为一张 16:9 宣传片封面整块可点，跳转抖音；上方补一行居中的入口链接（文档站 / 宣传片 / npm / 开发规范）。
- **影响面**：`dist/` 产物逐字节不变，本版本只改随包发布的 README。
