import type { ClientActivity } from '$types/client';
import { writable, derived, type Writable } from 'svelte/store';

export const activities: Writable<ClientActivity[]> = writable([]);
