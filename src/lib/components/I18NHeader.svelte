<!-- ./src/lib/I18NHeader.svelte -->
<script lang="ts">
    import { availableLanguageTags } from "$paraglide/runtime";
    import { page } from "$app/stores";
    import { translatePath } from "$lib/i18n-routing";
  </script>
  
  <svelte:head>
      {#each availableLanguageTags as lang}
          <link rel="alternate" hreflang={lang} href={translatePath($page.url.pathname, lang)} />
      {/each}
  </svelte:head>
  