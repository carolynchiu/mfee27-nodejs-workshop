let ary = [
  {
    id: 1,
    type: "A",
    price: 100,
  },
  {
    id: 2,
    type: "B",
    price: 200,
  },
  {
    id: 3,
    type: "A",
    price: 300,
  },
  {
    id: 4,
    type: "A",
    price: 400,
  },
  {
    id: 5,
    type: "B",
    price: 500,
  },
];

const price = ary.map((item) => item.price);
console.log(price);

//用 for-loop
function map(arr) {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    result.push(arr[i].price);
  }
  return result;
}
console.log(map(ary));
