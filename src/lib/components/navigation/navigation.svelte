<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	//import * as Command from '$lib/components/ui/command';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Sun, Moon, SunMoon, UserRound, LogOut } from 'lucide-svelte';
	import { setMode, resetMode } from 'mode-watcher';
	import { APP_NAME } from '$lib/config/constants';
	import Logo from '$lib/components/logo/logo.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import convertNameToInitials from '$lib/_helpers/convertNameToInitials';
	import { translatePath } from '$lib/i18n-routing';
	import { availableLanguageTags, type AvailableLanguageTag, sourceLanguageTag, setLanguageTag, onSetLanguageTag } from '$paraglide/runtime';
	import * as Select from '$lib/components/ui/select';

	import * as m from '$paraglide/messages';
	import type { Selected } from 'bits-ui';

	export let user: any;
	export let lang: AvailableLanguageTag = sourceLanguageTag;
	$: currentPage = $page.url.pathname;


	function signOut() {
		// Create a form element
		var form = document.createElement('form');
		form.method = 'POST';
		form.action = translatePath('/auth/sign-out', lang);
		document.body.appendChild(form);
		form.submit();
	}

	const handleChange: (value: Selected<AvailableLanguageTag> | undefined) => void | undefined = (value: Selected<AvailableLanguageTag> | undefined) => {	
		let path: string = currentPage ? currentPage : "/";
		if (value) {
			//setLanguageTag(value.value);
			goto(translatePath(path, value.value), {invalidateAll: true /* load function again so the control can update to selected language */});
		}
	};

	let initials: string = '';
	$: {
		if (user) {
			initials = convertNameToInitials(user.firstName, user.lastName);
		}
	}
</script>

<header class="bg-background sticky top-0 z-40 w-full border-b">
	<div class="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
		<div class="flex gap-6 md:gap-10">
			<a class="flex items-center space-x-2" href={translatePath('/', lang)}
				><Logo size="24"></Logo><span class="inline-block font-bold">{APP_NAME}</span></a
			>
			<nav class="flex gap-6">
				<a
					class="flex items-center text-sm font-medium text-muted-foreground"
					href={translatePath('/', lang)}
					class:active={translatePath('/', lang) === currentPage}>{m.home()}</a
				>
				<a
					class="flex items-center text-sm font-medium text-muted-foreground"
					href={translatePath('/dashboard', lang)}
					class:active={translatePath('/dashboard', lang) === currentPage}>{m.protectedr()}</a
				>
			</nav>
		</div>
		<div class="flex flex-1 items-center justify-end space-x-4">
			<nav class="flex items-center space-x-1">
				{#if !user}
					<Button on:click={() => goto(translatePath('/auth/sign-in', lang))}>{m.signin()}</Button>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger asChild let:builder>
							<Button builders={[builder]} variant="ghost" size="icon">
								<Sun
									class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
								/>
								<Moon
									class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
								/>
								<span class="sr-only">{m.toggletheme()}</span>
							</Button>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content align="end">
							<DropdownMenu.Item on:click={() => setMode('light')}>{m.light()}</DropdownMenu.Item>
							<DropdownMenu.Item on:click={() => setMode('dark')}>{m.dark()}</DropdownMenu.Item>
							<DropdownMenu.Item on:click={() => resetMode()}>{m.system()}</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				{:else}
					<DropdownMenu.Root>
						<DropdownMenu.Trigger asChild let:builder>
							<Button variant="ghost" builders={[builder]} class="relative h-8 w-8 rounded-full">
								<Avatar.Root class="h-8 w-8">
									<Avatar.Fallback>{initials}</Avatar.Fallback>
								</Avatar.Root>
							</Button>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content class="w-56" align="end">
							<DropdownMenu.Label class="font-normal">
								<div class="flex flex-col space-y-1">
									<p class="text-sm font-medium leading-none">{user?.firstName} {user?.lastName}</p>
									<p class="text-xs leading-none text-muted-foreground">{user?.email}</p>
								</div>
							</DropdownMenu.Label>
							<DropdownMenu.Separator />
							<DropdownMenu.Group>
								<DropdownMenu.Item on:click={() => goto(translatePath('/profile',lang))}>
									<UserRound class="mr-2 h-4 w-4" />
									{m.profile()}
									<DropdownMenu.Shortcut>⇧⌘P</DropdownMenu.Shortcut>
								</DropdownMenu.Item>
							</DropdownMenu.Group>

							<DropdownMenu.Sub>
								<DropdownMenu.SubTrigger>
									<Sun
										class="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
									/>
									<Moon
										class="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
									/>
									{m.appearance()}
								</DropdownMenu.SubTrigger>
								<DropdownMenu.SubContent>
									<DropdownMenu.Item on:click={() => setMode('light')}
										><Sun class="mr-2 h-4 w-4" />{m.light()}
									</DropdownMenu.Item>
									<DropdownMenu.Item on:click={() => setMode('dark')}
										><Moon class="mr-2 h-4 w-4" />{m.dark()}
									</DropdownMenu.Item>
									<DropdownMenu.Item on:click={() => setMode('system')}
										><SunMoon class="mr-2 h-4 w-4" />{m.system()}
									</DropdownMenu.Item>
								</DropdownMenu.SubContent>
							</DropdownMenu.Sub>
							<DropdownMenu.Separator />
							<DropdownMenu.Item on:click={signOut}>
								<LogOut class="mr-2 h-4 w-4" />
								{m.signout()}
								<DropdownMenu.Shortcut>⇧⌘Q</DropdownMenu.Shortcut>
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				{/if}
				<Select.Root portal={null} selected={{value: lang, label: lang}} onSelectedChange={handleChange}>
					<Select.Trigger class="w-[58px]">
						<Select.Value placeholder="" />
					</Select.Trigger>
					<Select.Content>
						{#each availableLanguageTags as l}
							<Select.Item value={l} label={l}>{l}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</nav>
		</div>
	</div>
</header>

<style>
	.active {
		@apply text-primary;
	}
</style>
