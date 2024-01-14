const {
	client: client,
	configPath: configPath,
	config: config
} = require("./app/discord"), clickButton = require("./app/clickButton"), CooldownManager = require("./app/CooldownManager"), keypress = require("keypress");
client.on("ready", (async () => {
	const e = config.channelID,
		n = 1e3 * config.cooldown,
		c = client.channels.cache.get(e);
	c || (console.error(`Invalid channel ID: ${e}`), process.exit(1));
	const i = new CooldownManager(config.cooldown),
		o = async () => {
			try {
				const e = (await c.messages.fetch({
					limit: 1
				})).last();
				if (!e) return void console.error("No messages found in the channel.");
				const n = e.embeds[0]?.title;
				if (n && n.includes("Antibot Verification")) {
					const n = e.embeds[0].description,
						o = n.indexOf("playing:") + 8,
						s = n.substr(o).match(/[A-Za-z0-9]{6}/)?.[0];
					s && (c.sendSlash ? await c.sendSlash("631216892606152714", "verify", s) : await c.send(`/verify ${s}`), setTimeout((async () => {
						c.sendSlash ? await c.sendSlash("631216892606152714", "play") : await c.send("/play")
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
})), client.login(config.token);
