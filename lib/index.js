/** DSH 宿主半边：纯客户端主题无需宿主路由，apply 保持空实现即可。 */
export const name = "dsh-plugin-nijika-theme";

export function apply(ctx) {
	// 主题的全部工作都在浏览器半边 lib/client.js 中完成（overrideTokens）。
	// 这里保留 apply 以满足 bundle 契约；HMR/卸载无需清理宿主资源。
}
