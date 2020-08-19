const http = require('http');
const url = require('url');
const fs = require('fs');
const mine = { "css": "text/css", "gif": "image/gif", "html": "text/html", "ico": "image/x-icon", "jpeg": "image/jpeg", "jpg": "image/jpeg", "js": "text/javascript", "json": "application/json", "pdf": "application/pdf", "png": "image/png", "svg": "image/svg+xml", "swf": "application/x-shockwave-flash", "tiff": "image/tiff", "txt": "text/plain", "wav": "audio/x-wav", "wma": "audio/x-ms-wma", "wmv": "video/x-ms-wmv", "xml": "text/xml" };
const path = require('path');

let documentRoot = './';
let app = function(req, res) {
    let pathname = url.parse(req.url).pathname;
    let realPath = path.join(documentRoot, pathname);
    let ext = path.extname(realPath);
    ext = ext ? ext.slice(1) : 'unknown';
    fs.readFile(realPath, function(err, data) {
        if (err) {
            res.writeHeader(404, {
                'content-type': 'text/html;charset="utf-8"'
            });
            res.write('<h1>404错误 by bu</h1><p>你要找的页面不存在</p><br /><a href="http://127.0.0.1/index.html">index.html<a/>"');
            res.end();
        } else {
            let contentType = mine[ext] || "text/plain";
            res.writeHeader(200, {
                'content-type': contentType
            });
            res.write(data); //将index.html显示在客户端
            res.end();
        }
    });
};
http.createServer(app).listen(80);
const _url = 'http://127.0.0.1:80/index.html';
console.log('Server running at ' + _url);