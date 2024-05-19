const net = require('net');
const clientBot = require('./bot/client')

// Create a new server socket
const server = new net.Socket();

// Connect the client socket to the server
server.connect(3000, 'localhost', () => {
    console.log('Connected to server');

    let page = null

    // Event listener for data from the server
    server.on('data', (data) => {
        console.log('Server:', data.toString());

        switch (data.toString()) {
            case "Start the meeting":

                (async () => {

                    page = await clientBot.givePermissions();
                    await clientBot.openPage(page);
                    await clientBot.googleLogin(page)
                    await clientBot.startMeeting(page)
                    await clientBot.muteMicrophone(page)
                    await clientBot.unmuteMicrophone(page)
                    await clientBot.changeLayout(page)

                    //tell server meeting has started
                    let meetinglink = await clientBot.getMeetingLink(page)
                    server.write("Meeting has started. Please join: " + meetinglink.toString());

                })();

                break;
            case "I have joined":
                (async () => {
                    await clientBot.allowParticipant(page)

                    await new Promise(function (resolve) { setTimeout(resolve, 10000) });

                    await clientBot.sendMessage(page)

                    await new Promise(function (resolve) { setTimeout(resolve, 15000) });

                    server.write("Admitted you");

                })();
                break;
            case "End the meeting":
                (async () => {
                    await clientBot.endMeeting(page)

                    await new Promise(function (resolve) { setTimeout(resolve, 10000) });

                    server.write("Stopped the meeting");

                })();
                break;
            default:
            // 
        }
    });

    // Event listener for when the connection is closed
    server.on('close', () => {
        console.log('Connection closed');
    });

    // Event listener for errors
    server.on('error', (err) => {
        console.error('Socket error:', err);
    });

});
