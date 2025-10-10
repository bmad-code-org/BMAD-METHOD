import fs from 'fs';
import path from 'path';

const TOK_FILE = path.resolve(__dirname, '../../.tokens.json');

// Prefer secureLinkedinStore if available (KMS-backed). Fall back to file store.
let secure: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  secure = require('./secureLinkedinStore').default || require('./secureLinkedinStore');
} catch (e) {
  secure = null;
}

export async function saveToken(userId: string, tokenObj: any) {
  if (secure && secure.saveToken) return secure.saveToken(userId, tokenObj);
  let data: any = {};
  try { if (fs.existsSync(TOK_FILE)) data = JSON.parse(fs.readFileSync(TOK_FILE, 'utf8') || '{}'); } catch (e) { data = {}; }
  data[userId] = tokenObj;
  fs.writeFileSync(TOK_FILE, JSON.stringify(data, null, 2), 'utf8');
}

export async function getToken(userId: string) {
  if (secure && secure.getToken) return secure.getToken(userId);
  try { if (!fs.existsSync(TOK_FILE)) return null; const data = JSON.parse(fs.readFileSync(TOK_FILE, 'utf8') || '{}'); return data[userId] || null; } catch (e) { return null; }
}

export async function clearTokens() { if (secure && secure.clearTokens) return secure.clearTokens(); try { if (fs.existsSync(TOK_FILE)) fs.unlinkSync(TOK_FILE); } catch(e){} }

export default { saveToken, getToken, clearTokens };
