/** DSH 宿主半边：主题令牌在 client.js，这里只注册内置音乐的静态路由。 */
import { assetRoutes, serveAsset, playlistHandler, ASSET_BASE } from "./host-assets.mjs";

export const name = "dsh-plugin-nijika-theme";

export function apply(ctx) {
	ctx.inject(["webServer"], (scope) => {
		for (const entry of assetRoutes()) {
			scope.effect(
				() => scope.webServer.register({ kind: "exact", path: entry.path, handler: (req, res) => serveAsset(req, res, entry) }),
				"nijika: asset " + entry.path,
			);
		}
		scope.effect(
			() => scope.webServer.register({ kind: "exact", path: ASSET_BASE + "playlist.json", handler: playlistHandler }),
			"nijika: playlist",
		);
	});
}
