const {
	Client: Client
} = require("discord.js-selfbot-v13"), keypress = require("keypress"), fs = require("fs"), config = JSON.parse(fs.readFileSync("config.json", "utf-8")), client = new Client({
	checkUpdate: !1
}), targetChannelId = config.targetChannelId;
let totalButtonClicks = 0,
	shouldClickButton = !0,
	shouldClickButtonAbove = !1,
	pauseButtonClick = !1;

function clickButtonRandomly() {
	try {
		shouldClickButton && !pauseButtonClick && clickButtonInChannel();
		const t = config.cooldown,
			e = 1e3 * t + .221,
			o = 1e3 * t + .331,
			n = Math.floor(Math.random() * (o - e + 1)) + e;
		setTimeout(clickButtonRandomly, n)
	} catch (t) {
		console.error("Error:", t)
	}
}
async function clickButtonInChannel() {
	try {
		const t = await client.channels.fetch(targetChannelId);
		if (t.isText()) {
			const e = await t.messages.fetch({
					limit: 2
				}),
				o = e.last(),
				n = e.first();
			if (n.components.length > 0 && n.embeds.length > 0) {
				const e = n.embeds[0].title;
				if (e && e.includes("Antibot Verification")) {
					const e = n.embeds[0].description,
						o = e.indexOf("playing:") + 8,
						s = e.substr(o).match(/[A-Za-z0-9]{6}/)?.[0];
					s && (t.sendSlash ? await t.sendSlash("631216892606152714", "verify", s) : await t.send(`/verify ${s}`)), shouldClickButtonAbove = !0
				} else o.clickButton(), totalButtonClicks++, process.stdout.write("\r[K"), process.stdout.write(`Total button clicks: ${totalButtonClicks}`)
			}
			o.content.includes("You may now continue.") && shouldClickButtonAbove && (n.clickButton(), totalButtonClicks++, shouldClickButtonAbove = !1)
		}
	} catch (t) {
		console.error("Error:", t)
	}
}
client.on("ready", (async () => {
	clickButtonRandomly()
})), client.login(config.token), keypress(process.stdin), process.stdin.on("keypress", (function(t, e) {
	e && "p" === e.name && (pauseButtonClick = !pauseButtonClick, process.stdout.write("\n[K"), console.log(`Button clicks ${pauseButtonClick?"paused":"resumed"}.`))
})), process.stdin.setRawMode(!0), process.stdin.resume(), process.on("SIGINT", (() => {
	console.log(`Total button clicks before exiting: ${totalButtonClicks}`), process.exit()
}));
