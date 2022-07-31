let ary = [
  {
    id: 1,
    type: "A",
    price: 100,
  },
  {
    id: 2,
    type: "B",
    price: 1000,
  },
  {
    id: 3,
    type: "A",
    price: 150,
  },
  {
    id: 4,
    type: "A",
    price: 500,
  },
  {
    id: 5,
    type: "B",
    price: 800,
  },
];

const array = ary.find((item) => item.price >= 500);
console.log(array);

//用 for-loop
function find(arr) {
  let result;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].price >= 500) {
      result = arr[i];
      break;
    }
  }
  return result;
}
console.log(find(ary));
