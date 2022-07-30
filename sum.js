//1) for-loop
function sum(n) {
  //1+2+3...+n
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

//2)等差級數 公式解
function sum2(n) {
  return ((n + 1) * n) / 2;
}

//3)遞迴
function sum3(n) {
  if (n === 1) {
    return n;
  }
  return sum3(n - 1) + n;
}

//4) reduce

console.log(sum(1), sum2(1), sum3(1));
console.log(sum(3), sum2(3), sum3(3));
console.log(sum(10), sum2(10), sum3(10));
