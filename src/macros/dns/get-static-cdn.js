module.exports = function getStaticCDN ({ domain }) {
  return {
    Type: 'AWS::CloudFront::Distribution',
    Properties: {
      DistributionConfig: {
        Aliases: [ domain ], // Important!
        HttpVersion: 'http2',
        IPV6Enabled: true,
        Enabled: true,
        Origins: [ {
          Id: 'EdgeOrigin',
          DomainName: {
            'Fn::Sub': [
              '${bukkit}.s3-website-${AWS::Region}.amazonaws.com',
              { bukkit: { Ref: 'StaticBucket' } }
            ]
          },
          CustomOriginConfig: {
            HTTPPort: 80,
            HTTPSPort: 443,
            OriginKeepaliveTimeout: 5, // NOTE FOR RYAN: up this for API edge config
            OriginProtocolPolicy: 'http-only', // thas right
            OriginReadTimeout: 30,
            OriginSSLProtocols: [ 'TLSv1', 'TLSv1.1', 'TLSv1.2' ],
          }
        } ],
        DefaultCacheBehavior: {
          TargetOriginId: 'EdgeOrigin',
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
