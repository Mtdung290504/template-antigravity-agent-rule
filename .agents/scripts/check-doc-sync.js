const fs = require('fs');
const path = require('path');

function findMarkdownFiles(dir, rootDir, result = []) {
  if (result.length >= 100) return result;
  let entries = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return result;
  }

  for (const entry of entries) {
    if (result.length >= 100) break;
    const name = entry.name;
    if (name.startsWith('.') || name === 'node_modules' || name === 'dist' || name === 'vendor') {
      continue;
    }
    const fullPath = path.join(dir, name);
    if (entry.isDirectory()) {
      findMarkdownFiles(fullPath, rootDir, result);
    } else if (entry.isFile() && name.endsWith('.md')) {
      const rel = path.relative(rootDir, fullPath).replace(/\\/g, '/');
      result.push({ fullPath, rel });
    }
  }
  return result;
}

let rawInput = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  rawInput += chunk;
});

process.stdin.on('end', () => {
  try {
    const payload = JSON.parse(rawInput || '{}');
    const conversationId = payload.conversationId;

    if (!conversationId) {
      process.stdout.write(JSON.stringify({ injectSteps: [] }) + '\n');
      process.exit(0);
    }

    const cachePath = path.resolve(__dirname, '..', '.cache', `${conversationId}.json`);
    if (!fs.existsSync(cachePath)) {
      process.stdout.write(JSON.stringify({ injectSteps: [] }) + '\n');
      process.exit(0);
    }

    let cache = { touchedCodeFiles: [] };
    try {
      cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
    } catch {
      process.stdout.write(JSON.stringify({ injectSteps: [] }) + '\n');
      process.exit(0);
    }

    const touchedCodeFiles = Array.isArray(cache.touchedCodeFiles) ? cache.touchedCodeFiles : [];
    if (touchedCodeFiles.length === 0) {
      process.stdout.write(JSON.stringify({ injectSteps: [] }) + '\n');
      process.exit(0);
    }

    const workspaceRoot = payload.workspacePaths?.[0] || path.resolve(__dirname, '..', '..');
    const mdFiles = findMarkdownFiles(workspaceRoot, workspaceRoot);

    const notes = [];
    for (const codeRel of touchedCodeFiles) {
      const baseName = path.basename(codeRel);
      for (const md of mdFiles) {
        try {
          const content = fs.readFileSync(md.fullPath, 'utf8');
          if (content.includes(baseName) || content.includes(codeRel)) {
            notes.push(`Note: '${codeRel}' is referenced in '${md.rel}' (update if affected).`);
            break; // Max 1 doc note per touched code file to keep prompt lean
          }
        } catch {
          // ignore unreadable file
        }
      }
      if (notes.length >= 3) break; // Limit to 3 notes max
    }

    if (notes.length > 0) {
      const output = {
        injectSteps: [
          {
            systemMessage: {
              systemMessage: notes.join('\n')
            }
          }
        ]
      };
      process.stdout.write(JSON.stringify(output) + '\n');
    } else {
      process.stdout.write(JSON.stringify({ injectSteps: [] }) + '\n');
    }
  } catch {
    process.stdout.write(JSON.stringify({ injectSteps: [] }) + '\n');
  } finally {
    process.exit(0);
  }
});

