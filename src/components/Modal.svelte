<script lang="ts">
  import { fade } from 'svelte/transition';
  import Portal from './utils/Portal.svelte';
  export let isOpen = false;
  export let edgeInView: number = 48;

  let screenHeight: number = null;
  let modalElement: HTMLElement = null;
  $: openPosition = screenHeight - screenHeight / 3;
  $: closedPosition = screenHeight - edgeInView;
  $: if (!isOpen && modalElement) modalElement.scroll(0, 0);

  const handleClick = (e: MouseEvent | KeyboardEvent) => {
    isOpen = false;
    e.stopImmediatePropagation();
  };
</script>

<svelte:window bind:innerHeight={screenHeight} />
<Portal>
  <!-- {#if isOpen}
    <div
      class="fixed top-0 left-0 h-screen w-full bg-stone-700 opacity-10 z-40"
      on:click={handleClick}
      on:keydown={handleClick}
      role="none"
      in:fade
    />
  {/if} -->
  <div
    class="fixed left-0 w-full bg-white rounded-t-xl z-10 py-2 transition-all h-1/3 z-50 outer-shadow"
    style="top: {isOpen ? openPosition : closedPosition}px; overflow: {isOpen
      ? 'scroll'
      : 'hidden'}"
    bind:this={modalElement}
  >
    <slot />
  </div>
</Portal>
