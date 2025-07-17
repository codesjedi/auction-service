import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import createHttpError from 'http-errors'

import { dynamoDb } from '../../lib/dynamo'
import { LambdaResponse } from '../../lib/responses'
import commonMiddleware from '../../lib/commonMiddleware'

async function getAuctionById(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  const { id } = event.pathParameters!
  try {
    const results = await dynamoDb
      .get({
        TableName: process.env.AUCTIONS_TABLE_NAME!,
        Key: { id },
      })
      .promise()
    const auction = results.Item
    if (!auction) {
      console.log(`Auction with id ${id} not found`)
      return LambdaResponse(404, {
        message: `Auction with id ${id} not found`,
      })
    }
    return LambdaResponse(200, {
      message: 'Auction retrieved successfully',
      auction,
    })
  } catch (error) {
    console.error('Error retrieving auction:', error)
    throw new createHttpError.InternalServerError(
      JSON.stringify({
        error: 'Could not retrieve auction',
      }),
    )
  }
}

export const handler = commonMiddleware(getAuctionById)
