import type { Activity } from '$types/client';
import { writable, derived, type Writable } from 'svelte/store';

export const activities: Writable<Activity[]> = writable(null);
