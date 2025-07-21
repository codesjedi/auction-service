import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { v4 as uuid } from 'uuid'
import createHttpError from 'http-errors'
import jsonBodyParser from '@middy/http-json-body-parser'

import { dynamoDb } from '@/lib/dynamo'
import { HandlerResponse } from '@/lib/responses'
import commonMiddleware from '@/lib/commonMiddleware'
import { Auction } from '@/types/auction'
import createAuctionSchema from './create.schema.json'

async function createAuction(
  event: APIGatewayProxyEvent,
  context: any,
): Promise<APIGatewayProxyResult> {
  const { title } = event.body as any

  const now = new Date()
  const endDate = new Date()
  endDate.setHours(now.getHours() + 1)
  const auction: Auction = {
    id: uuid(),
    title,
    status: 'OPEN',
    createdAt: now.toISOString(),
    endingAt: endDate.toISOString(),
    highestBid: {
      amount: 0,
    },
  }

  try {
    await dynamoDb
      .put({
        TableName: process.env.AUCTIONS_TABLE_NAME!,
        Item: auction,
      })
      .promise()
  } catch (error) {
    console.error('Error creating auction:', error)
    throw new createHttpError.InternalServerError(
      JSON.stringify({
        error: 'Could not create auction',
      }),
    )
  }
  return HandlerResponse(201, {
    message: 'Auction created successfully',
    auction,
  })
}

export const handler = commonMiddleware(
  createAuction,
  createAuctionSchema,
  true,
)
