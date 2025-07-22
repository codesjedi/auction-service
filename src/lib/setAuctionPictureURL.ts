import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { dynamoDb } from './dynamo';

export async function setAuctionPictureUrl(id: string, pictureUrl: string) {

  const params: DocumentClient.UpdateItemInput = {
    TableName: process.env.AUCTIONS_TABLE_NAME!,
    Key: { id },
    UpdateExpression: 'set pictureUrl = :pictureUrl',
    ExpressionAttributeValues: {
      ':pictureUrl': pictureUrl,
    },
  ReturnValues: 'ALL_NEW'
  };

  const result = await dynamoDb.update(params).promise();
  return result.Attributes;
}
