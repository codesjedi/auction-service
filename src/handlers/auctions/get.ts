import createError from 'http-errors'

import { HandlerResponse } from '@/lib/responses'
import { dynamoDb } from '@/lib/dynamo'
import commonMiddleware from '@/lib/commonMiddleware'

async function getAuctions() {
  try {
    const params = {
      TableName: process.env.AUCTIONS_TABLE_NAME!,
      Limit: 100,
    }

    const result = await dynamoDb.scan(params).promise()
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

export const handler = commonMiddleware(getAuctions)
