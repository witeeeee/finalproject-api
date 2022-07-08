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

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
    res.json(database.users);
})

app.post("/signin", (req, res) => {
    knex.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(data=> {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if(isValid) {
            knex.select('*').from('users').where('email', '=', req.body.email)
            .then(user => {
                res.json(user[0]);
            })
            .catch(err => res.status(400).json("Unable to get user"))
        }
        else {
            throw err;
        }
    })
    .catch(err => res.status(400).json("Invalid credentials"))
})

app.post("/register", (req, res) => {
    const {name, email, password} = req.body;
    const hash = bcrypt.hashSync(password);

    knex.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginemail => {
            trx('users').returning('*').insert({
                email: loginemail[0].email,
                name: name,
                joinedat: new Date()
            }).then(user => {
                res.json(user[0]);
            }).catch(err=> res.status(400).json('unable to register'))
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('Unable to register'))
})

app.get('/profile/:email', (req, res) => {
    const {email} = req.params;
    knex.select('*').from('users').where({
        email:email
    }).then(user => {
        if(user.length === 0) {
            res.status(400).json("User not found")
        }
        else {
            res.json(user[0])
        }
    })
})

app.put('/image', (req, res) => {
    const {email} = req.body;
    knex('users').where('email', '=', email).increment('entries', 1).returning('entries').then(entries => {
        res.json(entries[0])
    })
    .catch(err => res.status(400).json("Unable to get entries"));
})

app.listen(3001, () => {
    console.log("Listening on port 3001");
})