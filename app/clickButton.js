const keypress = require('keypress');
const CooldownManager = require('./CooldownManager'); // Relative path to CooldownManager
const fs = require('fs');
const { client, configPath, config } = require('./discord');

// Ensure that config is correctly initialized and contains the 'cooldown' property
if (!config || typeof config.cooldown === 'undefined') {
  console.error('Error: Invalid or missing "cooldown" property in the config.');
  process.exit(1);
}

const cooldownManager = new CooldownManager(config.cooldown); // Create an instance of CooldownManager

const clickButton = async () => {
  try {
    const messages = await client.channels.cache.get(config.channelID).messages.fetch({ limit: 1 });
    const message = messages.last();

    if (!message) {
      console.error('No messages found in the channel.');
      return;
    }

    const embedTitle = message.embeds[0]?.title;

    if (embedTitle && embedTitle.includes('Antibot Verification')) {
      const embedDescription = message.embeds[0].description;
      const playingTextIndex = embedDescription.indexOf('playing:') + 'playing:'.length;
      const sixLetters = embedDescription.substr(playingTextIndex).match(/[A-Za-z0-9]{6}/)?.[0];

      if (sixLetters) {
        if (client.channels.cache.get(config.channelID).sendSlash) {
          await client.channels.cache.get(config.channelID).sendSlash('631216892606152714', 'verify', sixLetters);
        } else {
          await client.channels.cache.get(config.channelID).send(`/${'verify'} ${sixLetters}`);
        }

        setTimeout(async () => {
          if (client.channels.cache.get(config.channelID).sendSlash) {
            await client.channels.cache.get(config.channelID).sendSlash('631216892606152714', 'play');
          } else {
            await client.channels.cache.get(config.channelID).send('/play');
          }
        }, cooldownManager.new() * 1000);
      }
    } else {
      const buttons = message.components;
      if (buttons && buttons.length > 0) {
        await message.clickButton();
      }
    }
} catch (error) {
    console.error('Error in clickButton:', error);
  }
};

// Set up keypress for pausing and resuming
keypress(process.stdin);
process.stdin.on('keypress', (ch, key) => {
  if (key && key.name === 'p') {
    // Toggle pause/resume
    console.log(canCheckVerification ? 'Clicking paused.' : 'Clicking resumed.');
    canCheckVerification = !canCheckVerification;
    if (canCheckVerification) clickButton();
  }
});

process.stdin.setRawMode(true);
process.stdin.resume();

module.exports = clickButton;