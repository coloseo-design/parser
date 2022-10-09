let age = 12;
let kind = 'children';
if (age >= 12) {
  kind = 'young man';
}
let ageOfLittleSister = age - 2;
let kindOfSister = 'little sister';
if (age < ageOfLittleSister) {
  kindOfSister = 'older sister';
}

let littleGirl = age > ageOfLittleSister || age == ageOfLittleSister;
deepEqual(littleGirl, true);
let older = 12 > 11;
deepEqual(older || true, true);
deepEqual(kindOfSister, 'little sister');
