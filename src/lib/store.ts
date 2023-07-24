import type { Activity } from '$types/client';
import { writable, type Writable } from 'svelte/store';

export const activities: Writable<Activity[]> = writable(null);
export const athleteId: Writable<string> = writable('');
export const isMobile: Writable<boolean> = writable(false);
