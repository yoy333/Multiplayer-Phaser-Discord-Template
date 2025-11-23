import path from 'path'
import { fileURLToPath } from 'url';
import jsdom from 'jsdom'
import express from 'express'
const app = express();
import http from 'http'
const server = new http.Server(app);
const { JSDOM } = jsdom;

const PORT = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname + '/public/dist/'));

app.get('/', function (req, res) {
  console.log(__dirname)
  res.sendFile(__dirname + '/public/dist/index.html');
});

function setupAuthoritativePhaser() {
  const { VirtualConsole } = jsdom;
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('log', (...args) => console.log('[jsdom log]', ...args));
  virtualConsole.on('info', (...args) => console.info('[jsdom info]', ...args));
  virtualConsole.on('warn', (...args) => console.warn('[jsdom warn]', ...args));
  virtualConsole.on('error', (...args) => console.error('[jsdom error]', ...args));

  JSDOM.fromFile(path.join(__dirname, 'authoritative_server/index.html'), {
    // To run the scripts in the html file
    runScripts: "dangerously",
    // Also load supported external resources
    resources: "usable",
    // So requestAnimatinFrame events fire
    pretendToBeVisual: true,
    virtualConsole
  }).then((dom) => {
    dom.window.gameLoaded = () => {
      server.listen(PORT, function () {
        console.log(`Listening on ${PORT}`);
      });
    };
  }).catch((error) => {
    console.log(error.message);
  });
}
setupAuthoritativePhaser();