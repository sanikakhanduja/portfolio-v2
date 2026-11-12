import { toast } from './toast';

/** Copy text to the clipboard and confirm with a toast. */
export async function copyText(text: string, done: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast(done);
  } catch {
    toast(text); // clipboard refused: show the text so it can be copied by hand
  }
}
