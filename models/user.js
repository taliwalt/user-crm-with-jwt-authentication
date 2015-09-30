var mongoose = require('mongoose')
var Schema = mongoose.Schema
var bcrypt = require('bcrypt-nodejs')

//make a user schema - a constructor function

var UserSchema = new Schema({
	name: String,
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true, select: false }
})

//middleware like convention to do something before saving the user to the database. in this case we want to hash the password
UserSchema.pre('save', function (next) {
	var user = this;
	if (!user.isModified('password')) return next()
	//bcrypt has a function called hash that takes 4 parameters. user.password,
	//the 2nd is the salt. if you want to specify your own sale you can but lets let bcrypt take care of it so we use null
	//3rd is if you want to have access to the salting process
	//4th callback
	bcrypt.hash(user.password, null, null, function (err, hash) {
		//if err stop function and show the err
		if (err) return next(err)
		//if no err set password to the hash and save
		user.password = hash
		next()
		
	})
	
})

//give the UserSchema a method to compare incoming passwords with stored/hashed verion
UserSchema.methods.comparePassword = function (password) {
	var user = this
	return bcrypt.compareSync(password, user.password)
}

module.exports = mongoose.model('User', UserSchema)


