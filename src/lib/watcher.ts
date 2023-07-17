/* eslint-disable @typescript-eslint/no-explicit-any */
import { writable } from 'svelte/store';

function watcher(initialValue: any, watchFunction: (oldVal: any, newVal: any) => void) {
  const { subscribe, update } = writable(initialValue);
  return {
    subscribe,
    set: (value: any) => {
      update((oldvalue) => {
        watchFunction(oldvalue, value);
        return value;
      });
    }
  };
}

export default watcher;
