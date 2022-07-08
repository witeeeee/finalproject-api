const handleSignin = (req, res, knex, bcrypt) => {
    const {email, password} = req.body;
    if(!email || !password)
        return res.status(400).json("Dingus");
    knex.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data=> {
        const isValid = bcrypt.compareSync(password, data[0].hash);
        if(isValid) {
            knex.select('*').from('users').where('email', '=', email)
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