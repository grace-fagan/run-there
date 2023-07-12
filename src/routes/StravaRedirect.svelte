<script lang="ts">
  import { authURL, promiseWhile, scope } from '$lib/server-utils';
  import { getUserAuth, getUserActivities } from '$lib/api';
  import { accessToken } from '$lib/store';
  import { onMount } from 'svelte';

  const queryParams = new URLSearchParams(window.location.search);
  const authedScope = queryParams.get('scope');
  const stravaAuthToken = queryParams.get('code');
  let error = '';

  const fetchAllActivities = async (accessToken: string) => {
    let startPage = 1;
    let currActivities: string[] = [];
    let totalActivities: string[] = [];

    const nullPage = () => currActivities.length === 0 && startPage > 1;

    const getTwoPages = async () => {
      console.log('getting page: ', startPage);
      let data = await getUserActivities(accessToken, startPage);
      currActivities = data.userActivities;
      totalActivities = totalActivities.concat(currActivities);
      startPage++;
    };

    return promiseWhile(nullPage, getTwoPages).then(() => {
      // localStorage.setItem('totalActivities', JSON.stringify(totalActivities))
      console.log('finished fetching data!');
      console.log({ totalActivities });
    });
  };

  onMount(async () => {
    const accessToken = localStorage.getItem('accessToken');
    // authenticate user
    if (authedScope !== scope) {
      error = 'Oh no! You must allow the app to view your data to continue';
    } else if (accessToken) {
      error = 'already have access token!';
    } else {
      const userAuth = await getUserAuth(stravaAuthToken);
      // to-do: remove access token when user signs out or signs into a new account
      localStorage.setItem('accessToken', userAuth.accessToken);
    }

    // fetch activity data
    if (accessToken) {
      const activities = await fetchAllActivities(accessToken);
    }
  });
</script>

<main>
  <h1>Fetching your data...</h1>
  {#if error}
    <p>{error}</p>
  {/if}
</main>
