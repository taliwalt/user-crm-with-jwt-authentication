var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	morgan = require('morgan'),
	port = process.env.port || 3000,
	mongoose = require( 'mongoose' ),
	apiRouter = require( './server/routes/userRoutes')
	// User = require('./server/models/user'),
	// userController = require('./server/controllers/userController')

mongoose.connect('mongodb://localhost:27017/node-user-crm2')

//middleware
app.use( bodyParser.urlencoded({ extended: true } ))
app.use( bodyParser.json() )
app.use(morgan('dev'))

app.use( '/api', apiRouter )

	
app.listen( port );
console.log( 'listening on port ' + port )
