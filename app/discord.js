const {
	Client: Client
} = require("discord.js-selfbot-v13"), keypress = require("keypress"), fs = require("fs"), path = require("path"), configPath = path.join(__dirname, "config.json");
let config = {};
try {
	const e = fs.readFileSync(configPath, "utf-8");
	config = JSON.parse(e)
} catch (e) {
	console.error("Error reading config file:", e), process.exit(1)
}
config.token && config.channelID && config.cooldown || (console.error("Missing required values in config.json. Please provide token, channelID, and cooldown."), process.exit(1));
const client = new Client({
	checkUpdate: !1
});
module.exports = {
	client: client,
	configPath: configPath,
	config: config
};
