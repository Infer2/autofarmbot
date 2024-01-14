
const { MARGIN, SIGMA } = require('./config');

class CooldownManager {
  constructor(userCooldown) {
    this.userCooldown = userCooldown;
    this.mu = MARGIN + this.userCooldown;
    this.sigma = SIGMA;
    this.margin = MARGIN;
    this.seed = Math.floor(Math.random() * (10 ** 7 - 10 ** 5 + 1) + 10 ** 5);
    this.dataset = [];
  }

  get last() {
    return this.dataset.length > 0 ? this.dataset[this.dataset.length - 1] : null;
  }

  analysis() {
    if (this.dataset.length > 2) {
      const sampleStdev = standardDeviation(this.dataset);
      const sampleMean = mean(this.dataset);
      return [
        [sampleStdev, this.sigma - sampleStdev],
        [sampleMean, this.mu - sampleMean],
        variance(this.dataset)
      ];
    }
  }

  new() {
    const value = this.gauss(this.mu, this.sigma);
    this.dataset.push(value);
    return value;
  }

  gauss(mu, sigma) {
    const rand = Math.sqrt(-2.0 * Math.log(Math.random())) * Math.cos(2.0 * Math.PI * Math.random());
    return mu + sigma * rand;
  }

  custom(mu, sigma = null) {
    if (!sigma) {
      sigma = Math.random() * (3 - 1) + 1;
    }
    return this.gauss(mu, sigma);
  }
}

module.exports = CooldownManager;
