<script lang="ts">
  import { authURL } from '$lib/auth-utils';

  const handleLogin = () => {
    window.location.replace(authURL);
  };
</script>

<main class="p-4 flex flex-col gap-6 h-screen items-center justify-center">
  <div class="flex flex-col gap-1 items-center">
    <h4>{'ミᕕ( •_•)ᕗ'}</h4>
    <h1 class="font-bold text-3xl">Run There</h1>
  </div>
  <button
    class="p-2 rounded-md hover:scale-105 transition-all bg-[#fc4c02] text-white font-semibold"
    on:click={handleLogin}>Connect to Strava</button
  >
</main>
