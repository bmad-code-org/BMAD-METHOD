import gen from '../api/generate-post';
test('generate-post rejects GET', async () => {
    const req = { method: 'GET' };
    const res = { status: jest.fn(() => res), json: jest.fn(() => res) };
    // @ts-ignore
    await gen(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
});
