<script lang="ts">
  import { Router, Route } from 'svelte-routing';
  import Home from './routes/Home.svelte';
  import StravaRedirect from './routes/StravaRedirect.svelte';
  import NYC from './routes/NYC.svelte';
</script>

<Router>
  <Route path="/"><Home /></Route>
  <Route path="/redirect/:data"><StravaRedirect /></Route>
  <Route path="/nyc"><NYC /></Route>
</Router>
