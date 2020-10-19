let extract = require('extract-domain')

module.exports = function getTLD (arc) {
  if (!arc.dns) throw ReferenceError('missing @dns')
  let domains = arc.dns.map(pragma => {
    let ref
    if (pragma.static) ref = pragma.static
    if (pragma.http) ref = pragma.http
    if (pragma.ws) ref = pragma.ws
    if (!ref.staging) throw ReferenceError(`missing ${Object.keys(pragma)[0]} staging`)
    if (!ref.production) throw ReferenceError(`missing ${Object.keys(pragma)[0]} production`)
    return [ ref.staging, ref.production ]
  }).reduce((a, b) => a.concat(b))
  let reduced = Array.from(new Set(extract(domains))).filter(Boolean)
  if (reduced.length != 1) {
    throw ReferenceError('only one top level domain is allowed')
  }
  return reduced[0]
}

