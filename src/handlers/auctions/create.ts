import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { v4 as uuid } from 'uuid'
import middy from '@middy/core'
import httpjsonBodyParser from '@middy/http-json-body-parser'
import httpEventNormalizer from '@middy/http-event-normalizer'
import httpErrorHandler from '@middy/http-error-handler'

import { dynamoDb } from '../../lib/dynamo'
import { LambdaResponse } from '../../lib/responses'
import createHttpError from 'http-errors'

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

export const handler = middy(createAuction)
  .use(httpjsonBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler())
