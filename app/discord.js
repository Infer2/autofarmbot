const { Client } = require('discord.js-selfbot-v13');
const keypress = require('keypress');
const fs = require('fs');
const path = require('path'); // Import the path module

const configPath = path.join(__dirname, 'config.json'); // Use path.join to create the correct file path

// Load config from config.json
let config = {};
try {
  const configFile = fs.readFileSync(configPath, 'utf-8');
  config = JSON.parse(configFile);
} catch (error) {
  console.error('Error reading config file:', error);
  process.exit(1); // Exit the process if config.json is missing or malformed
}

if (!config.token || !config.channelID || !config.cooldown) {
  console.error('Missing required values in config.json. Please provide token, channelID, and cooldown.');
  process.exit(1); // Exit the process if required values are missing
}

const client = new Client();

module.exports = {
  client,
  configPath,
  config,
};