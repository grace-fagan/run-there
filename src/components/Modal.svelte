<script lang="ts">
  import { fade } from 'svelte/transition';
  import Portal from './utils/Portal.svelte';
  export let isOpen = false;
  export let edgeInView: number = 48;

  let screenHeight: number = null;
  $: openPosition = screenHeight / 2;
  $: closedPosition = screenHeight - edgeInView;

  const handleClick = (e: MouseEvent | KeyboardEvent) => {
    isOpen = false;
    e.stopImmediatePropagation();
  };
</script>

<svelte:window bind:innerHeight={screenHeight} />
<Portal>
  {#if isOpen}
    <div
      class="fixed top-0 left-0 h-screen w-full bg-stone-700 opacity-10 z-40"
      on:click={handleClick}
      on:keydown={handleClick}
      role="none"
      in:fade
    />
  {/if}
  <div
    class="fixed top-full left-0 w-full bg-white rounded-t-xl z-10 py-2 transition-all h-1/2 z-50 shadow-md"
    style="top: {isOpen ? openPosition : closedPosition}px"
  >
    <slot />
  </div>
</Portal>
