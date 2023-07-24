<script lang="ts">
  import { athleteId } from '$lib/store';
</script>

<a
  class="text-xs underline text-gray-800"
  href={`https://www.strava.com/athletes/${$athleteId}`}
  target="_blank">View on Strava</a
>
