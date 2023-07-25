<script lang="ts">
  import Portal from './utils/Portal.svelte';
  export let isOpen = false;

  let screenHeight: number = null;
  const edgeInView = 48;
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
    />
  {/if}
  <div
    class="fixed top-full left-0 w-full bg-white rounded-t-xl px-4 py-2 z-10 transition-all h-1/2 z-50"
    style="top: {isOpen ? openPosition : closedPosition}px"
  >
    <slot />
  </div>
</Portal>
