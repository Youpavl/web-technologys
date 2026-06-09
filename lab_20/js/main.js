function isValidURL(url) {
    let pattern = /^(http|https|ftp):\/\//;

    return pattern.test(url);
}

// Приклад використання:
let url1 = "https://www.example.com";
let url2 = "ftp://fileserver/documents";
let url3 = "invalid-url";
let url4 = "http://example.com";

console.log(isValidURL(url1)); // true
console.log(isValidURL(url2)); // true
console.log(isValidURL(url3)); // false
console.log(isValidURL(url4)); // true