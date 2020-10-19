let getTLD = require('./get-tld')
let getZoneID = require('./get-zone-id')
let getStaticCDN = require('./get-static-cdn')
let getHttpCDN = require('./get-http-cdn')
let getWsCDN = require('./get-ws-cdn')
let getAlias = require('./get-alias')

// This code assumes the following is true:
//
// - ONE top level domain is being configured
// - we are deploying in us-east-1
// - the certificate domain is hosted in Amazon Route 53
// - the domain resides in your AWS account
// - we are using DNS validation
//
module.exports = async function dns (arc, cfn, stage) {
  if (arc.dns) {

    // assumes one zone for all dns records
    let zone = getTLD(arc)

    // call the api to get the zone id; this is a bit of a wart
    let HostedZoneId = await getZoneID(zone)

    // one cert for the entire zone
    cfn.Resources.Certificate = {
      Type: 'AWS::CertificateManager::Certificate',
      Properties: {
        ValidationMethod: 'DNS', // required!
        DomainName: zone,
        SubjectAlternativeNames: [ `*.${zone}` ],
        DomainValidationOptions: [ {
          DomainName: zone,
          HostedZoneId,
        } ]
      }
    }

    // setup @static dns
    let hasStatic = i => Object.keys(i)[0] === 'static'
    if (arc.dns.some(hasStatic)) {
      let ref = arc.dns.find(hasStatic)['static']
      cfn.Resources.StaticCDN = getStaticCDN({ domain: ref[stage] })
      cfn.Resources.StaticDNS = getAlias({ zone, cdn: 'StaticCDN', domain: ref[stage] })
    }

    // setup @http dns
    let hasHttp = i => Object.keys(i)[0] === 'http'
    if (arc.dns.some(hasHttp)) {
      let ref = arc.dns.find(hasHttp)['http']
      cfn.Resources.HttpCDN = getHttpCDN({ domain: ref[stage] })
      cfn.Resources.HttpDNS = getAlias({ zone, cdn: 'HttpCDN', domain: ref[stage] })
    }

    // setup @ws dns
    let hasWs = i => Object.keys(i)[0] === 'ws'
    if (arc.dns.some(hasHttp)) {
      let ref = arc.dns.find(hasWs)['ws']
      cfn.Resources.WsCDN = getWsCDN({ domain: ref[stage], stage })
      cfn.Resources.WsDNS = getAlias({ zone, cdn: 'WsCDN', domain: ref[stage] })
    }

  // end
  }
  return cfn
}
