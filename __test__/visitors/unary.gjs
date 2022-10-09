let j = 0;

++j;
deepEqual(j, 1);
++j;
deepEqual(j, 2);
--j;
deepEqual(j, 1);
-(++j);
deepEqual(j, -2);


