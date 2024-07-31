const empty = (_) => new Map();

const update = (t, k, f) => t.set(k, f(t.get(k)));

const append = (t, k, v) => update(t, k, (a = []) => [...a, v]);

const _new = (a = [], f) => a.reduce((t, v) => append(t, f(v), v), empty());

export { _new, empty, update, append };
