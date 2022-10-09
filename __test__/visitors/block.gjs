let a = 1;
{
  let a = 13;
}

deepEqual(a,  1);

let b = 2;
{
  b = b + 1;
}

deepEqual(b, 3);
