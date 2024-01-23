// ./src/lib/i18n-routing.ts
import {
	sourceLanguageTag,
	type AvailableLanguageTag,
	availableLanguageTags,
	isAvailableLanguageTag,
} from "$paraglide/runtime";

import * as m from '$paraglide/messages';
import { browser } from "$app/environment";
import { PUBLIC_LANG_FROM_BROWSER } from "$env/static/public";

export const defaultLanguage = defaultLang(); // on client

/**
 * Returns the path in the given language, regardless of which language the path is in.
 */
export function translatePath(path: string, lang: AvailableLanguageTag, defLang: AvailableLanguageTag | undefined = undefined) {
	path = withoutLanguageTag(path); 
	// Don't prefix the default language
	if (browser && (lang === defaultLanguage) /* sourceLanguageTag */) return `${path}`;
	if (!browser && defLang && (lang === defLang)) return `${path}`;

	// Prefix all other languages
	return `/${lang}${path}`;
}


/**
 * Returns default language: navigator language if PUBLIC_FROM_BROWSER else sourceLanguageTag
 */
export function defaultLang(fromAcceptLanguage: AvailableLanguageTag | null = null) {
	if (PUBLIC_LANG_FROM_BROWSER == '1') {
		if (browser && isAvailableLanguageTag(navigator.language)) {
			return navigator.language;
		} else if (fromAcceptLanguage && isAvailableLanguageTag(fromAcceptLanguage)) { // get from accept-language header?
			return fromAcceptLanguage;
		} else {
			return sourceLanguageTag;
		}
	} else {
		return sourceLanguageTag;
	}
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