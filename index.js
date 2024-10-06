const {
	Client: t
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
	! function o(i) {
		if (i >= n.length) {
			buyboostActive = !1;
			return
		}
		t.clickButton({
			X: n[i].x,
			Y: n[i].y
		}), console.log(`Clicked button at X: ${n[i].x}, Y: ${n[i].y}`), setTimeout(() => o(i + 1), 1e3)
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
	let t = async () => {
		if (buyboostActive) {
			setTimeout(t, 2500);
			return
		}
		let n = await client.channels.fetch(channelId),
			o = await n.messages.fetch({
				limit: 1
			}),
			i = o.first();
		antibot(i) ? bot() : config.buyboostEnabled && loopCount % 375 == 0 ? buyboost(i) : click(i), loopCount++, setTimeout(t, 2500)
	};
	t()
}), client.login(config.token);
