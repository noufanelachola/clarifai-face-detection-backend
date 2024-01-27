require('dotenv').config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt-nodejs");
const knex = require("knex");

const register = require("./controllers/register");
const signIn = require("./controllers/signIn");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const db = knex({
    client: "pg",
    connection: {
        connectionString:process.env.PG_DATABASE_URL,
        ssl:{
            rejectUnauthorized: false
        }
    }
});

// const saltRounds = 10;


app.get("/",(req,res) => {
  db.select("*").from("users").then(data => res.json(data[0])).catch(err => res.status(400).json("errorr!!"));
});
app.post("/signin",(req,res) => {signIn.handleSignIn(req,res,db,bcrypt)});
app.post("/register",(req,res) => {register.handleRegister(req,res,db,bcrypt)});
app.get("/profile/:id",(req,res) => {profile.handleProfile(req,res,db)});
app.put("/image",(req,res) => {image.handleImage(req,res,db)});
app.post("/imageurl",(req,res) => {image.handleApiCall(req,res)});


app.listen(process.env.PORT || 3000,() => {
    console.log(`App is running on port ${process.env.PORT}`)
});

