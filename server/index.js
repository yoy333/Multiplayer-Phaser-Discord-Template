import path from 'path'
import { fileURLToPath } from 'url';
import jsdom from 'jsdom'
import express from 'express'
const app = express();
import http from 'http'
const server = new http.Server(app);
const { JSDOM } = jsdom;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  console.log(1)
  res.sendFile(__dirname + '/index.html');
});

server.listen(8082, function () {
  console.log(`Listening on ${server.address().port}`);
});

function setupAuthoritativePhaser() {
  JSDOM.fromFile(path.join(__dirname, 'authoritative_server/index.html'), {
    // To run the scripts in the html file
    runScripts: "dangerously",
    // Also load supported external resources
    resources: "usable",
    // So requestAnimatinFrame events fire
    pretendToBeVisual: true
  }).then((dom) => {
    dom.window.gameLoaded = () => {
      const PORT = 8081;
      server.listen(PORT, function () {
          console.log(flag)
          console.log(`Listening on ${PORT}`);
      });
    };
  }).catch((error) => {
    console.log(error.message);
  });
}
//setupAuthoritativePhaser();