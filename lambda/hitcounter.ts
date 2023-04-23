import { DynamoDB, Lambda } from 'aws-sdk';

export const handler = async function (event: any) {
	console.log('request:', JSON.stringify(event, undefined, 2));

	const hitsTableName = process.env.HITS_TABLE_NAME;
	const functionName = process.env.DOWNSTREAM_FUNCTION_NAME;

	if (!hitsTableName || !functionName) {
		return {
			error: 'Improper Configuration',
		};
	}

	const dynamo = new DynamoDB();
	const lambda = new Lambda();

	// update dynamo entry by incrementing hits
	await dynamo
		.updateItem({
			TableName: hitsTableName,
			Key: { path: { S: event.path || 'path' } },
			UpdateExpression: 'ADD hits :incr',
			ExpressionAttributeValues: { ':incr': { N: '1' } },
		})
		.promise();
	// call downstream function and capture the response
	const resp = await lambda
		.invoke({
			FunctionName: functionName,
			Payload: JSON.stringify(event),
		})
		.promise();
	console.log('downstream response:', JSON.stringify(resp, undefined, 2));

	// return response back to upstream caller
	if (!resp.Payload) {
		return {};
	}
	return JSON.parse(resp.Payload.toString());
};
