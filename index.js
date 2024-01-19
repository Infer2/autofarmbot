const {
	Client: Client
} = require("discord.js-selfbot-v13"), keypress = require("keypress"), fs = require("fs"), path = require("path"), replace = require("replace-in-file");
let canCheckVerification = !0;
const configPath = path.join(__dirname, "config.json");
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
	}),
	channelID = config.channelID;
let channel;
client.on("ready", (async () => {
	channel = client.channels.cache.get(channelID), async function e() {
		if (canCheckVerification) {
			const e = (await channel.messages.fetch({
				limit: 1
			})).last();
			if (!e) return void console.error("No messages found in the channel.");
			const i = e.embeds[0]?.title;
			i && i.includes("Antibot Verification") ? await n(e) : await c()
		}
		const i = function(e, n, c) {
			const i = [];
			for (let o = e; o <= n; o += c) i.push(o);
			const o = Math.floor(Math.random() * i.length);
			return i[o]
		}(2500, 2700, 100);
		setTimeout(e, i)
	}();
	const e = {
		files: "./node_modules/discord.js-selfbot-v13/src/util/Options.js",
		from: [/os: 'Windows',/, /browser: 'Discord Client',/, /os_version: '10.0.19045',/, /client_version: '1.0.9023',/],
		to: ["os: 'iOS',", "browser: 'Discord iOS',", "os_version: '17.2',", "client_version: '211.0',"]
	};
	try {
		await replace(e)
	} catch (e) {
		console.error("Error modifying Options.js:", e)
	}
	channel || (console.error(`Invalid channel ID: ${channelID}`), process.exit(1));
	const n = async e => {
		const n = e.embeds[0].description,
			c = n.indexOf("playing:") + 8,
			i = n.substr(c).match(/[A-Za-z0-9]{6}/)?.[0];
		i && (client.channels.cache.get(config.channelID).sendSlash ? await client.channels.cache.get(config.channelID).sendSlash("631216892606152714", "verify", i) : await client.channels.cache.get(config.channelID).send(`/verify ${i}`), canCheckVerification = !1, await new Promise((e => setTimeout(e, 1e3))), client.channels.cache.get(config.channelID).sendSlash ? await client.channels.cache.get(config.channelID).sendSlash("631216892606152714", "play") : await client.channels.cache.get(config.channelID).send("/play"), canCheckVerification = !0)
	};
	const c = async () => {
		try {
			const e = (await client.channels.cache.get(channelID).messages.fetch({
				limit: 1
			})).last();
			if (!e) return void console.error("No messages found in the channel.");
			const n = e.components;
			n && n.length > 0 && await e.clickButton()
		} catch (e) {
			console.error("Error in clickButton:", e)
		}
	};
	keypress(process.stdin), process.stdin.on("keypress", ((e, n) => {
		n && "p" === n.name && (console.log(canCheckVerification ? "Clicking paused." : "Clicking resumed."), canCheckVerification = !canCheckVerification, canCheckVerification && c())
	})), process.stdin.setRawMode(!0), process.stdin.resume()
})), client.login(config.token);
