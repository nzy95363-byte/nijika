# dsh-plugin-nijika-theme
历史最伟大的插件
DSH / DeepSeek Harness 伊地知虹夏（《孤独摇滚！》结束乐队鼓手）主题插件。

## 功能

- **完整主题配色**：覆盖 DSH 全部 107 个语义别名令牌，整体换成结束乐队暖橙色系。
  - 亮色：奶油白底 + 暖橙主色 `#c96a10`
  - 暗色：炭黑底 + 橙金主色 `#ff9e3d`
  - 成功/警告/错误等功能色保留语义，只做轻微暖化。
- **左上角明暗切换按钮**：胶囊开关（☀/☾），带圆形扩散转场动画（View Transition）。
- **装饰层**：暖色环境光、发丝边框 + 四角 L 标、右下角「結束バンド · 120 BPM」鼓点 HUD。
- **角色线稿立绘**：左下角虹夏线稿立绘（基于社区图片二创，已去文字），亮/暗色自动配色，随主题切换。
- **抠图背景立绘 + Q版小人**：上中透明抠图立绘（可羽化/暖色调/调强度），右侧三个浮动 Q 版小人。
- **设置面板**：左上角齿轮 ⚙ 打开，可开关各装饰、调立绘/环境光强度；设置自动保存到 localStorage。
- **内置音乐播放器**：右上角极简透明小条（磨砂玻璃），播放/暂停/切歌/拖动进度，设置面板里可开关、可调大小（50%–150%）。
  - 歌单位于 `assets/audio/`，新增歌曲：把 mp3 放进去，在 `lib/host-assets.mjs` 的 `TRACKS` 数组加一行即可。

## 安装

在 DSH 左侧「插件」→「添加插件」，包名或地址填本目录路径：

```
D:/dsh/dsh-plugin-nijika-theme
```

安装后启用并重载。配色通过官方 `ctx.theme.overrideTokens` 注入，随宿主明暗主题切换自动解析，卸载时精确移除。

## 机制

配色必须走 `ctx.theme.overrideTokens`，因为 DSH 把主题快照以 inline style 写到 `<body>`，CSS 直接覆盖 `--dsw-alias-*` 不生效。令牌值写成 `[light, dark]` 两套。

立绘以 base64 data URI 内联在 `lib/client.js` 中（无需额外静态资源路由），用 CSS `mask-image` + `currentColor` 实现主题色填充。

音乐播放器走独立静态路由：`lib/index.js` 通过 `ctx.inject(["webServer"])` 注册 `/dsh-nijika/assets/audio/*.mp3`（支持字节范围，可拖动进度）和 `/dsh-nijika/assets/playlist.json`。前端在 `lib/client.js` 的 `mountPlayer()` 中读取歌单渲染播放器，不自动播放。

## 许可

MIT。立绘线稿为粉丝二创，版权归原作者所有。
