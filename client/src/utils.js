/**Utilities */

Number.prototype.between = function(a, b, inclusive) {
  var min = Math.min.apply(Math, [a, b]),
    max = Math.max.apply(Math, [a, b]);
  return inclusive ? this >= min && this <= max : this >= min && this < max;
};

class Point {
  constructor (x, y) {
    this.x = x;
    this.y = y;
  }
}