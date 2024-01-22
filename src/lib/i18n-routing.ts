// ./src/lib/i18n-routing.ts
import {
	sourceLanguageTag,
	type AvailableLanguageTag,
	availableLanguageTags,
} from "$paraglide/runtime";

import * as m from '$paraglide/messages';

/**
 * Returns the path in the given language, regardless of which language the path is in.
 */
export function translatePath(path: string, lang: AvailableLanguageTag) {
	path = withoutLanguageTag(path);
	// Don't prefix the default language
	if (lang === sourceLanguageTag) return `${path}`;

	// Prefix all other languages
	return `/${lang}${path}`;
}

/**
 * Returns the path without the language tag
 */
function withoutLanguageTag(path: string) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_, maybeLang, ...rest] = path.split("/");
	if (availableLanguageTags.includes(maybeLang as AvailableLanguageTag)) {
		const noLangPath = "/" /* BM */ + rest.join("/");
		return noLangPath;
	}
	return path;
}

export function getTextDirection(locale: AvailableLanguageTag) {
	const directions: Record<AvailableLanguageTag, "ltr" | "rtl"> = {
		en: "ltr",
		sr: "ltr",
	}

	return directions[locale]
}

/* typescript safe application of key from db fields */
export function hasKey<O extends object>(obj: O, key: PropertyKey): key is keyof O {
	return key in obj;
}

export function dbKey( key: string) : string {
	if (hasKey(m, key)) {
		const arg = Object.entries(m);
		return m[key](arg);
	} else return key;
}