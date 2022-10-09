function combine(prefix, content) {
  return prefix + content;
}

let d = combine("hello, ", "world");
deepEqual(d, 'hello, world');
