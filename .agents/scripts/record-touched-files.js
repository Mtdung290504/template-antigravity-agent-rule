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
    const targetPath = payload?.toolCall?.args?.Path || payload?.toolCall?.args?.path;

    if (!conversationId || !targetPath) {
      process.stdout.write('{}\n');
      process.exit(0);
    }

    const workspaceRoot = payload.workspacePaths?.[0] || path.resolve(__dirname, '..', '..');
    const normTarget = path.normalize(targetPath);
    const relPath = path.isAbsolute(normTarget)
      ? path.relative(workspaceRoot, normTarget)
      : normTarget;

    // Ignore changes within internal agent directories
    const normalizedRel = relPath.replace(/\\/g, '/');
    if (normalizedRel.startsWith('.agents/') || normalizedRel.startsWith('.git/')) {
      process.stdout.write('{}\n');
      process.exit(0);
    }

    const cacheDir = path.resolve(__dirname, '..', '.cache');
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    const cachePath = path.join(cacheDir, `${conversationId}.json`);
    let cache = { touchedCodeFiles: [] };
    if (fs.existsSync(cachePath)) {
      try {
        cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
        if (!Array.isArray(cache.touchedCodeFiles)) cache.touchedCodeFiles = [];
      } catch {
        cache = { touchedCodeFiles: [] };
      }
    }

    if (normalizedRel.endsWith('.md')) {
      // A doc file was modified. Read its content and unmark any referenced code files.
      const fullDocPath = path.isAbsolute(normTarget) ? normTarget : path.join(workspaceRoot, normTarget);
      if (fs.existsSync(fullDocPath)) {
        const docContent = fs.readFileSync(fullDocPath, 'utf8');
        cache.touchedCodeFiles = cache.touchedCodeFiles.filter((codeRel) => {
          const baseName = path.basename(codeRel);
          const isReferenced = docContent.includes(baseName) || docContent.includes(codeRel.replace(/\\/g, '/'));
          return !isReferenced;
        });
      }
    } else {
      // A code/resource file was modified. Add to touchedCodeFiles if not already present.
      if (!cache.touchedCodeFiles.includes(normalizedRel)) {
        cache.touchedCodeFiles.push(normalizedRel);
      }
    }

    fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2), 'utf8');
  } catch {
    // Never block agent execution on hook error
  } finally {
    process.stdout.write('{}\n');
    process.exit(0);
  }
});

