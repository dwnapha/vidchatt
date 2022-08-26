const app = require("express")();
const http = require("http");
const server = http.createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, { // io is the main constant that gives us access to socket io features
	cors: { // cross origin resource sharing 
		origin: "http://localhost:3000", // the origin allowed
		methods: [ "GET", "POST" ] // allowed methods
	}
});

app.use(cors()); // applying cors
 
const PORT = process.env.PORT || 1000;

app.get('/', (req, res) => {
	res.send('Running');
});

io.on("connection", (socket) => { // io.on is used to listen to event named connention
	socket.emit("me", socket.id); // event named me is emitted which carries the socket id.
    console.log(socket.id);
	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded");
	});

	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	});

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	});
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
