var car = {
  name: "sonata",
  ph: "500ph",
  start: function () {
    console.log("engine is starting");
  },
  stop: function () {
    console.log("engine is stoped");
  },
};
var car2 = {
  name: "bmw",
  ph: "600ph",
  start: function () {
    console.log("engine is starting");
  },
  stop: function () {
    console.log("engine is stoped");
  },
};
var car3 = {
  name: "fiat",
  ph: "200ph",
  start: function () {
    console.log("engine is starting");
  },
  stop: function () {
    console.log("engine is stoped");
  },
};

var cars = [];
// var cars = [car, car2, car3];
cars[0] = car;
cars[1] = car2;
cars[2] = car3;

console.log(cars[0].name + "의 마력은" + cars[0].ph);
