exports.handler = async function(event, context) {
  try {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
    const body = JSON.parse(event.body || '{}');
    const { objectKey, entryId, anonymize = false, language = 'en' } = body;
    if (!objectKey || !entryId) return { statusCode: 400, body: JSON.stringify({ error: 'objectKey and entryId required' }) };

    const jobId = `trans-${Date.now()}`;
    // In production: enqueue job or invoke worker

    return { statusCode: 200, body: JSON.stringify({ jobId, status: 'started' }) };
  } catch (err) {
    console.error('transcribe-start error', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'internal_error' }) };
  }
};
