let arc = require('@architect/functions')

exports.handler = arc.http.async(http)

/** architect/functions takes care of caching headers */
async function http (req) {
  return {
    html: `<!doctype html>
<html lang=en>
<head>
  <meta charset=UTF-8>
  <meta name=viewport content=width=device-width,initial-scale=1>
  <title>Architect</title>
  <link href="data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQEAYAAABPYyMiAAAABmJLR0T///////8JWPfcAAAACXBIWXMAAABIAAAASABGyWs+AAAAF0lEQVRIx2NgGAWjYBSMglEwCkbBSAcACBAAAeaR9cIAAAAASUVORK5CYII=" rel=icon type=image/x-icon>
<link rel=stylesheet href=${ arc.static('/index.css') }>
<body>
<main>hello world</main>
</body>
<script>
window.WSS_URL = "${ process.env.ARC_WSS_URL }";
</script>
<script type=module src=${ arc.static('/index.js') }></script>
</html>`
  }
}
