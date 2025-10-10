import fs from 'fs';
import path from 'path';
import { KMSClient, EncryptCommand, DecryptCommand } from '@aws-sdk/client-kms';

const TOK_FILE = path.resolve(__dirname, '../../.tokens.json');

function fileSave(data: any) {
  fs.writeFileSync(TOK_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function fileLoad() {
  try { if (!fs.existsSync(TOK_FILE)) return {}; return JSON.parse(fs.readFileSync(TOK_FILE, 'utf8') || '{}'); } catch (e) { return {}; }
}

const kmsKey = process.env.KMS_KEY_ID;
const kmsClient = kmsKey ? new KMSClient({}) : null;

export async function saveToken(userId: string, tokenObj: any) {
  if (kmsClient && kmsKey) {
    const cmd = new EncryptCommand({ KeyId: kmsKey, Plaintext: Buffer.from(JSON.stringify(tokenObj)) });
    const resp = await kmsClient.send(cmd);
    const cipher = resp.CiphertextBlob ? Buffer.from(resp.CiphertextBlob).toString('base64') : '';
    const data = fileLoad();
    data[userId] = { kms: true, cipher };
    fileSave(data);
    return;
  }
  const data = fileLoad();
  // For non-KMS mode, store the raw token object (backward compatible with previous store)
  data[userId] = tokenObj;
  fileSave(data);
}

export async function getToken(userId: string) {
  const data = fileLoad();
  const entry = data[userId];
  if (!entry) return null;
  if (entry.kms && entry.cipher && kmsClient) {
    const cmd = new DecryptCommand({ CiphertextBlob: Buffer.from(entry.cipher, 'base64') });
    const resp = await kmsClient.send(cmd);
    const plain = resp.Plaintext ? Buffer.from(resp.Plaintext).toString('utf8') : null;
    return plain ? JSON.parse(plain) : null;
  }
  // entry may be the raw token object (backward compatible) or an object with .token
  if (entry && entry.token) return entry.token;
  return entry;
}

export function clearTokens() { try { if (fs.existsSync(TOK_FILE)) fs.unlinkSync(TOK_FILE); } catch(e){} }

// Placeholder: in production we'd check expiry and refresh using refresh_token
export async function getValidToken(userId: string) {
  const tok = await getToken(userId);
  if (!tok) return null;
  // naive expiry check
  if (tok.expires_in && tok.obtained_at) {
    const age = Date.now() - tok.obtained_at;
    if (age > (tok.expires_in - 60) * 1000) {
      // TODO: refresh token
      return tok; // return expired for now; implement refresh flow next
    }
  }
  return tok;
}

export default { saveToken, getToken, clearTokens, getValidToken };
