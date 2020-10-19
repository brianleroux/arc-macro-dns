module.exports = function getDNS ({ zone, cdn, domain }) {
  return {
    Type: 'AWS::Route53::RecordSet',
    Properties: {
      HostedZoneName: `${zone}.`,
      Name: `${domain}.`,
      Type: 'A',
      TTL: '900',
      AliasTarget: {
        HostedZoneId: 'Z2FDTNDATAQYW2', // yep
        DNSName: {
          'Fn::GetAtt': [
            cdn,
            'DomainName'
          ]
        }
      }
    }
  }
}
