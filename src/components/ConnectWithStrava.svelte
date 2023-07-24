<script lang="ts">
  import { authURL, getLocalAuth } from '$lib/auth-utils';
  import { navigate } from 'svelte-routing/src/history';

  export let height: number = 48;

  const handleLogin = () => {
    const userAuth = getLocalAuth();
    // if user already authorized, navigate to cities page
    if (userAuth) navigate('/nyc');
    else window.location.replace(authURL);
  };
</script>

<img
  src="/static/img/connect-button.png"
  alt="Connect with Strava"
  class="cursor-pointer rounded-md hover:scale-105 transition-all"
  style="height: {height}px"
  on:pointerdown={handleLogin}
/>
