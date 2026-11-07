const fs = require('fs');
const path = require('path');

let rawInput = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  rawInput += chunk;
});

process.stdin.on('end', () => {
  try {
    const payload = JSON.parse(rawInput || '{}');
    const conversationId = payload.conversationId;

    if (conversationId) {
      const cachePath = path.resolve(__dirname, '..', '.cache', `${conversationId}.json`);
      if (fs.existsSync(cachePath)) {
        fs.unlinkSync(cachePath);
      }
    }
  } catch {
    // Ignore cleanup error
  } finally {
    process.stdout.write('{}\n');
    process.exit(0);
  }
});

