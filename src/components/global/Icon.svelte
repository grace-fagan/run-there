<script lang="ts">
  export let icon: string;
  export let onClick: () => void;
</script>

<i class={`${icon} w-min hover:scale-105 cursor-pointer transition-all`} on:pointerdown={onClick} />
