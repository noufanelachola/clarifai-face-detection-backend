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

const db = knex({
    client: "pg",
    connection: {
        host : '127.0.0.1',
        port : 5432,
        user : 'postgres',
        password : '9987',
        database : 'smartbrain'
    }
});


app.get("/",(req,res) => {res.json("it is working")});
app.post("/signin",(req,res) => {signIn.handleSignIn(req,res,db,bcrypt)});
app.post("/register",(req,res) => {register.handleRegister(req,res,db,bcrypt)});
app.get("/profile/:id",(req,res) => {profile.handleProfile(req,res,db)});
app.put("/image",(req,res) => {image.handleImage(req,res,db)});
app.post("/imageurl",(req,res) => {image.handleApiCall(req,res)});


app.listen(process.env.PORT || 3000,() => {
    console.log(`App is running on port ${process.env.PORT}`)
});