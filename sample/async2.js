function aFunc() {
  setTimeout(function () {
    console.log("a");
  }, 1700);
}

function bFunc() {
  setTimeout(function () {
    console.log("b");
  }, 1000);
}

function cFunc() {
  setTimeout(function () {
    console.log("c");
  }, 500);
}

aFunc();
bFunc();
cFunc();

//비동기방식을 올바르게 순서대로 처리하는 방법중
//1. callback O
//2. Promise 객체를 활용하는 방법 X (나중에 한번)
//3. async / await 기능을 활용하는 방법 X
