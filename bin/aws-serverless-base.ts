#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AwsServerlessBaseStack } from '../lib/aws-serverless-base-stack';

const app = new cdk.App();
new AwsServerlessBaseStack(app, 'AwsServerlessBaseStack');
