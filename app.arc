@app
macro-dns

@macros
dns

@cdn
false # important; if we don't have this the deploy script will disable

@ws

@http
get /api

@static
fingerprint true
folder src/frontend

@dns
static
  staging static-qa.arc-macro-dns.com
  production static.arc-macro-dns.com
http
  staging qa.arc-macro-dns.com
  production arc-macro-dns.com
ws
  staging qa-ws.arc-macro-dns.com
  production ws.arc-macro-dns.com
