const {
	MARGIN: MARGIN,
	SIGMA: SIGMA
} = require("./config");
class CooldownManager {
	constructor(t) {
		this.userCooldown = t, this.mu = MARGIN + this.userCooldown, this.sigma = SIGMA, this.margin = MARGIN, this.seed = Math.floor(9900001 * Math.random() + 10 ** 5), this.dataset = []
	}
	get last() {
		return this.dataset.length > 0 ? this.dataset[this.dataset.length - 1] : null
	}
	analysis() {
		if (this.dataset.length > 2) {
			const t = standardDeviation(this.dataset),
				s = mean(this.dataset);
			return [
				[t, this.sigma - t],
				[s, this.mu - s], variance(this.dataset)
			]
		}
	}
	new() {
		const t = this.gauss(this.mu, this.sigma);
		return this.dataset.push(t), t
	}
	gauss(t, s) {
		return t + s * (Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random()))
	}
	custom(t, s = null) {
		return s || (s = 2 * Math.random() + 1), this.gauss(t, s)
	}
}
module.exports = CooldownManager;
