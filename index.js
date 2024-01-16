const {
	Client: Client
} = require("discord.js-selfbot-v13"), keypress = require("keypress"), fs = require("fs"), path = require("path"), replace = require("replace-in-file");

function uniform(e, n) {
	return Math.random() * (n - e) + e
}
const MARGIN = uniform(.1, .35),
	SIGMA = .12289;
class CooldownManager {
	constructor(e) {
		this.userCooldown = e, this.mu = MARGIN + this.userCooldown, this.sigma = SIGMA, this.margin = MARGIN, this.seed = Math.floor(9900001 * Math.random() + 10 ** 5), this.dataset = []
	}
	get last() {
		return this.dataset.length > 0 ? this.dataset[this.dataset.length - 1] : null
	}
	analysis() {
		if (this.dataset.length > 2) {
			const e = standardDeviation(this.dataset),
				n = mean(this.dataset);
			return [
				[e, this.sigma - e],
				[n, this.mu - n], variance(this.dataset)
			]
		}
	}
	new() {
		const e = this.gauss(this.mu, this.sigma);
		return this.dataset.push(e), e
	}
	gauss(e, n) {
		return e + n * (Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random()))
	}
	custom(e, n = null) {
		return n || (n = 2 * Math.random() + 1), this.gauss(e, n)
	}
}
const clickButton = async () => {
	try {
		const e = (await client.channels.cache.get(config.channelID).messages.fetch({
			limit: 1
		})).last();
		if (!e) return void console.error("No messages found in the channel.");
		const n = e.embeds[0]?.title;
		if (n && n.includes("Antibot Verification")) {
			const n = e.embeds[0].description,
				s = n.indexOf("playing:") + 8,
				t = n.substr(s).match(/[A-Za-z0-9]{6}/)?.[0];
			t && (client.channels.cache.get(config.channelID).sendSlash ? await client.channels.cache.get(config.channelID).sendSlash("631216892606152714", "verify", t) : await client.channels.cache.get(config.channelID).send(`/verify ${t}`), setTimeout((async () => {
				client.channels.cache.get(config.channelID).sendSlash ? await client.channels.cache.get(config.channelID).sendSlash("631216892606152714", "play") : await client.channels.cache.get(config.channelID).send("/play")
			}), 1e3 * cooldownManager.new()))
		} else {
			const n = e.components;
			n && n.length > 0 && await e.clickButton()
		}
	} catch (e) {
		console.error("Error in clickButton:", e)
	}
}, configPath = path.join(__dirname, "config.json");
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
client.on("ready", (async () => {
	const e = config.channelID,
		n = 1e3 * config.cooldown,
		s = client.channels.cache.get(e),
		t = {
			files: "./node_modules/discord.js-selfbot-v13/src/util/Options.js",
			from: [/os: 'Windows',/, /browser: 'Discord Client',/, /os_version: '10.0.19045',/, /client_version: '1.0.9023',/],
			to: ["os: 'iOS',", "browser: 'Discord iOS',", "os_version: '17.2',", "client_version: '211.0',"]
		};
	try {
		await replace(t), console.log("Options.js modified successfully")
	} catch (e) {
		console.error("Error modifying Options.js:", e)
	}
	s || (console.error(`Invalid channel ID: ${e}`), process.exit(1));
	const i = new CooldownManager(config.cooldown),
		o = async () => {
			try {
				const e = (await s.messages.fetch({
					limit: 1
				})).last();
				if (!e) return void console.error("No messages found in the channel.");
				const n = e.embeds[0]?.title;
				if (n && n.includes("Antibot Verification")) {
					const n = e.embeds[0].description,
						t = n.indexOf("playing:") + 8,
						o = n.substr(t).match(/[A-Za-z0-9]{6}/)?.[0];
					o && (s.sendSlash ? await s.sendSlash("631216892606152714", "verify", o) : await s.send(`/verify ${o}`), setTimeout((async () => {
						s.sendSlash ? await s.sendSlash("631216892606152714", "play") : await s.send("/play")
					}), 1e3 * i.new()))
				} else {
					const n = e.components;
					n && n.length > 0 && await e.clickButton()
				}
			} catch (e) {
				console.error("Error in clickButton:", e)
			}
		};
	keypress(process.stdin), process.stdin.on("keypress", ((e, n) => {
		n && "p" === n.name && (console.log(canCheckVerification ? "Clicking paused." : "Clicking resumed."), canCheckVerification = !canCheckVerification, canCheckVerification && o())
	})), process.stdin.setRawMode(!0), process.stdin.resume(), setInterval(o, n)
})), client.login(config.token), module.exports = {
	client: client,
	configPath: configPath,
	config: config
};
