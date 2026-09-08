import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, isAbsolute, join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createGzip } from 'node:zlib';

const defaultRoot = resolve(process.cwd(), 'dist');
const port = Number(process.env.PORT || 4321);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};
const csp =
  "default-src 'self'; connect-src 'none'; img-src 'self' data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests";

export function resolveStaticRequest(rootDirectory, rawUrl) {
  let requestUrl;
  let decodedPath;
  try {
    requestUrl = new URL(rawUrl, 'http://local');
    decodedPath = decodeURIComponent(requestUrl.pathname);
  } catch {
    return { status: 400, file: null };
  }

  if (decodedPath.includes('\0')) return { status: 400, file: null };
  const root = resolve(rootDirectory);
  const direct = resolve(root, `.${decodedPath}`);
  const relativePath = relative(root, direct);
  if (relativePath.startsWith('..') || isAbsolute(relativePath)) {
    return { status: 400, file: null };
  }

  if (decodedPath !== '/404.html' && decodedPath.endsWith('/index.html')) {
    requestUrl.pathname = decodedPath.slice(0, -'index.html'.length) || '/';
    return { status: 308, file: null, location: `${requestUrl.pathname}${requestUrl.search}` };
  }

  const directoryIndex = join(direct, 'index.html');
  if (
    decodedPath !== '/' &&
    !decodedPath.endsWith('/') &&
    existsSync(direct) &&
    statSync(direct).isDirectory() &&
    existsSync(directoryIndex) &&
    statSync(directoryIndex).isFile()
  ) {
    requestUrl.pathname = `${decodedPath}/`;
    return { status: 308, file: null, location: `${requestUrl.pathname}${requestUrl.search}` };
  }

  const candidates = [direct, directoryIndex, `${direct}.html`];
  for (const candidate of candidates) {
    if (existsSync(candidate) && statSync(candidate).isFile()) {
      return { status: 200, file: candidate };
    }
  }
  return { status: 404, file: null };
}

function setSecurityHeaders(res) {
  res.setHeader('Content-Security-Policy', csp);
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  );
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
}

export function createStaticServer(rootDirectory = defaultRoot) {
  const root = resolve(rootDirectory);
  return createServer((req, res) => {
    setSecurityHeaders(res);

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.statusCode = 405;
      res.setHeader('Allow', 'GET, HEAD');
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.end(req.method === 'HEAD' ? undefined : 'Method Not Allowed');
    }

    const resolution = resolveStaticRequest(root, req.url || '/');
    if (resolution.status === 400) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.end(req.method === 'HEAD' ? undefined : 'Bad Request');
    }
    if (resolution.status === 308) {
      res.statusCode = 308;
      res.setHeader('Location', resolution.location);
      return res.end();
    }

    const fallback = join(root, '404.html');
    const target = resolution.file ?? (existsSync(fallback) ? fallback : null);
    if (!target) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.end(req.method === 'HEAD' ? undefined : 'Not Found');
    }

    res.statusCode = resolution.status;
    const extension = extname(target);
    const compressible = ['.html', '.css', '.js', '.json', '.xml', '.txt', '.svg'].includes(
      extension,
    );
    res.setHeader('Content-Type', types[extension] || 'application/octet-stream');
    res.setHeader(
      'Cache-Control',
      target.includes(`${join('dist', '_astro')}`)
        ? 'public, max-age=31536000, immutable'
        : 'public, max-age=0, must-revalidate',
    );
    if (req.method === 'HEAD') return res.end();

    const stream = createReadStream(target);
    stream.on('error', () => {
      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      }
      res.end('Unable to read static asset');
    });
    if (compressible && /gzip/.test(req.headers['accept-encoding'] || '')) {
      res.setHeader('Content-Encoding', 'gzip');
      res.setHeader('Vary', 'Accept-Encoding');
      stream.pipe(createGzip()).pipe(res);
    } else {
      stream.pipe(res);
    }
  });
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : '';
if (import.meta.url === invokedPath) {
  createStaticServer().listen(port, '0.0.0.0', () => {
    console.log(`Static preview listening on ${port}`);
  });
}
