<script lang="ts">
  export let completed: number;
  export let total: number;
  export let color: string;
  export let maxTotal: number;
</script>

<div class="grow flex gap-2 items-center">
  <div
    class="rounded-xl border-2 h-full box-border"
    style="border-color: {color}; width: {(total / maxTotal) * 100 + '%'}"
  >
    <div
      class={`h-full rounded-l-xl ${total === completed ? 'rounded-r-xl' : 'rounded-r-sm'}`}
      style="background-color: {color}; width: {(completed / total) * 100 + '%'}"
    />
  </div>
  <p class="secondary">{completed}/{total}</p>
</div>
