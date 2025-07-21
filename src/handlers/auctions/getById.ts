import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import createHttpError from 'http-errors'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import jsonBodyParser from '@middy/http-json-body-parser'

import { dynamoDb } from '@/lib/dynamo'
import { HandlerResponse } from '@/lib/responses'
import commonMiddleware from '@/lib/commonMiddleware'
import { Auction } from '@/types/auction'
import getAuctionByIdSchema from './getById.schema.json'

export async function getAuctionById(id: string): Promise<Auction> {
  const results = await dynamoDb
    .get({
      TableName: process.env.AUCTIONS_TABLE_NAME!,
      Key: { id },
    })
    .promise()
  const auction = results.Item as DocumentClient.AttributeMap & Auction
  if (!auction) {
    throw new createHttpError.NotFound(
      JSON.stringify({
        error: `Auction with id ${id} not found.`,
      }),
    )
  }
  return auction
}

async function getAuction(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  const { id } = event.pathParameters!
  try {
    const auction = await getAuctionById(id!)

    return HandlerResponse(200, {
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

export const handler = commonMiddleware(getAuction, getAuctionByIdSchema)
