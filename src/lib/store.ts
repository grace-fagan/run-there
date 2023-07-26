import type { Activity } from '$types/client';
import type { ClientBorough } from '$types/neighborhoods/nyc';
import { writable, type Writable } from 'svelte/store';

export const activities: Writable<Activity[]> = writable(null);
export const athleteId: Writable<string> = writable('');
export const boroughs: Writable<ClientBorough[]> = writable([]);
export const isMobile: Writable<boolean> = writable(false);
