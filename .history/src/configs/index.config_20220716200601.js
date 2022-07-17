require("dotenv").config();

if (process.env.NODE_ENV === 'development') {
 console.log("development environment")
}

log.info(process.env.NODE_ENV);


if (process.env.NODE_ENV === 'development') {
 console.log("production environment")
}

