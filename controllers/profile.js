const handleProfile = (req,res,db) => {
    const {id} = req.params;

    // in ES6 ,we can write the object like this , since both property 
    // and value are the same
    db.select("*").from("users").where({id}).then(user => {
        if(user.length){
            res.json(user[0]);
        } else {
            res.status(400).json("user not found");
        }
    })
    .catch(err => res.status(400).json("error gotch you"));
}

module.exports = {
    handleProfile
}