import createError from 'http-errors'
import { APIGatewayProxyEvent } from 'aws-lambda'

import { HandlerResponse } from '@/lib/responses'
import { dynamoDb } from '@/lib/dynamo'
import commonMiddleware from '@/lib/commonMiddleware'
import getAuctionsSchema from './getAuctions.schema.json'

async function getAuctions(event: APIGatewayProxyEvent) {
  const { status } = event.queryStringParameters || {}

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME!,
    IndexName: 'statusAndEndDate',
    KeyConditionExpression: '#status = :status',
    ExpressionAttributeValues: { ':status': status },
    ExpressionAttributeNames: { '#status': 'status' },
  }

  try {
    const result = await dynamoDb.query(params).promise()
    const auctions = result.Items || []

    return HandlerResponse(200, {
      message: 'Auctions retrieved successfully',
      count: auctions.length,
      auctions,
      lastEvaluatedKey: result.LastEvaluatedKey,
    })
  } catch (error) {
    console.error('Error retrieving auctions:', error)

    throw new createError.InternalServerError(
      JSON.stringify({
        error: 'Could not retrieve auctions',
      }),
    )
  }
}

export const handler = commonMiddleware(getAuctions, getAuctionsSchema)
