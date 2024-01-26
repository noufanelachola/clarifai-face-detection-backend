require('dotenv').config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt-nodejs");
const knex = require("knex");
// require('dotenv').config();
// const { Client } = require('pg'); 

const register = require("./controllers/register");
const signIn = require("./controllers/signIn");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const DataBase = process.env.PG_DATABASE;
const UserName = process.env.PG_USER;
const Password = process.env.PG_PASSWORD;
const Port = process.env.PG_PORT;
const Host = process.env.PG_HOST;

const db = knex({
    client: "pg",
    connection: {
        host : Host,
        port : Port,
        user : UserName,
        password : Password,
        database : DataBase
    }
});

// const saltRounds = 10;


app.get("/",(req,res) => {
    res.json("it is working");
    db.raw('SELECT 1+1 as result')
      .then(() => {
        res.json('Connected to database');
      })
      .catch(err => {
        res.json('Error connecting to database:', err);
    });

});
// app.post("/signin",(req,res) => {signIn.handleSignIn(req,res,db,bcrypt)});
// app.post("/register",(req,res) => {register.handleRegister(req,res,db,bcrypt)});
// app.get("/profile/:id",(req,res) => {profile.handleProfile(req,res,db)});
// app.put("/image",(req,res) => {image.handleImage(req,res,db)});
// app.post("/imageurl",(req,res) => {image.handleApiCall(req,res)});


app.listen(process.env.PORT || 3000,() => {
    console.log(`App is running on port ${process.env.PORT}`)
});