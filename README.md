<h1 align="center">FASTICK</h1>

Fastick is an online platform that will be used to order movie tickets at theaters.
Fastick is built using the javascript language and also use React.js framework for the frontend Web
And Express.js for the backend. [More about Express](https://en.wikipedia.org/wiki/Express.js) And [React.js](https://en.wikipedia.org/wiki/React_(JavaScript_library))

## Built With

[![Node.js](https://img.shields.io/badge/Node.js-v.12.13-green.svg?style=rounded-square)](https://nodejs.org/)
[![React.js](https://img.shields.io/badge/React.js-v.18.x.x-blue.svg?style=rounded-square)](https://reactjs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-orange.svg?style=rounded-square)](https://expressjs.com/en/starter/installing.html)


## Requirements

1. <a href="https://nodejs.org/en/download/">Node Js</a>
2. Node_modules
3. <a href="https://www.getpostman.com/">Postman</a>
4. Web Server (ex. localhost)

## How to run the app ?

1. Open app's directory in CMD or Terminal
2. Type `npm install`
3. Make new file a called **.env**, set up first [here](#set-up-env-file)
4. Turn on Web Server and MySQL can using Third-party tool like xampp, etc.
5. Create a database with the name #nama_database, and Import file sql to **phpmyadmin**
6. Open Postman desktop application or Chrome web app extension that has installed before
7. Choose HTTP Method and enter request url.(ex. localhost:3000/)
8. You can see all the end point [here](https://documenter.getpostman.com/view/9852901/TzJoEfvL)

## Set up .env file

Open .env file on your favorite code editor, and copy paste this code below :

```
HOST = localhost // Database Host
USER = root // localhost Account
DB = fastick // Database Name
PW = password // localhost Password
CLIENT_ID = Google Cloud 
CLIENT_SECRET = Google Cloud
REFRESH_TOKEN = Google Cloud
```
[More About Google Cloud](https://console.cloud.google.com/home)


## License

© [Maulana Sholihin](https://github.com/mauloli/)
