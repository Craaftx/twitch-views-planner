import jsonfile from "jsonfile";
import open from "open";
import base64 from "base-64";
import cron from "node-cron";
import ChromeLauncher from "chrome-launcher";

const config = jsonfile.readFileSync("./config.json");
const browser = config.browser;
const streams = config.streams;
const refreshDelay = config.refreshDelay;

let openedStreams = [];

const infoLog = (message) => {
  console.log(`${new Date().toTimeString().split(" ")[0]} ${message}`);
};

const createIdFromUrl = (url) => {
  return base64.encode(encodeURI(url));
};

const openWindow = async (url) => {
  openedStreams.push(createIdFromUrl(url));
  const openedWindow = await open(url, { app: browser });
  if (openedWindow) {
    return Promise.resolve();
  }
  return Promise.reject();
};

const newSession = async () => {
  openedStreams = [];
  return ChromeLauncher.launch({
    userDataDir: false,
  });
};

const insideInterval = (start, end) => {
  if (!start || !end) {
    return true;
  }
  const date = new Date();
  const now = date.getHours();
  return start <= now && now <= end;
};

const openStreams = async () => {
  const notOpenStreams = streams
    .filter((stream) => !openedStreams.includes(createIdFromUrl(stream.url)))
    .filter((stream) => insideInterval(stream.start, stream.end));
  if (notOpenStreams.length === 0) {
    infoLog("All available streams are open");
    return;
  }
  let buffer = [];

  notOpenStreams.map((notOpenStream) => {
    return openWindow(notOpenStream.url);
  });

  const streamAreOpened = await Promise.all(buffer);
  if (!streamAreOpened) {
    throw new Error("Can't open new streams");
  }
  infoLog(`Open ${notOpenStreams.length} streams`);
};

(async () => {
  let chromeSession = await newSession();

  openStreams();

  cron.schedule("*/10 * * * *", () => {
    infoLog("Check if new streams are up..");
    openStreams();
  });

  cron.schedule(`0 */${refreshDelay} * * *`, async () => {
    infoLog("Refresh Streams");
    await chromeSession.kill();
    chromeSession = await newSession();
    openStreams();
  });
})();
