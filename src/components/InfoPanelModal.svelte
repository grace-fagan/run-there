<script lang="ts">
  import { boroughs } from '$lib/store';
  import type { ClientBorough } from '$types/neighborhoods/nyc';
  import BoroughHeader from './BoroughHeader.svelte';
  import Footer from './Footer.svelte';
  import Modal from './Modal.svelte';
  import NeighborhoodsList from './NeighborhoodsList.svelte';
  export let selectedBorough: ClientBorough;
  export let toggleBorough: (id: number) => void;
  export let maxNeighborhoods: number;
  export let numActivities: number;
  export let selectedId: number;
  export let modalOpen = false;

  const toggleModal = () => (modalOpen = !modalOpen);
</script>

<Modal bind:isOpen={modalOpen} edgeInView={64}>
  <div class="flex flex-col h-full">
    <div
      class="flex flex-col pb-2 border-b border-stone-200 px-4"
      on:click={toggleModal}
      on:keydown={toggleModal}
      role="none"
    >
      <div class="w-full flex justify-center">
        <button
          class={`fa-solid ${modalOpen ? 'fa-angle-down' : 'fa-angle-up'} text-md text-stone-400`}
        />
      </div>
      {#if !modalOpen}
        <div class="flex items-center gap-2">
          {#if selectedBorough}
            <button
              class="fa-solid fa-arrow-left text-stone-400 text-md"
              on:click={(e) => {
                e.stopPropagation();
                toggleBorough(null);
              }}
            />
          {/if}
          <div class="grow">
            {#if selectedBorough}
              <BoroughHeader borough={selectedBorough} {maxNeighborhoods} showActivities={false} />
            {:else}
              <div class="h-9 flex items-center justify-center">
                <p class="text-stone-400">More details</p>
              </div>
            {/if}
          </div>
        </div>
      {/if}
    </div>

    {#if selectedBorough}
      <div class="flex items-center gap-2 px-4">
        <button
          class="fa-solid fa-arrow-left text-stone-400 text-md"
          on:click={(e) => {
            e.stopPropagation();
            toggleBorough(null);
          }}
        />
        <div class="grow">
          <BoroughHeader borough={selectedBorough} {maxNeighborhoods} showActivities={false} />
        </div>
      </div>
      <NeighborhoodsList
        neighborhoods={selectedBorough.neighborhoods}
        numActivities={selectedBorough.runs.length}
        showActivities={true}
        bind:selectedId
      />
    {:else}
      <div class="grow shrink flex flex-col px-4 pt-2 justify-around">
        {#each $boroughs as borough}
          <BoroughHeader {borough} handler={toggleBorough} {maxNeighborhoods} />
        {/each}
      </div>
    {/if}
  </div>
  <div class="py-4 px-4">
    <Footer {numActivities} />
  </div>
</Modal>
