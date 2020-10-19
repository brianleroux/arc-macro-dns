module.exports = function getHttpCDN ({ domain, stage }) {
  return {
    Type: 'AWS::CloudFront::Distribution',
    Properties: {
      DistributionConfig: {
        Aliases: [ domain ], // Important!
        HttpVersion: 'http2',
        IPV6Enabled: true,
        Enabled: true,
        Origins: [ {
          Id: 'HttpEdgeOrigin',
          DomainName: {
            'Fn::Sub': [
              '${ApiId}.execute-api.${AWS::Region}.amazonaws.com',
              { ApiId: { Ref: 'WS' } }
            ]
          },
          OriginPath: `/${stage}`,
          CustomOriginConfig: {
            HTTPPort: 80,
            HTTPSPort: 443,
            OriginKeepaliveTimeout: 5, // NOTE FOR RYAN: up this for API edge config
            OriginProtocolPolicy: 'https-only', // thas right
            OriginReadTimeout: 30,
            OriginSSLProtocols: [ 'TLSv1', 'TLSv1.1', 'TLSv1.2' ],
          }
        } ],
        DefaultCacheBehavior: {
          TargetOriginId: 'HttpEdgeOrigin',
          ForwardedValues: {
            QueryString: true,
            Cookies: { Forward: 'all' },
          },
          ViewerProtocolPolicy: 'redirect-to-https',
          MinTTL: 0,
          AllowedMethods: [ 'HEAD', 'DELETE', 'POST', 'GET', 'OPTIONS', 'PUT', 'PATCH' ],
          CachedMethods: [ 'GET', 'HEAD' ],
          SmoothStreaming: false,
          DefaultTTL: 86400,
          MaxTTL: 31536000,
          Compress: true, // Important!
        },
        PriceClass: 'PriceClass_All',
        ViewerCertificate: {
          AcmCertificateArn: {
            Ref: 'Certificate'
          },
          SslSupportMethod: 'sni-only',
          MinimumProtocolVersion: 'TLSv1.2_2019',
        }
      }
    }
  }
}
