// java
// public void test() {} , public String getName(){}

// + - / 기능 추가 es6
// const multi = (p1, p2) =>{
//     return p1 * p2
// }

function multi(p1, p2) {
  return p1 * p2; // p1, p2 곱연산의 결과를 반환한다.
}

function div(p1, p2) {
  return p1 / p2; // p1, p2 곱연산의 결과를 반환한다.
}

function plus(p1, p2) {
  return p1 + p2; // p1, p2 곱연산의 결과를 반환한다.
}

function minus(p1, p2) {
  return p1 - p2; // p1, p2 곱연산의 결과를 반환한다.
}

console.log(multi(3, 4));
console.log(div(3, 4));
console.log(plus(3, 4));
console.log(minus(3, 4));
