const handleProfile = (req, res, knex) => {
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
}

module.exports = {
    handleProfile: handleProfile
};