
import { resolve } from '$app/paths';

export default function signOut() {
	// Create a form element
	var form = document.createElement('form');
	form.method = 'POST';
	form.action = resolve('/auth/sign-out');
	document.body.appendChild(form);
	form.submit();
}