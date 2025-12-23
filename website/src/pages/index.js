import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function Home() {
  const llmsFullUrl = useBaseUrl('/llms-full.txt');

  return (
    <Layout title="Home" description="BMAD Method - AI-driven agile development">
      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 200px)',
          textAlign: 'center',
          padding: '2rem',
        }}
      >
        <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>BMAD Method</h1>
        <p
          style={{
            fontSize: '1.5rem',
            color: 'var(--ifm-color-emphasis-600)',
            marginBottom: '2rem',
          }}
        >
          Under Construction
        </p>

        <Link to="/docs/" className="button button--primary button--lg" style={{ marginBottom: '3rem' }}>
          View Documentation
        </Link>

        <a
          href={llmsFullUrl}
          title="Complete BMAD documentation in a single file for AI assistants"
          style={{
            fontSize: '0.875rem',
            color: 'var(--ifm-color-emphasis-500)',
          }}
        >
          🤖 AI Context: llms-full.txt
        </a>
      </main>
    </Layout>
  );
}
