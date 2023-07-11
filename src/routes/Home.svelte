<script lang="ts">
  import { authURL } from '$lib/server-utils';

  const handleLogin = () => {
    window.location.replace(authURL);
  };
</script>

<main class="flex flex-col gap-2 h-screen items-center justify-center">
  <h1 class="font-bold text-3xl">Run There</h1>
  <button
    class="p-2 border border-gray-300 rounded-md hover:scale-105 transition-all"
    on:click={handleLogin}>Connect to Strava</button
  >
</main>
