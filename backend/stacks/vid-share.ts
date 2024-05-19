import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import * as LambdaEnvType from '../../lib/lambdaEnv'
import { Construct } from 'constructs';
import { resolve } from 'path'
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class VidShareAppStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        //S3 bucket
        const uploadBucket = new s3.Bucket(this, 'vidshare-video-upload-bucket', {
            removalPolicy: cdk.RemovalPolicy.DESTROY
        })

        //DynamoDB 
        const table = new dynamodb.Table(this, 'VideoTable', {
            partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            removalPolicy: cdk.RemovalPolicy.DESTROY
        })

        table.addGlobalSecondaryIndex({
            indexName: 'byUserId',
            partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'uploadedTime', type: dynamodb.AttributeType.NUMBER },
        })

        const putHandlerEnv : LambdaEnvType.PutHandler = {
            VIDEO_TABLE_NAME: table.tableName,
            VIDEO_TABLE_REGION: this.region,
            UPLOAD_BUCKET_NAME: uploadBucket.bucketName,
            UPLOAD_BUCKET_REGION: this.region 
        }

        //PutHandler
        const putHandlerLambda = new lambda.NodejsFunction(this, 'PutHandler', {
            entry: resolve(__dirname, "../../lambdas/putHandler.ts"),
            environment: putHandlerEnv
        })

        //API Gateway
        const mainApi = new apigateway.RestApi(this, 'VidShareMainApi', {
            deploy: false
        })
        mainApi.root.addResource("video").addMethod("PUT", new apigateway.LambdaIntegration(putHandlerLambda))
        mainApi.deploymentStage = new apigateway.Stage(this, "VidShareMainApiDevStage", {
             stageName: "dev",
             deployment: new apigateway.Deployment(this, "VidShareMainApiDevDeployment", {
                api: mainApi
             })
        })

        //Permissions
        table.grantWriteData(putHandlerLambda)
        uploadBucket.grantPut(putHandlerLambda)
    }
}