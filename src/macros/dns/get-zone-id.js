let aws = require('aws-sdk')

module.exports = async function getZoneID (name) {
  let r53 = new aws.Route53
  let raw = await r53.listHostedZonesByName({ DNSName: name }).promise()
  let result = raw.HostedZones.find(r => r.Name.startsWith(name))
  return result.Id.replace('/hostedzone/', '')
}
