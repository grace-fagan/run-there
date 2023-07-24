<script lang="ts">
  import Portal from './utils/Portal.svelte';
  export let isOpen = false;
</script>

<Portal>
  {#if isOpen}
    <div
      class="fixed top-0 left-0 h-screen w-full bg-stone-700 opacity-10 z-40"
      on:pointerdown={(e) => {
        isOpen = false;
        e.stopPropagation();
      }}
    />
  {/if}
  <div
    class="fixed top-full left-0 w-full bg-white rounded-t-xl px-4 py-2 z-10 transition-all h-1/2 z-50"
    style="top: {isOpen ? window.innerHeight / 2 : window.innerHeight - 48}px"
  >
    <slot />
  </div>
</Portal>
