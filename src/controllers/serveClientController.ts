import { serveFile, serveDir } from 'jsr:@std/http/file-server';

export function serveClientController(req: Request) {
  const path = new URL(req.url).pathname

  if (path.includes('images/')) {
    return serveDir(req, {
      fsRoot: 'images',
      urlRoot: 'images',
    })
  }

  if (path.includes('.')) {
    return serveDir(req, {
      fsRoot: 'dist',
      urlRoot: '',
    })
  }

  return serveFile(req, './dist/index.html')
}
