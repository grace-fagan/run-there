<script lang="ts">
  import { authURL, getLocalAuth } from '$lib/auth-utils';
  import { navigate } from 'svelte-routing/src/history';

  const handleLogin = () => {
    const userAuth = getLocalAuth();
    // if user already authorized, navigate to cities page
    if (userAuth) navigate('/nyc');
    else window.location.replace(authURL);
  };
</script>

<main class="p-4 flex flex-col gap-6 h-screen items-center justify-center">
  <div class="flex flex-col gap-1 items-center">
    <h4>{'ミᕕ( •_•)ᕗ'}</h4>
    <h1 class="font-bold text-3xl">Run There</h1>
    <p>Keep track of neighborhoods as you run NYC</p>
  </div>
  <img
    src="/static/img/connect-button.png"
    alt="Connect with Strava"
    class="cursor-pointer rounded-md hover:scale-105 transition-all h-12"
    on:pointerdown={handleLogin}
  />
</main>
