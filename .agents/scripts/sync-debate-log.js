const fs = require('fs');
const path = require('path');

const MARKER_RE = /^# 🛡️ BIÊN BẢN PHẢN BIỆN TRỰC TIẾP[^\r\n]*/m;
const REQUIRED_FIELD = '- **Đánh giá Dự thảo của Lead:**';
const DEBATE_LOG_PATH = path.resolve(__dirname, '..', 'DEBATE_LOG.md');

function unquoteProtoString(val) {
  if (typeof val !== 'string') return '';
  let s = val.trim();
  if (s.startsWith('"') && s.endsWith('"')) {
    try {
      s = JSON.parse(s);
    } catch {
      // keep original if not valid JSON string
    }
  }
  return s;
}

function extractValidDebateLog(text) {
  if (typeof text !== 'string') return '';
  const match = MARKER_RE.exec(text);
  if (!match) return '';
  let extracted = text.slice(match.index);
  const endTagIdx = extracted.lastIndexOf('</SYSTEM_MESSAGE>');
  if (endTagIdx !== -1) {
    extracted = extracted.slice(0, endTagIdx);
  }
  extracted = extracted.trim();
  if (!extracted.includes(REQUIRED_FIELD)) return '';
  return extracted;
}

function extractFromTranscript(transcriptPath) {
  if (!transcriptPath || !fs.existsSync(transcriptPath)) return '';
  const content = fs.readFileSync(transcriptPath, 'utf8').trim();
  if (!content) return '';
  const lines = content.split('\n');
  for (let i = lines.length - 1; i >= Math.max(0, lines.length - 5); i--) {
    try {
      const step = JSON.parse(lines[i]);
      if (step.type === 'SYSTEM_MESSAGE' && typeof step.content === 'string') {
        const candidate = extractValidDebateLog(step.content);
        if (candidate) return candidate;
      }
    } catch {
      // ignore malformed line
    }
  }
  return '';
}

let rawInput = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  rawInput += chunk;
});

process.stdin.on('end', () => {
  try {
    const payload = JSON.parse(rawInput || '{}');
    let candidate = '';

    // 1. Check PostToolUse send_message payload
    const args = payload?.toolCall?.args;
    if (args) {
      const msg = unquoteProtoString(args.Message ?? args.message ?? '');
      candidate = extractValidDebateLog(msg);
    }

    // 2. Fallback: Check PreInvocation transcript SYSTEM_MESSAGE
    if (!candidate && payload?.transcriptPath) {
      candidate = extractFromTranscript(unquoteProtoString(payload.transcriptPath));
    }

    if (candidate) {
      fs.writeFileSync(DEBATE_LOG_PATH, candidate + '\n', 'utf8');
    }
  } catch {
    // Never block the agent loop on hook error
  } finally {
    process.stdout.write('{}\n');
    process.exit(0);
  }
});
