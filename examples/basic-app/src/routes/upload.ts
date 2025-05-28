import { HttpContext } from '../../../../framework';
import { client as s3 } from '../utils/s3';

// GET: Serve a simple HTML form for file upload (multiple files)
export async function GET(ctx: HttpContext) {
  const html = `<!DOCTYPE html>
  <html>
    <head><title>File Upload</title></head>
    <body>
      <h1>Upload files</h1>
      <form action="/upload" method="post" enctype="multipart/form-data">
        <input type="file" name="file" multiple />
        <input type="submit" value="Upload" />
      </form>
    </body>
  </html>`;
  return ctx.html(html);
}

export async function POST(ctx: HttpContext) {
  const start = performance.now();
  const files = await ctx.files();
  let fileList = files['file'];
  if (!fileList) {
    return ctx.res.text('No file uploaded', 400);
  }
  // Always work with an array
  if (!Array.isArray(fileList)) fileList = [fileList];
  const results = [];
  for (const upload of fileList) {
    if (!upload || typeof upload !== 'object' || typeof upload.arrayBuffer !== 'function') {
      results.push({ error: 'Invalid file upload' });
      continue;
    }
    const localName = `uploaded_${upload.name || 'file'}`;
    await Bun.write(localName, upload);
    let size = upload.size;
    if (typeof size !== 'number') {
      const buf = await upload.arrayBuffer();
      size = buf.byteLength;
    }
    const s3Key = `uploads/${upload.name || 'file'}`;
    await s3.write(s3Key, upload);
    results.push({ name: upload.name, size, s3Key });
  }
  const end = performance.now();
  const duration = (end - start).toFixed(2);
  return ctx.res.json({
    message: `Uploaded ${results.length} file(s) in ${duration} ms`,
    files: results,
  });
} 