# arc-macro-dns

Adds DNS capability to Architect using Route53, CloudFront and Certificate Manager resources. See https://arc-macro-dns.com for a demo of this source.

## Limitations

- assumes domain hosted zone exists in same account 
- apps using this macro must be deployed in `us-east-1`
- apps must disable `@cdn`
- `staging` and `production` configuration are required 

## Install and usage

`npm i arc-macro-dns` and add the following to your `app.arc`:

```arc
@app
myapp

@cdn
false # disable cdn

@macros
arc-macro-dns

@static
@http
@ws

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
```

## TODO
- [ ] update outputs to use dns values
- [ ] update env vars to use dns values
- [ ] throw an error if not in us-east-1
