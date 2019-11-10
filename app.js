//credit goes to Tony's class notes for providing me with code to start with

const express = require('express');
const path = require("path");
const fs = require("fs");
const logger = require("./middleware/logger");
const bodyParser = require('body-parser');
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");

//setting up exress
const app = express();

//setting up mongoose connection, console logging error or successfully connected
mongoose.connect(process.env.DB_CONNECTION, {
  useUnifiedTopology:true, useNewUrlParser: true
});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error connecting to mongoose"));
db.once("open", function(){
    console.log("Connected to the database");
})

//creating schema for subscription form info that will go into the database

const subscriptionSchema = new mongoose.Schema(
  {

    name:
    {
      type: String,
      required: true
    },

    email:
    {
      type: String,
      required: true
    },

    over18:
    {
      type: Boolean,
      required: true
    }
  }
);



//setting up express body parser and view engine
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs"); 


//get pages

app.get("/", function(request, response){
  response.render("index");
});

app.get("/photography", function(request, response){
    response.render("photography");
  });

app.get("/art", function(request, response){
    response.render("art");
  });

app.get("/about", function(request, response){
    response.render("about");
  });

app.get("/subscribe", function(request, response){
    response.render("subscribe");
  });


//middleware
//whenever we submit the form, log subscriber to log.txt
app.use("/submit", logger);


//post
app.post('/submit', function(request, response){
  // if(err){
  //   response.redirect("/subscribe")
  // }
  
  const inputName = request.body.name;
  const inputEmail = request.body.email;
  const inputOver18 = request.body.checkbox;

  response.render("submit", {
    inputName: inputName,
    inputEmail: inputEmail,
    inputOver18: inputOver18
  });

  //invoking schema into live model and saving to database

  const Subscription = mongoose.model("Subscription", subscriptionSchema)

  const newSubscription = new Subscription(
    {
     name: inputName,
     email: inputEmail,
     over18: inputOver18
    }
  )

  newSubscription.save(function(err, newSubscription){
    if(err) return console.error(err);
    console.log("Subscription added to database");
    });

  });


//static assets
app.use(express.static(path.join(__dirname, "assets")));


//error handling for page not found
app.use(function(request, response, next){
  response.status(404);
  response.send("404: Page not found");
})


//listening on port 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, function (){
    console.log(`Listening on port ${PORT}`);
});