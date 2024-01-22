<script lang="ts">
    import { page } from "$app/stores";
    import { setLanguageTag, sourceLanguageTag, type AvailableLanguageTag, isAvailableLanguageTag } from "$paraglide/runtime";

    import { browser } from "$app/environment";
    import { getTextDirection } from "$lib/i18n-routing";
    import I18NHeader from "$lib/components/I18NHeader.svelte";
	
    //Use the default language if no language is given
    $: lang = $page.params.lang as AvailableLanguageTag ?? sourceLanguageTag;
    //Set the language tag in the Paraglide runtime.
      //This determines which language the strings are translated to.
      //You should only do this in the template, to avoid concurrent requests interfering with each other.
      $: setLanguageTag(lang);

      
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
  