import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { v4 as uuid } from 'uuid'
import createHttpError from 'http-errors'
import jsonBodyParser from '@middy/http-json-body-parser'

import { dynamoDb } from '../../lib/dynamo'
import { LambdaResponse } from '../../lib/responses'
import commonMiddleware from '../../lib/commonMiddleware'

async function createAuction(
  event: APIGatewayProxyEvent,
  context: any,
): Promise<APIGatewayProxyResult> {
  const { title } = event.body as any

  if (!title) {
    console.log('Title is required')
    throw new createHttpError.BadRequest(
      JSON.stringify({
        error: 'Title is required',
      }),
    )
  }

  const auction = {
    id: uuid(),
    title,
    status: 'OPEN',
    createdAt: new Date().toISOString(),
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
  return LambdaResponse(201, {
    message: 'Auction created successfully',
    auction,
  })
}

export const handler = commonMiddleware(createAuction).use(jsonBodyParser())
