/** particles.js exposes its API on `window` when the module is evaluated. */
declare module "particles.js";

declare module "particles.js?url" {
	const url: string;
	export default url;
}
