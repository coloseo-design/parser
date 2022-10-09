function add(a, b) {
  return a + b + c;
}

let a = 1;
let b = 2;
let c = 3;

let d = add(a + 2, b + 1);
deepEqual(d, 9);
