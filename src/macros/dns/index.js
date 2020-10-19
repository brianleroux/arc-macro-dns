let getTLD = require('./get-tld')
let getStaticCDN = require('./get-static-cdn')
let getAlias = require('./get-alias')

// This code assumes the following is true:
//
// - ONE top level domain is being configured
// - we are deploying in us-east-1
// - the certificate domain is hosted in Amazon Route 53
// - the domain resides in your AWS account
// - we are using DNS validation
//
module.exports = async function dns (arc, cfn) {
  if (arc.dns) {

    // assumes one zone for all dns records
    let zone = getTLD(arc)

    // one cert for the entire zone
    cfn.Resources.Certificate = {
      Type: 'AWS::CertificateManager::Certificate',
      Properties: {
        ValidationMethod: 'DNS', // required!
        DomainName: zone,
        SubjectAlternativeNames: [ `*.${zone}` ]
      }
    }

    // setup @static dns
    let hasStatic = i => Object.keys(i)[0] === 'static'
    if (arc.dns.some(hasStatic)) {
      let ref = arc.dns.find(hasStatic)['static']
      cfn.Resources.StaticStagingCDN = getStaticCDN({ domain: ref.staging })
      cfn.Resources.StaticProductionCDN = getStaticCDN({ domain: ref.production })
      cfn.Resources.StaticStagingDNS = getAlias({ zone, cdn: 'StaticStagingCDN', domain: ref.staging })
      cfn.Resources.StaticProductionDNS = getAlias({ zone, cdn: 'StaticProductionCDN', domain: ref.production })
    }

    // setup @http dns
    // setup @ws dns

  // end
  }
  return cfn
}
