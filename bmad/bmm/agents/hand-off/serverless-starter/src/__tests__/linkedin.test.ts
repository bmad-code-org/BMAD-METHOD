import oauthStart from '../api/linkedin-oauth-start';
import callback from '../api/linkedin-callback';
import publish from '../api/publish-linkedin';
import fs from 'fs';
import path from 'path';

function mockRes() {
  const res: any = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
}

describe('linkedin dev-mode endpoints', () => {
  const tokensFile = path.resolve(__dirname, '../../.tokens.json');
  beforeAll(() => {
    process.env.DEV_MODE = '1';
    if (fs.existsSync(tokensFile)) fs.unlinkSync(tokensFile);
  });
  afterAll(() => {
    delete process.env.DEV_MODE;
    if (fs.existsSync(tokensFile)) fs.unlinkSync(tokensFile);
  });

  test('oauth-start returns a dev redirect url when no client id', async () => {
    delete process.env.LINKEDIN_CLIENT_ID;
    const req: any = { method: 'GET' };
    const res = mockRes();
    // @ts-ignore
    await oauthStart(req, res);
    expect(res.json).toHaveBeenCalled();
    const out = res.json.mock.calls[0][0];
    expect(out.url).toContain('/api/linkedin-callback');
  });

  test('callback in dev-mode saves a token', async () => {
    const req: any = { method: 'GET', query: { code: 'dev-code', userId: 'test-user' } };
    const res = mockRes();
    // @ts-ignore
    await callback(req, res);
    expect(res.json).toHaveBeenCalled();
    const out = res.json.mock.calls[0][0];
    expect(out.ok).toBeTruthy();
    // tokens file should exist
    expect(fs.existsSync(tokensFile)).toBe(true);
    const data = JSON.parse(fs.readFileSync(tokensFile, 'utf8'));
    expect(data['test-user']).toBeDefined();
    expect(data['test-user'].access_token).toBe('dev-access-token');
  });

  test('publish returns simulated publish when token is dev token', async () => {
    const req: any = { method: 'POST', body: { userId: 'test-user', text: 'Hello LinkedIn from test' } };
    const res = mockRes();
    // @ts-ignore
    await publish(req, res);
    expect(res.json).toHaveBeenCalled();
    const out = res.json.mock.calls[0][0];
    expect(out.published).toBeTruthy();
    expect(out.response).toBeDefined();
    expect(out.response.urn).toMatch(/urn:li:share:dev-/);
  });
});
