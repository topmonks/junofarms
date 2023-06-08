import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

const webappConfig = new pulumi.Config("webapp");
const webappPackageName = "junofarms--package-webapp";

const domain = webappConfig.require("API_DOMAIN");

const contentBucket = new aws.s3.BucketV2(
  webappPackageName + "-contentBucket",
  {
    bucket: domain,
  }
);

const bucketOwnershipControls = new aws.s3.BucketOwnershipControls(
  webappPackageName + "bucketOwnershipControls",
  {
    bucket: contentBucket.id,
    rule: {
      objectOwnership: "BucketOwnerPreferred",
    },
  }
);

const bucketPublicAccessBlock = new aws.s3.BucketPublicAccessBlock(
  webappPackageName + "bucketPublicAccessBlock",
  {
    bucket: contentBucket.id,
    blockPublicAcls: false,
    blockPublicPolicy: false,
    ignorePublicAcls: false,
    restrictPublicBuckets: false,
  }
);

new aws.s3.BucketAclV2(
  webappPackageName + "bucketAclV2",
  {
    bucket: contentBucket.id,
    acl: "public-read",
  },
  {
    dependsOn: [bucketOwnershipControls, bucketPublicAccessBlock],
  }
);

const contentBucketWebsiteConf = new aws.s3.BucketWebsiteConfigurationV2(
  webappPackageName + "-contentBucketWebsiteConf",
  {
    bucket: contentBucket.id,
    indexDocument: {
      suffix: "index.html",
    },
  }
);

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
const contentBucketPolicy = new aws.s3.BucketPolicy(
  webappPackageName + "-contentBucketPolicy",
  {
    bucket: contentBucket.id,
    policy: contentBucket.arn.apply((bucketArn) =>
      JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "PublicReadGetObject",
            Effect: "Allow",
            Principal: "*",
            Action: ["s3:GetObject"],
            Resource: [bucketArn + "/*"],
          },
        ],
      })
    ),
  },
  {
    dependsOn: [contentBucket],
  }
);

const tenMinutes = 60 * 10;

const awsUsEast1 = new aws.Provider(webappPackageName + "usEast1", {
  region: "us-east-1",
});

const certificate = new aws.acm.Certificate(
  webappPackageName + "-sslCert",
  {
    domainName: domain,
    validationMethod: "DNS",
    subjectAlternativeNames: [`www.${domain}`],
  },
  { provider: awsUsEast1 }
);

const hostedZoneId = aws.route53
  .getZone({ name: webappConfig.require("ROUTE53_ZONE_NAME") }, { async: true })
  .then((zone) => zone.zoneId);

const certificateValidationDomain = new aws.route53.Record(
  webappPackageName + `-${domain}-validation`,
  {
    name: certificate.domainValidationOptions[0].resourceRecordName,
    zoneId: hostedZoneId,
    type: certificate.domainValidationOptions[0].resourceRecordType,
    records: [certificate.domainValidationOptions[0].resourceRecordValue],
    ttl: tenMinutes,
  }
);

const subdomainCertificateValidationDomain = new aws.route53.Record(
  webappPackageName + `${domain}-validation2`,
  {
    name: certificate.domainValidationOptions[1].resourceRecordName,
    zoneId: hostedZoneId,
    type: certificate.domainValidationOptions[1].resourceRecordType,
    records: [certificate.domainValidationOptions[1].resourceRecordValue],
    ttl: tenMinutes,
  }
);

const validationRecordFqdns = [
  certificateValidationDomain.fqdn,
  subdomainCertificateValidationDomain.fqdn,
];

const certificateValidation = new aws.acm.CertificateValidation(
  webappPackageName + "-certificateValidation",
  {
    certificateArn: certificate.arn,
    validationRecordFqdns: validationRecordFqdns,
  },
  { provider: awsUsEast1 }
);

const certificateArn = certificateValidation.certificateArn;

const distributionAliases = [domain, `www.${domain}`];

// distributionArgs configures the CloudFront distribution. Relevant documentation:
// https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html
// https://www.terraform.io/docs/providers/aws/r/cloudfront_distribution.html
const distributionArgs = {
  enabled: true,
  // Alternate aliases the CloudFront distribution can be reached at, in addition to https://xxxx.cloudfront.net.
  // Required if you want to access the distribution via config.targetDomain as well.
  aliases: distributionAliases,

  // We only specify one origin for this distribution, the S3 content bucket.
  origins: [
    {
      originId: contentBucket.arn,
      domainName: contentBucketWebsiteConf.websiteEndpoint,
      customOriginConfig: {
        // Amazon S3 doesn't support HTTPS connections when using an S3 bucket configured as a website endpoint.
        // https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#DownloadDistValuesOriginProtocolPolicy
        originProtocolPolicy: "http-only",
        httpPort: 80,
        httpsPort: 443,
        originSslProtocols: ["TLSv1.2"],
      },
    },
  ],

  defaultRootObject: "index.html",

  // A CloudFront distribution can configure different cache behaviors based on the request path.
  // Here we just specify a single, default cache behavior which is just read-only requests to S3.
  defaultCacheBehavior: {
    targetOriginId: contentBucket.arn,

    viewerProtocolPolicy: "redirect-to-https",
    allowedMethods: ["GET", "HEAD", "OPTIONS"],
    cachedMethods: ["GET", "HEAD", "OPTIONS"],

    forwardedValues: {
      cookies: { forward: "none" },
      queryString: false,
    },

    minTtl: 0,
    defaultTtl: tenMinutes,
    maxTtl: tenMinutes,
    compress: true,
  },

  // "All" is the most broad distribution, and also the most expensive.
  // "100" is the least broad, and also the least expensive.
  priceClass: "PriceClass_100",

  // You can customize error responses. When CloudFront receives an error from the origin (e.g. S3 or some other
  // web service) it can return a different error code, and return the response for a different resource.
  customErrorResponses: [
    { errorCode: 404, responseCode: 200, responsePagePath: "/index.html" },
  ],

  restrictions: {
    geoRestriction: {
      restrictionType: "none",
    },
  },

  viewerCertificate: {
    acmCertificateArn: certificateArn, // Per AWS, ACM certificate must be in the us-east-1 region.
    sslSupportMethod: "sni-only",
  },
};

const distribution = new aws.cloudfront.Distribution(
  webappPackageName + "-cdn",
  distributionArgs
);

new aws.route53.Record(webappPackageName + "-" + domain, {
  name: domain,
  zoneId: hostedZoneId,
  type: "A",
  aliases: [
    {
      name: distribution.domainName,
      zoneId: distribution.hostedZoneId,
      evaluateTargetHealth: true,
    },
  ],
});

new aws.route53.Record(webappPackageName + `-${domain}-www-alias`, {
  name: `www.${domain}`,
  zoneId: hostedZoneId,
  type: "A",
  aliases: [
    {
      name: distribution.domainName,
      zoneId: distribution.hostedZoneId,
      evaluateTargetHealth: true,
    },
  ],
});

export const cloudFrontId = distribution.id;
export const url = `https://${domain}/`;
export const bucketUri = contentBucket.bucket.apply((v) => "s3://" + v);
