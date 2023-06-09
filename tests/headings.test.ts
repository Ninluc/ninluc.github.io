import { expect, test } from '@playwright/test';
import { glob } from 'glob';

/**
 * Test if the heading hierarchy is correct.
 * Will return incorrect if heading order is incorrect or if a heading type is
 * skipped.
 * If the page goes from a h3 to a h5, it will be incorrect.
 */
test('correct heading order', async ({ page }) => {
	const pageFiles = glob.sync('src/routes/**/+page.svelte');

	// Generate the URLs for the pages
	const urlsToTest = pageFiles.map((file: string) => {
		const pagePath = file.replace(/^src\/routes/, '').replace(/\+page.svelte$/, '');
		// return `http://localhost:5173${pagePath}`;
		return pagePath;
	});

	for (const url of urlsToTest) {
		// Navigate to the page
		await page.goto(url, {
			timeout: 4000,
			waitUntil: 'networkidle'
		});

		// Get all the headings on the page
		const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', (elements) =>
			elements.map((el) => el.tagName)
		);

		// Check the headings hierarchy
		let previousHeadingLevel = 0;
		for (const heading of headings) {
			const currentHeadingLevel = parseInt(heading.substring(1));

			expect(Math.abs(currentHeadingLevel - previousHeadingLevel) < 2);

			previousHeadingLevel = currentHeadingLevel;
		}
	}
});

// (async () => {
// 	// Launch the browser
// 	const browser = await chromium.launch();

// 	// Create a new browser context
// 	const context = await browser.newContext();

// 	// Create a new page
// 	const page = await context.newPage();

// 	// Find all SvelteKit page files
// 	const pageFiles = glob.sync('src/routes/**/*.svelte');

// 	// Generate the URLs for the pages
// 	const urlsToTest = pageFiles.map((file: string) => {
// 		const pagePath = file.replace(/^src\/routes/, '').replace(/\.svelte$/, '');
// 		return `http://localhost:5173${pagePath}`;
// 	});

// 	for (const url of urlsToTest) {
// 		// Navigate to the page
// 		await page.goto(url);

// 		// Get all the headings on the page
// 		const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', (elements) =>
// 			elements.map((el) => el.tagName)
// 		);

// 		// Check the headings hierarchy
// 		let previousHeadingLevel = 0;
// 		let isHierarchyCorrect = true;
// 		for (const heading of headings) {
// 			const currentHeadingLevel = parseInt(heading.substring(1));

// 			if (currentHeadingLevel <= previousHeadingLevel) {
// 				isHierarchyCorrect = false;
// 				break;
// 			}

// 			previousHeadingLevel = currentHeadingLevel;
// 		}

// 		// Output the test result
// 		console.log(`Page: ${url}`);
// 		console.log(`Headings Hierarchy: ${isHierarchyCorrect ? 'Correct' : 'Incorrect'}`);
// 		console.log('----------------------------------------------');
// 	}

// 	// Close the browser
// 	await browser.close();
// })();
