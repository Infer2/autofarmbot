const { Client } = require('discord.js-selfbot-v13');
const keypress = require('keypress');
const fs = require('fs');

// Load configuration from config.json
const config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));

const client = new Client({
  checkUpdate: false,
});

const targetChannelId = config.targetChannelId;
let totalButtonClicks = 0;
let shouldClickButton = true;
let pauseButtonClick = false;

client.on('ready', async () => {
  // Set an initial interval
  clickButtonRandomly();
});

client.login(config.token);

function clickButtonRandomly() {
  try {
    // Call the function to click the button if shouldClickButton is true
    if (shouldClickButton && !pauseButtonClick) {
      clickButtonInChannel();
    }

    const cooldown = config.cooldown;

    // Calculate the modified minimum and maximum range
    const minRange = cooldown * 1000 + 0.186;
    const maxRange = cooldown * 1000 + 0.329;

    // Generate a random delay within the modified range (in milliseconds)
    const randomDelay = Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;

    // Set the next timeout with the random delay
    setTimeout(clickButtonRandomly, randomDelay);
  } catch (error) {
    console.error('Error:', error);
  }
}


async function clickButtonInChannel() {
  try {
    // Get the target channel
    const targetChannel = await client.channels.fetch(targetChannelId);

    if (targetChannel.isText()) {
      // Fetch the last message in the channel
      const messages = await targetChannel.messages.fetch({ limit: 1 });
      const lastMessage = messages.first();

      if (lastMessage.components.length > 0 && lastMessage.embeds.length > 0) {
        const embedTitle = lastMessage.embeds[0].title;

        if (embedTitle && embedTitle.includes('Antibot Verification')) {
          // Set shouldClickButton to false to stop further clicks
          shouldClickButton = false;

          // Extract 6 letters from the embed description after "playing:"
          const embedDescription = lastMessage.embeds[0].description;
          const playingTextIndex = embedDescription.indexOf('playing:') + 'playing:'.length;
          const sixLetters = embedDescription.substr(playingTextIndex).match(/[A-Za-z0-9]{6}/)?.[0];

          // Send the slash command or fallback to regular send
          if (sixLetters) {
            if (targetChannel.sendSlash) {
              await targetChannel.sendSlash('631216892606152714', 'verify', sixLetters);
            } else {
              await targetChannel.send(`/${'verify'} ${sixLetters}`);
            }
          }
        }

        // Check if the embed title contains "You farmed:"
        if (embedTitle && embedTitle.includes('You farmed:')) {
          // Increment the button click count
          totalButtonClicks++;

          process.stdout.write('\r\x1b[K');
          // Display total button clicks in the console UI
          process.stdout.write(`Total button clicks: ${totalButtonClicks}`);
    }

      }

      // Check if the message content contains "You may now continue."
      if (lastMessage.content.includes('You may now continue.')) {
        shouldClickButton = true;
      }

      if (shouldClickButton && !pauseButtonClick) {
        lastMessage.clickButton();
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Set up keypress to listen for the 'p' key
keypress(process.stdin);

process.stdin.on('keypress', function (ch, key) {
  if (key && key.name === 'p') {
    pauseButtonClick = !pauseButtonClick; // Toggle pauseButtonClick variable
    // Move the cursor to the beginning of the next line and clear it
    process.stdout.write('\n\x1b[K');
    console.log(`Button clicks ${pauseButtonClick ? 'paused' : 'resumed'}.`);
  }
});

// Enable listening for keypress events
process.stdin.setRawMode(true);
process.stdin.resume();

process.on('SIGINT', () => {
  console.log(`Total button clicks before exiting: ${totalButtonClicks}`);
  process.exit();
});
