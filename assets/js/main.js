const THEME_STORAGE_KEY = 'ion606-theme';

function getSystemTheme() {
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredTheme() {
	const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
	if (savedTheme === 'light' || savedTheme === 'dark') {
		return savedTheme;
	}
	return null;
}

function applyTheme(theme) {
	document.documentElement.setAttribute('data-theme', theme);
}

function setTheme(theme) {
	applyTheme(theme);
	localStorage.setItem(THEME_STORAGE_KEY, theme);
}

function updateThemeToggleLabel(button, theme) {
	const nextTheme = theme === 'dark' ? 'light' : 'dark';
	button.textContent = nextTheme === 'dark' ? '🌑' : '☀️';
	button.setAttribute('aria-pressed', String(theme === 'dark'));
	button.setAttribute('aria-label', `Switch to ${nextTheme} mode`);
}

export function initThemeToggle() {
	const initialTheme = getStoredTheme() || getSystemTheme();
	applyTheme(initialTheme);

	const navList = document.querySelector('header nav ul');
	if (!navList || navList.querySelector('.theme-toggle')) {
		return;
	}

	const toggleItem = document.createElement('li');
	const toggleButton = document.createElement('button');
	toggleButton.type = 'button';
	toggleButton.className = 'theme-toggle';

	updateThemeToggleLabel(toggleButton, initialTheme);

	toggleButton.addEventListener('click', () => {
		const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
		const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
		setTheme(nextTheme);
		updateThemeToggleLabel(toggleButton, nextTheme);
	});

	toggleItem.appendChild(toggleButton);
	navList.appendChild(toggleItem);

	const systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
	if (typeof systemThemeQuery.addEventListener === 'function') {
		systemThemeQuery.addEventListener('change', (event) => {
			if (getStoredTheme()) {
				return;
			}
			const preferredTheme = event.matches ? 'dark' : 'light';
			applyTheme(preferredTheme);
			updateThemeToggleLabel(toggleButton, preferredTheme);
		});
	}
}

/* highlight the active navigation link based on current file name */
export function highlightNav() {
	const links = document.querySelectorAll('nav a');
	const current = window.location.pathname.split('/').pop() || '/';
	links.forEach((link) => {
		const href = link.getAttribute('href');
		if (href === current) {
			link.classList.add('active');
		}
	});
}

/* handle contact form submission */
export function initContactForm() {
	const form = document.querySelector('form#contact-form');
	if (!form) {
		return;
	}

	form.addEventListener('submit', async (event) => {
		event.preventDefault();
		/* gather form data */
		const name = form.querySelector('input[name="name"]').value;
		const email = form.querySelector('input[name="email"]').value;
		const message = form.querySelector('textarea[name="message"]').value;
		/* simple validation */
		if (!name || !email || !message) {
			alert('Please fill out all fields.');
			return;
		}

		/* send the message via an API endpoint or service
		   this example uses the Fetch API to send JSON to a hypothetical endpoint.
		   replace the URL with your own form handling service (e.g. MailPocket). */
		try {
			const response = await fetch('https://example.com/api/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ name, email, message }),
			});
			if (response.ok) {
				alert('Thank you for reaching out! I will respond soon.');
				form.reset();
			} else {
				alert('Sorry, there was a problem sending your message.');
			}
		} catch (error) {
			console.error('Form submission error:', error);
			alert('An unexpected error occurred.');
		}
	});
}

/* initialize all scripts */
initThemeToggle();
highlightNav();
initContactForm();
