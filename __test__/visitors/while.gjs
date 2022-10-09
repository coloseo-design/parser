let i = 0;
let j = 0;
while (i < 10) {
  j += i;
  i += 1;
}

deepEqual(j, 45);
