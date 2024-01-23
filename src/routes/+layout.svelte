<script lang="ts">
    import { page } from "$app/stores";
    import { setLanguageTag, sourceLanguageTag, type AvailableLanguageTag, isAvailableLanguageTag } from "$paraglide/runtime";

    import { browser } from "$app/environment";
    import { defaultLanguage, getTextDirection, translatePath } from "$lib/i18n-routing";
    import I18NHeader from "$lib/components/I18NHeader.svelte";
	  import { PUBLIC_LANG_FROM_BROWSER } from "$env/static/public";
	  import { goto } from "$app/navigation";
	  import { redirect } from "@sveltejs/kit";

    const langSetup = (lang: AvailableLanguageTag) => {
      /*if (!lang) {
        lang = sourceLanguageTag;
        if (PUBLIC_LANG_FROM_BROWSER && browser && isAvailableLanguageTag(navigator.language)) {
          lang = navigator.language;
          if (lang !== sourceLanguageTag) {
            goto(translatePath('/', lang),{invalidateAll: true});
          }
        }
      }*/
      setLanguageTag(lang);
    };
	
    //Use the default language if no language is given
    $: lang = /*$page.params.lang */($page.params.lang ? $page.params.lang : defaultLanguage) as AvailableLanguageTag;
    //Set the language tag in the Paraglide runtime.
      //This determines which language the strings are translated to.
      //You should only do this in the template, to avoid concurrent requests interfering with each other.
    $: langSetup(lang);

      
    //Determine the text direction of the current language
    $: textDirection = getTextDirection(lang);

    //Keep the <html> lang and dir attributes in sync with the current language
    $: if (browser) {
      document.documentElement.dir = textDirection;
      document.documentElement.lang = lang;
    }
  </script>
  
  <I18NHeader />
  {#key lang}
    <slot/>
  {/key}
  