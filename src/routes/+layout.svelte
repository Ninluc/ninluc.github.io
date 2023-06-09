<script lang="ts">
	import Header from '$components/layout/header/Header.svelte';
	import Footer from '$components/layout/footer/Footer.svelte';
	import PageTransition from '$components/layout/pageTransition/PageTransition.svelte';
	import LoadingScreen from '$components/layout/loading/LoadingScreen.svelte';

	import { pages } from '$stores/layout/pages';
	import { pageOrder } from '$stores/layout/pageOrder';
	import { direction } from '$stores/layout/pageTransitionDirection';
	import { loadingFinished } from '$stores/layout/loadingFinished';

	import { browser, dev } from '$app/environment';
	import { beforeNavigate } from '$app/navigation';
	import { page } from '$app/stores';

	import '../app.scss';

	export let data;

	/** Old pathname, changed before changing page */
	let oldPathname: string;
	beforeNavigate(() => {
		oldPathname = data.pathname;
	});

	const devStyle = dev ? 'color:#b5b;' : '';

	// Transition direction
	$: $direction =
		($pageOrder[data?.pathname] ?? 0) > ($pageOrder[oldPathname] ?? 0) ? 'left' : 'right';

	let currentTitle: string | undefined;
	$: currentTitle = $pages.find((p) => p.path === data.pathname)?.title;

	// Do we need loading animation ?
	let activateLoadingScreen: boolean = true;
	activateLoadingScreen = oldPathname === undefined && data.pathname == '/';

	if (!activateLoadingScreen || !browser) {
		loadingFinished.set(true);
	}

	$: console.log('loading has finished : ' + $loadingFinished);
	$: console.log('Is the loading screen activated ? : ' + activateLoadingScreen);
</script>

<svelte:head>
	<title>{currentTitle ? `${currentTitle} | matthiasg.dev` : 'matthiasg.dev'}</title>
</svelte:head>

<Header />

{#if !$loadingFinished && activateLoadingScreen}
	<LoadingScreen />
{/if}

<!-- <main style="{devStyle} --headerHeight: {$headerHeight}px;"> -->
<main style={devStyle}>
	{#key data.pathname}
		<!-- From theme.scss -->
		<PageTransition duration={500}>
			<slot />
		</PageTransition>
	{/key}
</main>

<Footer />

<style lang="scss">
	main {
		// padding-top: var(--headerHeight);
		padding-top: clamp(51px, 2vh, 50vh);

		overflow-x: hidden;

		/* Remove layout jumps beatween pages transitions */
		display: grid;
		grid-template-rows: 1fr;
		grid-template-columns: 1fr;
		& > :global(*) {
			grid-row: 1;
			grid-column: 1;
		}
	}
</style>
