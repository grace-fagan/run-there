import type { Activity } from '$types/client';
import { writable, type Writable } from 'svelte/store';

export const activities: Writable<Activity[]> = writable(null);
