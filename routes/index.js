var express = require('express');
var router = express.Router();

//1. Connect to MongoDB
var mongodb = require("mongodb");
var mongoClient = mongodb.MongoClient;
var mongoUrl = "mongodb://localhost:27017/electric"; //electric is the database
var db; //Global so all of our routes have access to the db connection

mongoClient.connect(mongoUrl, function(error, database) {
	if(error) {
		console.log(error);
	}
	else {
		db = database; //Set the database object that was passed back to our callback
		console.log("Connected to Mongo successfully");
	}
	
});

/* GET home page. */

///General steps for app
//Get all pics(link) into MongoDB
//--done via terminal
///use electric - makes database
////db.images.insert({imgSrc:"photo.jpg"})
//Get all pics(link) from MongoDB
//--connect to Mongo
//Grab a random image - Math.random()
//Send that image to view
//Dsiplay image and vote options
//Get current user from Mongo
//Find what pics user has voted on
//Load pics into array
//Pick a random one
//Send the random one to EJS via a res.render("index", {picsArray})

// Using:
// Mongodb - DB work
// Mongo
// CRUD functionality
// Node.js
// MVC - Express Framework
// Javascript
// Templating engine = EJS/Jade
// CSS
// SASS - Compass (gem)
// HTML
// HTTP, ports, and routing
// Lots of Linux
// Nodemon

router.get('/', function(req, res, next) {
//2. Get pics from Mongo and store them in an array to pass to view
	db.collection("images").find().toArray(function(error, photos) {
		//3. Grab a random image from that array		
		// console.log(photos); //logs to terminal
		var randomNum = Math.floor(Math.random() * photos.length);
		var randomPhoto = photos[randomNum].imgSrc;
		//4. Send that image to the view
		res.render('index', { imageToRender: randomPhoto });
	});
});

router.post("/electric", function(req, res, next) {
	// res.json(req.body);
	//1. We know whether they voted electric or poser because it's in req.body
	//2. We know what image they voted on bc it's in req.body.image
	//3. We know who they are bc we have their IP address
	db.collection("votes").insertOne({
		ip: req.ip,
		vote: req.body.submit,
		image: req.body.image
	});
	res.redirect("/");
});


module.exports = router;
