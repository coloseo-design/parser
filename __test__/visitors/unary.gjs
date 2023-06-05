let j = 0;
++j;
deepEqual(j, 1);
++j;
deepEqual(j, 2);
--j;
deepEqual(j, 1);
-(++j);
deepEqual(j, -2);

let A0 = 10;
let A1 = 20;
let A3 = (A0 + A1) * 0.3;
