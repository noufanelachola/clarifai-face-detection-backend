const handleRegister = (req,res,db,bcrypt,saltRounds) => {
    const {name,email,password} = req.body;
    const hash = bcrypt.hashSync(password,saltRounds);

    if(name.length && email.length && password.length){
        db.transaction(trx => {
            trx.insert({
                hash : hash,
                email : email
            })
            .into("login")
            .returning("email")
            .then(loginEmail => {
                return trx("users")
                    .returning("*")
                    .insert({
                        name : name,
                        email : loginEmail[0].email,
                        joined : new Date()
                    })
                    .then(user => {
                        // the user gives an array of objects, so we get into the first element
                        res.json(user[0]);
                    })
                })
                .then(trx.commit)
                .catch(trx.rollback)
            })
        .catch(err => {
            res.status(400).json("Unable to register");
        })

    } else {
        res.status(404).json("No valid info")
    }
}

module.exports = {
    handleRegister
}