<script lang="ts">
  import { authURL, promiseWhile, scope, type UserAuth } from '$lib/server-utils';
  import { getUserAuth, getUserActivities } from '$lib/api';
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-routing';

  const queryParams = new URLSearchParams(window.location.search);
  const authedScope = queryParams.get('scope');
  const stravaAuthCode = queryParams.get('code');

  let accessToken = '';
  let athleteId = '';

  let error = '';
  let fetchingActivities = false;

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
      console.log('finished fetching data!', { totalActivities });
      return totalActivities;
    });
  };

  const getLocalAuth = (): UserAuth => {
    const authString = localStorage.getItem('userAuth');
    return JSON.parse(authString);
  };

  // authenticate user
  onMount(async () => {
    // if single use auth code has already been used, redirect to home page
    if (stravaAuthCode === localStorage.getItem('singleUseCode')) navigate('/');
    else localStorage.setItem('singleUseCode', stravaAuthCode);

    const validScope = authedScope === scope;
    const localAuth = getLocalAuth();
    const now = new Date().getTime();
    let newAuth: UserAuth = null;

    if (!validScope) {
      error = 'Oh no! You must allow the app to view your data to continue';
    } else {
      try {
        if (!localAuth) {
          newAuth = await getUserAuth(stravaAuthCode, 'authorization_code');
          // if user exists but access token has expired
        } else if (localAuth.expiresAt * 1000 < now) {
          console.log('access code expired! Getting a new one...');
          newAuth = await getUserAuth(localAuth.refreshToken, 'refresh_token');
        } else newAuth = localAuth;
      } catch (error) {
        // TO-DO: error handling
        console.error(error);
      }

      // TO-DO: support multiple users
      if (newAuth) {
        accessToken = newAuth.accessToken;
        athleteId = newAuth.id;
        console.log('setting to local storage: ', newAuth);
        localStorage.setItem('userAuth', JSON.stringify(newAuth));
      }

      // fetch activity data
      const activities = localStorage.getItem(`activities-${athleteId}`);
      if (accessToken && !activities) {
        try {
          fetchingActivities = true;
          const newActivities = await fetchAllActivities(accessToken);
          localStorage.setItem(`activities-${athleteId}`, JSON.stringify(newActivities));
          fetchingActivities = false;
        } catch (error) {
          //TO-DO: error handling
          console.error(error);
        }
      }
    }
  });
</script>

<main>
  <h1>Redirect page</h1>
  {#if error}
    <p>{error}</p>
    <button
      class="p-2 border border-gray-300 rounded-md hover:scale-105 transition-all"
      on:click={() => window.location.replace(authURL)}>Go back</button
    >
  {/if}
  {#if fetchingActivities}
    <p>Fetching activities...</p>
  {/if}
</main>
