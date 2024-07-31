const empty = (_) => {};

const _new = (i, f, root = null) => {
  const many = (a = []) => a.map((v) => one(v));
  const one = (v) => f(v, (next) => many(i.get(next)));
  return many(i.get(root));
};

export { _new, empty };
