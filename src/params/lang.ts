import { availableLanguageTags, type AvailableLanguageTag } from "$paraglide/runtime";

export const match = (param: any): param is AvailableLanguageTag => {
	return availableLanguageTags.includes(param)
}
