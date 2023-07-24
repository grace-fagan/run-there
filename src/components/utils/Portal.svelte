<!-- https://github.com/sveltejs/svelte/issues/3088 -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  export let target: HTMLElement | null | undefined = document?.body;
  let ref: HTMLElement;

  onMount(() => {
    if (target) target.appendChild(ref);
  });

  onDestroy(() => {
    setTimeout(() => {
      if (ref?.parentNode) ref.parentNode?.removeChild(ref);
    });
  });
</script>

<div class="portal" bind:this={ref}>
  <slot />
</div>
