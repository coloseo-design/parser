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
deepEqual(kindOfSister, 'little sister');
