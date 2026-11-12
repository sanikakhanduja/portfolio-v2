/** Fire-and-forget toast: any component can call toast('Email copied'). */
export const toast = (msg: string) => window.dispatchEvent(new CustomEvent<string>('sk-toast', { detail: msg }));
