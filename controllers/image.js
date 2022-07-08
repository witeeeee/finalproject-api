const handleImage = (req, res, knex) => {
    const {email} = req.body;
    knex('users').where('email', '=', email).increment('entries', 1).returning('entries').then(entries => {
        res.json(entries[0])
    })
    .catch(err => res.status(400).json("Unable to get entries"));
}

module.exports = {
    handleImage: handleImage
};