const handleSignin = (req, res, knex, bcrypt) => {
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
}

module.exports = {
    handleSignin: handleSignin
};