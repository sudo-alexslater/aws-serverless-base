import { Code } from 'aws-cdk-lib/aws-lambda';

export const lambdaCode = Code.fromAsset('dist/lambda');
