// Завдання 6
let firstName = "Pavlo";
let lastName = "Ivashkiv";
let group = "KN-321";
let birthYear = 2008;
let isMarried = false;

console.log(birthYear);
console.log(isMarried);
console.log(firstName, lastName, group);

let emptyValue = null;
let notAssigned;

console.log(typeof emptyValue);
console.log(typeof notAssigned);


// Завдання 7
let userLogin = prompt("Введіть ваш логін:", "");
let userEmail = prompt("Введіть ваш email:", "");
let userPassword = prompt("Введіть ваш пароль:", "");

alert(`Dear ${userLogin}, your email is ${userEmail}, your password is ${userPassword}`);