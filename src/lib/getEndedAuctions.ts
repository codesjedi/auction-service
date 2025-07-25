import { Auction } from '@/types/auction'
import { dynamoDb } from './dynamo'

export async function getEndedAuctions() {
  const now = new Date()
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME!,
    IndexName: 'statusAndEndDate',
    KeyConditionExpression: '#status = :status AND endingAt <= :now',
    ExpressionAttributeValues: {
      ':status': 'OPEN',
      ':now': now.toISOString(),
    },
    ExpressionAttributeNames: {
      '#status': 'status',
    },
  }

  const result = await dynamoDb.query(params).promise()

  return result.Items as Auction[]
}
