const net = require("net");
const fs = require("fs");

// read the server-config.json
const SERVERCONFIG = JSON.parse(fs.readFileSync("../server.json", "utf-8"));
const HOST = SERVERCONFIG["host"];
const PORT = SERVERCONFIG["port"];
const GREET = SERVERCONFIG["greet"];
const END = SERVERCONFIG["close"];
let globData;

const client = new net.Socket();

// connection function
function sendData(data) {
  globData = JSON.stringify(data);
  client.connect(PORT, HOST, () => {
    console.log("Data: ");
    console.log(globData);
  });
}

// listen to server contact
client.on("data", (data) => {
  data = data.toString();
  console.log("Server Said: " + data);

  // when the contact is greeting
  if (data === GREET) {
    // write the length of the string
    client.write(globData.length.toString());
    setTimeout(() => {
      // end the connection with sending the actual data
      client.end(globData);
      console.log("Client said: Data sent!");
    }, 50);
    // ^ necessary timeout so it doesn't get send in one buffer to the server
  } else if (data === END) {
    console.log("Ending...");
    client.destroy();
    console.log("Destroyed:", client.destroyed);
  }
});

exports.sendData = sendData;
