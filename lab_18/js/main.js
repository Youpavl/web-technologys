class Shape {
    constructor(color) {
        this.color = color;
    }
}

class Circle extends Shape {
    constructor(color, radius) {
        super(color);
        this.radius = radius;
    }

    getArea() {
        return Math.PI * (this.radius ** 2);
    }

    getPerimeter() {
        return 2 * Math.PI * this.radius;
    }
}

class Rectangle extends Shape {
    constructor(color, width, height) {
        super(color);
        this.width = width;
        this.height = height;
    }

    getArea() {
        return this.width * this.height;
    }
    getPerimeter() {
        return 2 * (this.width + this.height);
    }
}

let myCircle = new Circle("жовтий", 5);
let myRectangle = new Rectangle("оранжевий", 10, 20);

console.log(`Коло: колір - ${myCircle.color}, площа - ${myCircle.getArea().toFixed(2)}`);

console.log(`Прямокутник: колір - ${myRectangle.color}, площа - ${myRectangle.getArea()}`);