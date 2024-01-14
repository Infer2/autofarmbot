const keypress = require("keypress"),
	CooldownManager = require("./CooldownManager"),
	fs = require("fs"),
	{
		client: client,
		configPath: configPath,
		config: config
	} = require("./discord");
config && void 0 !== config.cooldown || (console.error('Error: Invalid or missing "cooldown" property in the config.'), process.exit(1));
const cooldownManager = new CooldownManager(config.cooldown),
	clickButton = async () => {
		try {
			const e = (await client.channels.cache.get(config.channelID).messages.fetch({
				limit: 1
			})).last();
			if (!e) return void console.error("No messages found in the channel.");
			const n = e.embeds[0]?.title;
			if (n && n.includes("Antibot Verification")) {
				const n = e.embeds[0].description,
					c = n.indexOf("playing:") + 8,
					o = n.substr(c).match(/[A-Za-z0-9]{6}/)?.[0];
				o && (client.channels.cache.get(config.channelID).sendSlash ? await client.channels.cache.get(config.channelID).sendSlash("631216892606152714", "verify", o) : await client.channels.cache.get(config.channelID).send(`/verify ${o}`), setTimeout((async () => {
					client.channels.cache.get(config.channelID).sendSlash ? await client.channels.cache.get(config.channelID).sendSlash("631216892606152714", "play") : await client.channels.cache.get(config.channelID).send("/play")
				}), 1e3 * cooldownManager.new()))
			} else {
				const n = e.components;
				n && n.length > 0 && await e.clickButton()
			}
		} catch (e) {
			console.error("Error in clickButton:", e)
		}
	};
keypress(process.stdin), process.stdin.on("keypress", ((e, n) => {
	n && "p" === n.name && (console.log(canCheckVerification ? "Clicking paused." : "Clicking resumed."), canCheckVerification = !canCheckVerification, canCheckVerification && clickButton())
})), process.stdin.setRawMode(!0), process.stdin.resume(), module.exports = clickButton;
