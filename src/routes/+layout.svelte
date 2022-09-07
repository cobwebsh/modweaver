<nav>
	<h1 class="logo">ModWeaver</h1>
	<a href="/">Home</a>
	<a href="/mods">Mods</a>
</nav>
<main>
	<slot />
</main>

<style scoped>
    nav {
        display: flex;
        align-items: center;
    }

    nav > .logo {
        margin: 0.5rem;
    }

    nav > a {
        margin: 0 0.5rem;
    }
</style>