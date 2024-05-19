const net = require('net');
const serverBot = require('./bot/server')

// Array to hold connected clients
let client = null;

// Create a server
const server = net.createServer();

// Event listener for new connections
server.on('connection', (socket) => {
    console.log('New client connected');

    // Add the new client to the clients array
    client = socket

    //ask client to start the meeting
    client.write('Start the meeting');

    let page = null

    // Event listener for data from clients
    socket.on('data', (data) => {
        console.log('Received:', data.toString());

        let meetingLink = null

        if (data.includes("Meeting has started")) {

            meetingLink = data.toString().replace("Meeting has started. Please join: ", "")
            data = "Meeting has started"
        }

        switch (data.toString()) {
            case "Meeting has started":

                (async () => {

                    page = await serverBot.givePermissions();
                    await serverBot.openPage(page, meetingLink);
                    await serverBot.joinMeet(page);

                    client.write('I have joined');

                })();
                break;
            case "Admitted you":


                client.write('End the meeting');

                break;
            case "Stopped the meeting":

                (async () => {

                    await serverBot.endMeeting(page);

                    console.log("End of session")

                })();


                break;
            default:
            // 
        }

    });

    // Event listener for client disconnection
    socket.on('end', () => {
        console.log('Client disconnected');

        // Remove the disconnected client from the clients array
        clients.splice(clients.indexOf(socket), 1);
    });

    // Handle errors
    socket.on('error', (err) => {
        console.error('Socket error:', err);
    });
});

// Start the server and listen on port 3000
server.listen(3000, () => {
    console.log('Server listening on port 3000');
});
