<script lang="ts">
  export let borderColor: string;
  export let borderTop: string;
  export let size = 3;
</script>

<div
  class="animate-spin rounded-full border-4"
  style="border-color: {borderColor}; border-top-color: {borderTop}; width: {size}rem; height: {size}rem"
/>
