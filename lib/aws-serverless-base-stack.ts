import { Stack, StackProps } from 'aws-cdk-lib';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { HitCounter } from './hitcounter';

export class AwsServerlessBaseStack extends Stack {
	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, props);

		const ping = new lambda.Function(this, 'PingHandler', {
			runtime: lambda.Runtime.NODEJS_16_X,
			code: lambda.Code.fromAsset('dist/lambda'),
			handler: 'ping.handler',
		});

		const pingWithCounter = new HitCounter(this, 'PingHitCounter', {
			downstream: ping,
		});

		// API gateway REST API handled by the ping route
		new apigw.LambdaRestApi(this, 'PingEndpoint', {
			handler: pingWithCounter.handler,
		});
	}
}
