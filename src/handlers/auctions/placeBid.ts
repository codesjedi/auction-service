import { APIGatewayProxyEvent } from 'aws-lambda'
import jsonBodyParser from '@middy/http-json-body-parser'
import createHttpError from 'http-errors'

import commonMiddleware from '@/lib/commonMiddleware'
import { HandlerResponse } from '@/lib/responses'
import { dynamoDb } from '@/lib/dynamo'
import { getAuctionById } from './getById'

async function placeBid(event: APIGatewayProxyEvent) {
  const { amount } = event.body as any
  const { id } = event.pathParameters!

  if (!amount) {
    return HandlerResponse(400, {
      error: 'Bid amount is required',
    })
  }

  const auction = await getAuctionById(id!)

  if (auction.status !== 'OPEN') {
    throw new createHttpError.Forbidden(
      JSON.stringify({
        error: 'You cannot bid on closed auctions',
      }),
    )
  }

  if (amount <= auction.highestBid.amount) {
    throw new createHttpError.Forbidden(
      JSON.stringify({
        error: `Your bid must be higher than ${auction.highestBid.amount}`,
      }),
    )
  }

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME!,
    Key: { id },
    UpdateExpression: 'set highestBid.amount = :amount',
    ExpressionAttributeValues: {
      ':amount': amount,
    },
    ReturnValues: 'ALL_NEW',
  }

  try {
    const result = await dynamoDb.update(params).promise()
    return HandlerResponse(200, {
      auction: result.Attributes,
    })
  } catch (error) {
    console.error(error)
    throw new createHttpError.InternalServerError(
      JSON.stringify({
        error: 'Internal Server Error',
      }),
    )
  }
}

export const handler = commonMiddleware(placeBid).use(jsonBodyParser())
