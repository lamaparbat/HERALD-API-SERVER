require("dotenv").config();

if (process.env.NODE_ENV === 'development') {
 console.log("development environment")
}
console.log("hacker");


if (process.env.NODE_ENV === 'development') {
 console.log("production environment")
}

