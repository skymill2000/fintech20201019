var car1 = "Saab";
var car2 = "Volvo";
var car3 = "BMW";
var numberData = 6;
var carObject = {
  name: "sonata",
  ph: "500ph",
  start: function () {
    console.log("engine is starting");
  },
  stop: function () {
    console.log("engine is stoped");
  },
};

var cars = ["Saab", "Volvo", "BMW", numberData, carObject];
//java String [] cars = new Array(6);
console.log(cars);
console.log(cars[0]);
console.log(cars[1]);
console.log(cars[2]);
