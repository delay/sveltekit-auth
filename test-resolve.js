// Test to understand resolve() behavior
// This simulates what happens in email-messages.ts

const BASE_URL_DEV = 'http://localhost:5173/';
const BASE_URL_PROD = 'https://openproduct.fr/';

// Simulate what resolve() might return
// According to SvelteKit docs, resolve() returns a path relative to base
// If base is '/', it returns the path as-is
// If base is '/myapp', it returns '/myapp/path'

// The issue is: resolve() is being called outside of a request context
// In that case, it might return a relative path like '../../auth/verify/email-token'

// Let's simulate different scenarios:

console.log('=== Scenario 1: resolve() returns absolute path ===');
const resolve1 = (path) => path.replace('[token]', 'abc123');
console.log('Result:', BASE_URL_DEV + resolve1('/auth/verify/email-[token]'));
// Expected: http://localhost:5173//auth/verify/email-abc123 (double slash!)

console.log('\n=== Scenario 2: resolve() returns relative path ===');
const resolve2 = (path) => '../../' + path.slice(1).replace('[token]', 'abc123');
console.log('Result:', BASE_URL_DEV + resolve2('/auth/verify/email-[token]'));
// Result: http://localhost:5173/../../auth/verify/email-abc123 (THIS IS THE BUG!)

console.log('\n=== Scenario 3: BASE_URL without trailing slash ===');
const BASE_URL_NO_SLASH = 'http://localhost:5173';
const resolve3 = (path) => path.replace('[token]', 'abc123');
console.log('Result:', BASE_URL_NO_SLASH + resolve3('/auth/verify/email-[token]'));
// Expected: http://localhost:5173/auth/verify/email-abc123 (CORRECT!)

console.log('\n=== Scenario 4: Remove trailing slash from BASE_URL ===');
const cleanBaseUrl = (url) => url.endsWith('/') ? url.slice(0, -1) : url;
console.log('Clean BASE_URL:', cleanBaseUrl(BASE_URL_DEV));
console.log('Result:', cleanBaseUrl(BASE_URL_DEV) + resolve3('/auth/verify/email-[token]'));

