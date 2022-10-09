// test assign
let a = 12;
a += 1;
deepEqual(a, 13);
a -= 1;
deepEqual(a, 12);
a *= 2;
deepEqual(a, 24);
a /= 3;
deepEqual(a, 8);
a = "hello, world";
deepEqual(a, "hello, world");
