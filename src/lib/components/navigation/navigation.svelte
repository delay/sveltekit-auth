<script lang="ts">
	import { APP_NAME } from '$lib/config/constants';
	import { Navigation } from '@skeletonlabs/skeleton-svelte';
	import { MapPin } from 'lucide-svelte';
	import IconMenu from '@lucide/svelte/icons/menu';
	import IconFolder from '@lucide/svelte/icons/folder';
	import signOut from '$lib/components/navigation/sign-out';
	import IconUserEdit from '@lucide/svelte/icons/user-pen';
	import IconPlug from '@lucide/svelte/icons/unplug';
	import IconSettings from '@lucide/svelte/icons/settings';
	import { PUBLIC_BASE_PATH } from '$env/static/public';
	// import MyLogo from '$lib/assets/img/logoOpenProduct.png?enhanced';
	let user: any = $props();
	let value = $state('/');
	let userState = $derived(user.user);
	import { resolve } from '$app/paths';
</script>

  <Navigation.Rail>
    {#snippet header()}
    	<Navigation.Tile href="#" title="Menu"><IconMenu /></Navigation.Tile>
		<Navigation.Tile label="Accueil" href={resolve("/")}><IconFolder /></Navigation.Tile>
		<Navigation.Tile label="Carte" href={resolve("/map")}><MapPin /></Navigation.Tile>
		{#if userState}
			<Navigation.Tile label="Mon Profil" href={resolve("/dashboard")}><IconUserEdit /></Navigation.Tile>
			<Navigation.Tile label="Deconnexion" onclick={signOut}><IconPlug /></Navigation.Tile>
		{:else}
			<Navigation.Tile label="Connexion" href={resolve("/auth/sign-in")}><IconPlug /></Navigation.Tile>
		{/if}
      <Navigation.Tile labelExpanded="A propos" href={resolve("/about")} title="settings"><IconSettings /></Navigation.Tile>
    {/snippet}
    <!-- {#snippet tiles()}
	{/snippet}
    {#snippet footer()}
    {/snippet} -->
  </Navigation.Rail>

