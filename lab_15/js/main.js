// Завдання 4
function convertToCamel(cssProp) {
    let parts = cssProp.split('-');

    let finalStr = parts[0];

    for (let i = 1; i < parts.length; i++) {
        let piece = parts[i];

        let firstChar = piece[0].toUpperCase();

        let tail = piece.slice(1);

        finalStr += firstChar + tail;
    }

    return finalStr;
}

// Перевірка
console.log(convertToCamel('font-size'));
console.log(convertToCamel('background-color'));
console.log(convertToCamel('text-align'));
console.log(convertToCamel('border-left-color'));
console.log(convertToCamel('border-radius-top-left'));
console.log(convertToCamel('vertical-align-baseline'));

// Або для перевірки можна написати так
let test1 = 'background-color';
let test2 = 'vertical-align';
let test3 = 'margin-top-left';

console.log(test1 + " => " + convertToCamel(test1));
console.log(test2 + " => " + convertToCamel(test2));
console.log(test3 + " => " + convertToCamel(test3));