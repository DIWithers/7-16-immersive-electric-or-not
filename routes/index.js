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
//5. Find all the photos the user has voted on and load an array up with them
	var userIP = req.ip;
	db.collection("votes").find({ip: userIP}).toArray(function(error, userResult) {
		var photosVoted = [];
		if (error) {
			console.log("There was an error fetching user votes");
		}
		else {
			
			// console.log(userResult);
			for (var i = 0; i < userResult.length; i++) {
				photosVoted.push(userResult[i].image);
				console.log(photosVoted);
			}
		}
	

		//2. Get pics from Mongo and store them in an array to pass to view
		//6. Limit the query to photos not voted on //nin = not in
		db.collection("images").find({imgSrc: {$nin: photosVoted} }).toArray(function(error, photos) {
			if (photos.length === 0) {
				// res.send("You have voted on all images");
				res.redirect("/standings");
			}
			else {
			//3. Grab a random image from that array		
			// console.log(photos); //logs to terminal
			var randomNum = Math.floor(Math.random() * photos.length);
			var randomPhoto = photos[randomNum].imgSrc;
			//4. Send that image to the view
			res.render('index', { imageToRender: randomPhoto });
			}
		});
	});
});

router.post("/electric", function(req, res, next) {
	// res.json(req.body);
	//1. We know whether they voted electric or poser because it's in req.body
	//2. We know what image they voted on bc it's in req.body.image
	//3. We know who they are bc we have their IP address
	if (req.body.submit === "Electric!") {
		var upDownVote = 1;
		// res.json("You clicked electric");
	}
	else if (req.body.submit === "Poser!") {
		// res.json("You clicked poser");
		var upDownVote = -1;
	}
	db.collection("votes").insertOne({
		ip: req.ip,
		vote: req.body.submit,
		image: req.body.image
	});
	//7. Update images collection so the image voted on will have # of votes
	db.collection("images").find({imgSrc: req.body.image}).toArray(function(error, result) {
		if (isNaN(result[0].totalVotes)) {
			total = 0;
		}
		else {
			total = result[0].totalVotes;
		}
		db.collection("images").updateOne(
			{imgSrc: req.body.image},
			{
				$set: {"totalVotes": (total + upDownVote)}
			}, function(error, results) {
				//Check to see if there is an error
				//Check to see if the document was updated
			}
		)
	})
	
	res.redirect("/");
});

router.get("/standings", function(req, res, next) {
	db.collection("images").find().toArray(function(error, allResults) {
		// var standingsArray = [];
		allResults.sort(function(a,b) { //quick or merge sort in Chrome?
			// console.log();
			return (b.totalVotes - a.totalVotes);
		});
		res.render("standings", {theStandings: allResults});
		
	});
});
router.get("/resetUserVotes", (req, res, next) => {
	db.collection("votes").deleteMany(
		{ip: req.ip},
		function(error, results) {

		}
	);
	res.redirect("/");
	
});

module.exports = router;
