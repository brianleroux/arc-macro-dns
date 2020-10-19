module.exports = function getDNS ({ zone, cdn, domain }) {
  return {
    Type: 'AWS::Route53::RecordSetGroup',
    Properties: {
      HostedZoneName: `${zone}.`,
      RecordSets: [ {
        Name: `${domain}.`,
        Type: 'A',
        AliasTarget: {
          HostedZoneId: 'Z2FDTNDATAQYW2',
          DNSName: {
            'Fn::GetAtt': [ cdn, 'DomainName' ]
          }
        }
      } ]
    }
  }
}
