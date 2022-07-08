const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
const knex = require('knex')({
    client:'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'siddharth',
        database: 'finalproject'
    }
})
const register = require('./controllers/register.js');
const signin = require('./controllers/signin.js');
const image = require('./controllers/image.js');
const profile = require('./controllers/profile.js');
const PORT = process.env.PORT;
const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post("/signin", (req, res) => {signin.handleSignin(req, res, knex, bcrypt)});

app.post("/register", (req, res) => {register.handleRegister(req, res, knex, bcrypt)});

app.get('/profile/:email', (req, res) => {profile.handleProfile(req, res, knex)});

app.put('/image', (req, res) => {image.handleImage(req, res, knex)})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})