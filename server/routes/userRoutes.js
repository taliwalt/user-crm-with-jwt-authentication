//server.routes.userRoutes.js

var express = require('express')
var apiRouter = express.Router()
var usersController = require('../controllers/userController')
var User = require('../models/User')
var jwt = require('jsonwebtoken')
var mySpecialSecret = "davethewave"

apiRouter.post('/authenticate', function (req, res) {
    // 1 Find the user in our db by searching for the username in the body of the request 
	User.findOne({
		username: req.body.username
	}).select('name username password').exec(function (err, user) {
		// 1A Standad error crap	
		if (err) throw err;
		// 1B if we can't find a user with that username, return an error
		if (!user) {
			res.json({ success: false, message: "auth failed, idiot" })
			// 2 If we find the user
		} else if (user) {
			// 2A check that the password matches
			var validPassword = user.comparePassword(req.body.password);
			//2B if the password isn't a match
			if (!validPassword) {
                res.json({ success: false, message: "Auth failed, re-evaluate your life" })
				//2C if the password is a match	
            } else {
				// 3 Generate the JWT     
                var token = jwt.sign({
                    name: user.name,
                    username: user.username
				}, mySpecialSecret, {
                        expiresInMinutes: 1440
                    });
                // 4 Send back a success message with the JWT     
                res.json({
                    success: true,
                    message: 'You get a token! YOU get a token! YOU get a token!',
                    token: token
                })
			}
		}
	})
})

apiRouter.use(function(req, res, next){
	// this is going to run EVERY TIME someone goes to a url that starts with /api
	// so we should probably check to see if they are logged in here
	var token = req.body.token || req.param('token') || req.headers['x-access-token']
	if (token) {
		jwt.verify(token, mySpecialSecret, function(err, decoded){
			if (err) {
				res.status(403).send({success:false, message: "fobidden, token can't be decoded"})
			} else {
				req.decoded = decoded
				next()
			}
		})
	} else {
		res.status(403).send({success: false, message: "no token. You're not even trying"})
	}
	console.log("someone is visiting our API, we should check to see if they are logged in")

	// ...and then we'll let the request continue on to our app:
})


// set up index/get for api router
apiRouter.route('/users')
	.get(usersController.index)
	// for creating a new user
	.post(usersController.create)

apiRouter.route('/users/:user_id')
	// this is the show action 
	.get(usersController.show)

	// this is the update action
	.put(usersController.update)

	// this is the destroy function
	.delete(usersController.destroy)

module.exports = apiRouter