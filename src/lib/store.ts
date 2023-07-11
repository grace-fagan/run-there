import { writable, derived, type Writable } from 'svelte/store';
import type { Activity } from '../types';

export const userActivities = Writable<Activity[]>