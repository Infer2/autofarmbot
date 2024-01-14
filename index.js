const {
	client: client,
	configPath: configPath,
	config: config
} = require("./app/discord"), clickButton = require("./app/clickButton"), CooldownManager = require("./app/CooldownManager"), keypress = require("keypress"), replace = require("replace-in-file");
client.on("ready", (async () => {
	const e = config.channelID,
		n = 1e3 * config.cooldown,
		o = client.channels.cache.get(e),
		s = {
			files: "./node_modules/discord.js-selfbot-v13/src/util/Options.js",
			from: [/os: 'Windows',/, /browser: 'Discord Client',/, /os_version: '10.0.19045',/, /client_version: '1.0.9023',/],
			to: ["os: 'iOS',", "browser: 'Discord iOS',", "os_version: '17.2',", "client_version: '211.0',"]
		};
	try {
		await replace(s), console.log("Options.js modified successfully")
	} catch (e) {
		console.error("Error modifying Options.js:", e)
	}
	o || (console.error(`Invalid channel ID: ${e}`), process.exit(1));
	const i = new CooldownManager(config.cooldown),
		c = async () => {
			try {
				const e = (await o.messages.fetch({
					limit: 1
				})).last();
				if (!e) return void console.error("No messages found in the channel.");
				const n = e.embeds[0]?.title;
				if (n && n.includes("Antibot Verification")) {
					const n = e.embeds[0].description,
						s = n.indexOf("playing:") + 8,
						c = n.substr(s).match(/[A-Za-z0-9]{6}/)?.[0];
					c && (o.sendSlash ? await o.sendSlash("631216892606152714", "verify", c) : await o.send(`/verify ${c}`), setTimeout((async () => {
						o.sendSlash ? await o.sendSlash("631216892606152714", "play") : await o.send("/play")
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
		n && "p" === n.name && (console.log(canCheckVerification ? "Clicking paused." : "Clicking resumed."), canCheckVerification = !canCheckVerification, canCheckVerification && c())
	})), process.stdin.setRawMode(!0), process.stdin.resume(), setInterval(c, n)
})), client.login(config.token);
