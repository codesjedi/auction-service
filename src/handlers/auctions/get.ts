import httpEventNormalizer from '@middy/http-event-normalizer'
import httpErrorHandler from '@middy/http-error-handler'
import middy from '@middy/core'
import createError from 'http-errors'

import { LambdaResponse } from '../../lib/responses'
import { dynamoDb } from '../../lib/dynamo'

async function getAuctions() {
  try {
    const params = {
      TableName: process.env.AUCTIONS_TABLE_NAME!,
      Limit: 100,
    }

    const result = await dynamoDb.scan(params).promise()
    const auctions = result.Items || []

    return LambdaResponse(200, {
      message: 'Auctions retrieved successfully',
      count: auctions.length,
      auctions,
      lastEvaluatedKey: result.LastEvaluatedKey,
    })
  } catch (error) {
    console.error('Error retrieving auctions:', error)

    // throw new createError.InternalServerError(
    //   JSON.stringify({
    //     error: 'Could not retrieve auctions',
    //   }),
    // )
    return LambdaResponse(500, {
      message: 'Could not retrieve auctions',
    })
  }
}

// export const handler = middy(getAuctions)
//   .use(httpEventNormalizer())
//   .use(httpErrorHandler())
// export const handler = getAuctions
export const handler = middy().use(httpErrorHandler()).handler(getAuctions)
