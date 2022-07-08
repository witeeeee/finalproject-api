const handleRegister = (req, res, knex, bcrypt) => {
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
}

module.exports = {
    handleRegister: handleRegister
};