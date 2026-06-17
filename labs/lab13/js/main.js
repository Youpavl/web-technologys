// Завдання 4
let side1 = parseFloat(prompt("Введіть довжину першої сторони трикутника:"));
let side2 = parseFloat(prompt("Введіть довжину другої сторони трикутника:"));
let side3 = parseFloat(prompt("Введіть довжину третьої сторони трикутника:"));

if (isNaN(side1) || isNaN(side2) || isNaN(side3) ||
    side1 <= 0 || side2 <= 0 || side3 <= 0 ||
    side1 + side2 <= side3 || side1 + side3 <= side2 || side2 + side3 <= side1) {
    console.log("Трикутник з такими сторонами не існує");
} else {
    let p = (side1 + side2 + side3) / 2;
    let area = Math.sqrt(p * (p - side1) * (p - side2) * (p - side3));
    console.log("Площа трикутника: " + area.toFixed(3));

    let isRight = false;
    let max = Math.max(side1, side2, side3);

    if (max === side1 && Math.abs(side1 ** 2 - (side2 ** 2 + side3 ** 2)) < 0.001) isRight = true;
    else if (max === side2 && Math.abs(side2 ** 2 - (side1 ** 2 + side3 ** 2)) < 0.001) isRight = true;
    else if (max === side3 && Math.abs(side3 ** 2 - (side1 ** 2 + side2 ** 2)) < 0.001) isRight = true;

    if (isRight) {
        console.log("Трикутник є прямокутним");
    } else {
        console.log("Трикутник не є прямокутним");
    }
}