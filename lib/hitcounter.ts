import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Code, Function, IFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export interface HitCounterProps {
	/** function to count hits for */
	downstream: IFunction;
}

export class HitCounter extends Construct {
	public readonly handler: Function;

	constructor(scope: Construct, id: string, props: HitCounterProps) {
		super(scope, id);

		const table = new Table(this, 'HitsTable', {
			partitionKey: { name: 'path', type: AttributeType.STRING },
		});

		this.handler = new Function(this, 'HitCounterHandler', {
			runtime: Runtime.NODEJS_16_X,
			handler: 'hitcounter.handler',
			code: Code.fromAsset('dist/lambda'),
			environment: {
				DOWNSTREAM_FUNCTION_NAME: props.downstream.functionName,
				HITS_TABLE_NAME: table.tableName,
			},
		});

		table.grantReadWriteData(this.handler);
		props.downstream.grantInvoke(this.handler);
	}
}
