require('dotenv').config();

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const session = require('express-session')
const path = require('path')

const html = __dirname + '/public';

mongoose.connect(process.env.MONGODB_URI,
	{}, (err) => (err) ? console.log(err) : console.log('Connected to database...'))



// create a new express server
const app = express()

// Parse incoming request as JSON.
app.use(bodyParser.urlencoded({ extended: false, keepExtensions: true }))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(cors({ credentials: true, origin: process.env.CLIENT_HOST }));

app.use(session({
	secret: process.env.SECRET_KEY,
	cookie: { maxAge: 60 * 60 * 1000 },
	saveUninitialized: true,
	resave: true
}))

app.use(express.static('uploads'))
app.use(express.static(html, { redirect: false }))

// API Router
let api = require('./router')(express)
app.use('/api', api)

// app.use(function (req, res) {
// 	res.sendFile(html + 'index.html');
// })

app.use(express.static(path.join(__dirname, 'public')));
app.get('*', function(req, res) {
 res.sendFile(path.join(__dirname, 'public/index.html'));
});


app.listen(process.env.PORT, '0.0.0.0', () => {
	// print a message when the server starts listening
	console.log("server starting on " + process.env.PORT)
})

