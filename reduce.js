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

const totalPrice = ary.reduce((acc, cur) => acc + cur.price, 0);
console.log(totalPrice);

//用 for-loop
function reduce(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i].price;
  }
  return sum;
}
console.log(reduce(ary));
