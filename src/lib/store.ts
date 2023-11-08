import type { Activity, City } from '$types/client';
import type { Region } from '$types/neighborhoods/nyc';
import { writable, type Writable } from 'svelte/store';

export const activities: Writable<Activity[]> = writable(null);
export const athleteId: Writable<string> = writable('');
export const city: Writable<City | null> = writable(null);
export const regions: Writable<Region[]> = writable([]);
export const isMobile: Writable<boolean> = writable(false);
