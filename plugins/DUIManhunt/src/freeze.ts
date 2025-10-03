//The `movementSpeed` can be bypassed with spamming, so I just forced the keys to disable.
//But on-screen buttons exist so I just used it anyway.

const blockKeys = [
  ' ',
  'a',
  'w',
  'd',
  'arrowleft',
  'arrowup',
  'arrowright',
]

const stopInputs = (e: KeyboardEvent) => {
  const key = e.key.toLowerCase();
  if (!blockKeys.some(k => key === k)) return;

  e.preventDefault();
  e.stopPropagation();
}

export function freeze() {
  document.addEventListener('keydown', stopInputs);
  api.stores.me.movementSpeed = 0;
}

export function unFreeze() {
  document.removeEventListener('keydown', stopInputs);
  api.stores.me.movementSpeed = 310;
}