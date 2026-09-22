import {
	createRenderer,
	type SatteriExpressiveCodeOptions,
} from "satteri-expressive-code";
import { toHtml } from "satteri-expressive-code/hast";

export const expressiveCodeOptions: SatteriExpressiveCodeOptions = {
	themes: ["dracula"],
};

let renderer: ReturnType<typeof createRenderer> | undefined;

export function getExpressiveCodeRenderer() {
	renderer ??= createRenderer(expressiveCodeOptions);
	return renderer;
}

export async function renderExpressiveCode(code: string, language: string) {
	const { ec } = await getExpressiveCodeRenderer();
	const { renderedGroupAst } = await ec.render({ code, language });

	return toHtml(renderedGroupAst);
}
