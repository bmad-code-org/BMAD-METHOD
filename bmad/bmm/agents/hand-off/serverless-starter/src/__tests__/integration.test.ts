import signedUpload from '../api/signed-upload';
import notifyUpload from '../api/notify-upload';
import transcribeCallback from '../api/transcribe-callback';
import generatePost from '../api/generate-post';
import fs from 'fs';
import path from 'path';

function mockRes() {
  const res: any = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
}

describe('dev-mode full flow', () => {
  const jobsFile = path.resolve(__dirname, '../../.jobs.json');
  beforeAll(() => {
    process.env.DEV_MODE = '1';
    if (fs.existsSync(jobsFile)) fs.unlinkSync(jobsFile);
  });

  afterAll(() => {
    delete process.env.DEV_MODE;
    if (fs.existsSync(jobsFile)) fs.unlinkSync(jobsFile);
  });

  test('signed-upload -> notify -> transcribe callback -> generate-post', async () => {
    // 1) signed-upload
    const req1: any = { method: 'POST', body: { filename: 'test-audio.webm', contentType: 'audio/webm', entryId: 'e-test' } };
    const res1 = mockRes();
    // @ts-ignore
    await signedUpload(req1, res1);
    expect(res1.json).toHaveBeenCalled();
    const uploadResp = res1.json.mock.calls[0][0];
    expect(uploadResp.uploadUrl).toBeDefined();

    // 2) notify-upload
    const req2: any = { method: 'POST', body: { entryId: 'e-test', fileUrl: uploadResp.fileUrl } };
    const res2 = mockRes();
    // @ts-ignore
    await notifyUpload(req2, res2);
    expect(res2.json).toHaveBeenCalled();
    const notifyResp = res2.json.mock.calls[0][0];
    expect(notifyResp.taskId).toBeDefined();

    // 3) transcribe-callback
    const req3: any = { method: 'POST', body: { taskId: notifyResp.taskId, entryId: 'e-test', transcriptText: 'Simulated transcript' } };
    const res3 = mockRes();
    // @ts-ignore
    await transcribeCallback(req3, res3);
    expect(res3.json).toHaveBeenCalled();

    // 4) generate-post (dev-mode)
    const req4: any = { method: 'POST', body: { sanitizedText: 'I shipped a feature today', tone: 'insightful', variants: 2 } };
    const res4 = mockRes();
    // @ts-ignore
    await generatePost(req4, res4);
    expect(res4.json).toHaveBeenCalled();
    const genResp = res4.json.mock.calls[0][0];
    expect(genResp.variantsRaw).toBeDefined();
  }, 10000);
});
