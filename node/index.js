
require('dotenv').config();

const express = require('express');
const ParseDashboard = require('parse-dashboard');
const ParseServer = require('parse-server').ParseServer;


// Get environment variables we need and provide fallbacks if some are not defined
let databaseUri = process.env.MONGODB_URI;
let serverUrl = process.env.SERVER_URL;
let port = process.env.PORT || 5000;

if (!databaseUri) {
	databaseUri = 'mongodb://localhost:27017/quickstart';
  	console.log('MONGODB_URI not specified, will use localhost: ' + databaseUri);
}

if(!serverUrl) {
	serverUrl = 'http://localhost:'+port+'/parse';
}

// Initialize a ParseServer using the configuration options defined in our environment variables.
// More details: https://github.com/parse-community/parse-server
let api = new ParseServer({
	"databaseURI" :     databaseUri,
	"cloud" :           __dirname + '/cloud/cloud.js',
	"appId" :           process.env.APP_ID,
	"masterKey" :       process.env.MASTER_KEY,
	"serverURL" :       serverUrl,
  	"publicServerURL" : serverUrl,
  	"appName" :         process.env.APP_NAME,
  	"liveQuery" : {
    	"classNames" : [] 
  	}
});

// Initialize the Parse Dashboard
// More details: https://github.com/parse-community/parse-dashboard
let dashboard = new ParseDashboard({
	"apps": [{
		"serverURL" :    serverUrl,
		"appId" :        process.env.APP_ID,
		"masterKey" :    process.env.MASTER_KEY,
		"appName" :      process.env.APP_NAME
	}],
	"users" : [
        // Define your login info
        // !! In production change this to something secure. Better yet, you also don't need to host the ParseDashboard from the same server instance.
        // Refer to the parse-dashboard github page for more details
		{
			"user" : "admin",
			"pass" : "parse0202!"    
		}
	]
},{ allowInsecureHTTP: true });

// Routing Configuration
// Create Express server instance
let app = express();

// Serve the Parse API on the /parse URL prefix
let mountPath = '/parse';
app.use(mountPath, api);

// Make Parse Dashboard available at /dashboard
app.use('/dashboard', dashboard);

// Serve our webapp specifically from the '/' path
app.get('/webapp', (req, res) => {
	res.sendFile('public/webapp/index.html', {root : __dirname});
});

// Serve the webapp from any routes that the webapp's react-router uses
app.get('/webapp/:path', (req, res) => {
	res.sendFile('public/webapp/index.html', {root : __dirname});
});

// Serve static assets from the /public folder
app.use(express.static(__dirname + '/public'));

// Create and start the http server
let httpServer = require('http').createServer(app);
httpServer.listen(port, () => {
	console.log('Parse Server Running on Port ' + port + '.');
	console.log("Server URL: " + serverUrl);
});

// Add the ParseServer to our http server
ParseServer.createLiveQueryServer(httpServer);