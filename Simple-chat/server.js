// HTTP Portion
var http = require('http');
var fs = require('fs'); // Using the filesystem module
var httpServer = http.createServer(requestHandler);
var url = require('url');
httpServer.listen(8080);

function requestHandler(req, res) {

	var parsedUrl = url.parse(req.url);
	console.log("The Request is: " + parsedUrl.pathname);
		
	fs.readFile(__dirname + parsedUrl.pathname, 
		// Callback function for reading
		function (err, data) {
			// if there is an error
			if (err) {
				res.writeHead(500);
				return res.end('Error loading ' + parsedUrl.pathname);
			}
			// Otherwise, send the data, the contents of the file
			res.writeHead(200);
			res.end(data);
  		}
  	);
  	
  	/*
  	res.writeHead(200);
  	res.end("Life is wonderful");
  	*/
}

//var to keep track of what index of the array we're at
var complimentIndex = 0;

// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io').listen(httpServer);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection', 
	// We are given a websocket object in our function
	function (socket) {
	
		console.log("We have a new client: " + socket.id);
		
		// When this user emits, client side: socket.emit('otherevent',some data);
		socket.on('chatmessage', function(data) {
			// Data comes in as whatever was sent, including objects
			console.log("Received: 'chatmessage' " + data);


			/*make an array of different strings, each time you emit the chat message, 
			send a different element of the array*/
			var compliment = ["You're smart!", "Nice shoes!", "You are very creative!","You're Great!", "You're very kind!"];

			

			
			// Send it to all of the clients except the client it came from! //
			socket.emit('chatmessage', compliment[complimentIndex]);

			

			//if statement to check if you're at the end of your array, i fyou are, set complimentINdex = 0

			if(complimentIndex > 4){
				complimentIndex = 0;
			} else{
				complimentIndex++; //increment array index AFTER we emit
			}

		});
		
		//to send the event to everyone, including the client it came from, we use
		//io.sockets.emit('chatmessage', data);

		socket.on('disconnect', function() {
			console.log("Client has disconnected " + socket.id);
		});
	}
);