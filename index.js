const {
	Client: t,
	RichPresence: n
} = require("discord.js-selfbot-v13"), fs = require("fs"), config = JSON.parse(fs.readFileSync("config.json", "utf8")), client = new t, channelId = config.channelId;
let loopCount = 0,
	buyboostActive = !1;

function antibot(t) {
	if (t && t.embeds.length > 0) {
		let n = t.embeds[0],
			o = n.title;
		return o && o.includes("Antibot Verification")
	}
	return !1
}

function bot() {
	console.log("Bot is shutting down..."), process.exit(0)
}

function buyboost(t) {
	console.log("Calling buyboost function"), buyboostActive = !0;
	let n = [{
		y: 0,
		x: 0
	}, {
		y: 0,
		x: 1
	}, {
		y: 0,
		x: 2
	}, {
		y: 0,
		x: 1
	}, {
		y: 0,
		x: 3
	}, {
		y: 1,
		x: 0
	}, {
		y: 1,
		x: 1
	}, {
		y: 2,
		x: 0
	}, {
		y: 1,
		x: 0
	}];
	! function o(e) {
		if (e >= n.length) {
			buyboostActive = !1;
			return
		}
		try {
			t.clickButton({
				X: n[e].x,
				Y: n[e].y
			}), console.log(`Clicked button at X: ${n[e].x}, Y: ${n[e].y}`), setTimeout(() => o(e + 1), 1e3)
		} catch (i) {
			"BUTTON_CANNOT_CLICK" === i.message ? (console.log(`Skipping button at X: ${n[e].x}, Y: ${n[e].y} - cannot click.`), o(e + 1)) : (console.error(`Unexpected error at button ${e}:`, i), buyboostActive = !1)
		}
	}(0)
}

function click(t) {
	console.log("Calling click function"), t.clickButton({
		X: 0,
		Y: 0
	}), console.log("Clicked button at X: 0, Y: 0")
}
client.once("ready", async () => {
	console.log(`Logged in as ${client.user.tag}`);
	let t = new n(client).setPlatform("ios");
	client.user.setPresence({
		activities: t
	});
	let o = async () => {
		if (buyboostActive) {
			setTimeout(o, config.cooldown);
			return
		}
		let t = await client.channels.fetch(channelId),
			n = await t.messages.fetch({
				limit: 1
			}),
			e = n.first();
		antibot(e) ? bot() : config.buyboostEnabled && loopCount % 375 == 0 ? buyboost(e) : click(e), loopCount++, setTimeout(o, config.cooldown)
	};
	o()
}), client.login(config.token);
