export function control(f) {
  return Promise.resolve().then(() => { return f() });
}
