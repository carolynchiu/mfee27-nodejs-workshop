function sum(n) {
  //1+2+3...+n
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}
console.log(sum(1));
console.log(sum(3));
console.log(sum(10));
