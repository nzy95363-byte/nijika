# dsh-plugin-nijika-theme

DSH / DeepSeek Harness 伊地知虹夏（《孤独摇滚！》结束乐队鼓手）主题插件。

## 功能

- **完整主题配色**：覆盖 DSH 全部 107 个语义别名令牌，整体换成结束乐队暖橙色系。
  - 亮色：奶油白底 + 暖橙主色 `#c96a10`
  - 暗色：炭黑底 + 橙金主色 `#ff9e3d`
  - 成功/警告/错误等功能色保留语义，只做轻微暖化。
- **左上角明暗切换按钮**：胶囊开关（☀/☾），参考 EVA 主题插件，带圆形扩散转场动画（View Transition）。
- **装饰层**：暖色环境光、发丝边框 + 四角 L 标、右下角「結束バンド · 120 BPM」鼓点 HUD。
- **角色线稿立绘**：左下角虹夏线稿立绘（基于社区图片二创，已去文字），亮/暗色自动配色，随主题切换。

## 安装

在 DSH 左侧「插件」→「添加插件」，包名或地址填本目录路径：

```
D:/dsh/dsh-plugin-nijika-theme
```

安装后启用并重载。配色通过官方 `ctx.theme.overrideTokens` 注入，随宿主明暗主题切换自动解析，卸载时精确移除。

## 机制

配色必须走 `ctx.theme.overrideTokens`，因为 DSH 把主题快照以 inline style 写到 `<body>`，CSS 直接覆盖 `--dsw-alias-*` 不生效。令牌值写成 `[light, dark]` 两套。

立绘以 base64 data URI 内联在 `lib/client.js` 中（无需额外静态资源路由），用 CSS `mask-image` + `currentColor` 实现主题色填充。

## 许可

MIT。立绘线稿为粉丝二创，版权归原作者所有。
