import path from 'path'
import { fileURLToPath } from 'url';
import jsdom from 'jsdom'
import express from 'express'
const app = express();
import http from 'http'
const server = new http.Server(app);
const { JSDOM } = jsdom;

console.log(0)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__filename)
console.log(__dirname);
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  console.log(1)
  res.sendFile(__dirname + '/public/index.html');
});

console.log(__dirname + '/public/index.html')

function setupAuthoritativePhaser() {
  JSDOM.fromFile(path.join(__dirname, 'authoritative_server/index.html'), {
    // To run the scripts in the html file
    runScripts: "dangerously",
    // Also load supported external resources
    resources: "usable",
    // So requestAnimatinFrame events fire
    pretendToBeVisual: true
  }).then((dom) => {
    console.log(2)
    dom.window.gameLoaded = () => {
      console.log(3)
      const PORT = 8082;
      server.listen(PORT, function () {
          console.log(`Listening on ${PORT}`);
      });
    };
  }).catch((error) => {
    console.log(error.message);
  });
}
setupAuthoritativePhaser();