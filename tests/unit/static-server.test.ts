import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import type { Server } from 'node:http';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createStaticServer, resolveStaticRequest } from '../../scripts/serve.mjs';

let server: Server;
let root: string;
let baseUrl: string;

beforeAll(async () => {
  root = mkdtempSync(join(tmpdir(), 'one-change-tonight-server-'));
  mkdirSync(join(root, 'guide'), { recursive: true });
  writeFileSync(join(root, 'index.html'), '<h1>Home</h1>');
  writeFileSync(join(root, 'guide', 'index.html'), '<h1>Guide</h1>');
  writeFileSync(join(root, 'asset.css'), 'body { color: black; }');
  writeFileSync(join(root, '404.html'), '<h1>Missing</h1>');
  server = createStaticServer(root);
  await new Promise<void>((resolveListen) => server.listen(0, '127.0.0.1', resolveListen));
  const address = server.address();
  if (!address || typeof address === 'string')
    throw new Error('Test server did not expose a port.');
  baseUrl = `http://127.0.0.1:${address.port}`;
});

afterAll(async () => {
  await new Promise<void>((resolveClose, reject) =>
    server.close((error) => (error ? reject(error) : resolveClose())),
  );
  rmSync(root, { recursive: true, force: true });
});

describe('Railway static server', () => {
  it('resolves ordinary files and rejects encoded traversal', () => {
    expect(resolveStaticRequest(root, '/guide/')).toMatchObject({ status: 200 });
    expect(resolveStaticRequest(root, '/..%2Foutside')).toEqual({ status: 400, file: null });
  });

  it('returns 400 for malformed percent encoding without terminating', async () => {
    const malformed = await fetch(`${baseUrl}/%`);
    expect(malformed.status).toBe(400);
    expect(await malformed.text()).toBe('Bad Request');
    expect((await fetch(baseUrl)).status).toBe(200);
  });

  it('supports GET and HEAD and returns a real 404 document', async () => {
    const guide = await fetch(`${baseUrl}/guide/`);
    expect(guide.status).toBe(200);
    expect(await guide.text()).toContain('Guide');

    const head = await fetch(`${baseUrl}/guide/`, { method: 'HEAD' });
    expect(head.status).toBe(200);
    expect(await head.text()).toBe('');

    const missing = await fetch(`${baseUrl}/missing/`);
    expect(missing.status).toBe(404);
    expect(await missing.text()).toContain('Missing');
  });

  it('permanently redirects directory routes and index documents to canonical URLs', async () => {
    const slashless = await fetch(`${baseUrl}/guide`, { redirect: 'manual' });
    expect(slashless.status).toBe(308);
    expect(slashless.headers.get('location')).toBe('/guide/');

    const head = await fetch(`${baseUrl}/guide?from=head`, {
      method: 'HEAD',
      redirect: 'manual',
    });
    expect(head.status).toBe(308);
    expect(head.headers.get('location')).toBe('/guide/?from=head');
    expect(await head.text()).toBe('');

    const index = await fetch(`${baseUrl}/index.html?from=index`, { redirect: 'manual' });
    expect(index.status).toBe(308);
    expect(index.headers.get('location')).toBe('/?from=index');
  });

  it('does not redirect file assets or the explicit 404 document', async () => {
    const asset = await fetch(`${baseUrl}/asset.css`, { redirect: 'manual' });
    expect(asset.status).toBe(200);
    expect(asset.headers.get('location')).toBeNull();

    const notFoundDocument = await fetch(`${baseUrl}/404.html`, { redirect: 'manual' });
    expect(notFoundDocument.status).toBe(200);
    expect(notFoundDocument.headers.get('location')).toBeNull();
  });

  it('rejects unsupported methods and emits restrictive headers', async () => {
    const response = await fetch(baseUrl, { method: 'POST' });
    expect(response.status).toBe(405);
    expect(response.headers.get('allow')).toBe('GET, HEAD');
    expect(response.headers.get('content-security-policy')).toContain("connect-src 'none'");
    expect(response.headers.get('x-frame-options')).toBe('DENY');
  });
});
