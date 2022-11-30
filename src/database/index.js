const mongoose = require("mongoose");

const connectionString =
  "mongodb+srv://comp531:Zachary0312@cluster0.agu3tfk.mongodb.net/hw6?retryWrites=true&w=majority";


mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


mongoose.connection.on('connected', function() {
	console.log('Mongoose connected to ' + connectionString)
})
mongoose.connection.on('error', function(err) {
	console.error('Mongoose connection error: ' + err)
})
mongoose.connection.on('disconnected', function() {
	console.log('Mongoose disconnected')
})

process.once('SIGUSR2', function() {
	shutdown('nodemon restart', function() {
		process.kill(process.pid, 'SIGUSR2')
	})
})
process.on('SIGINT', function() {
	shutdown('app termination', function() {
		process.exit(0)
	})
})
process.on('SIGTERM', function() {
	shutdown('Heroku app shutdown', function() {
		process.exit(0)
	})
})
function shutdown(msg, callback) {
	mongoose.connection.close(function() {
		console.log('Mongoose disconnected through ' + msg)
		callback()
	})
}