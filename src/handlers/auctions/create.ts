import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { v4 as uuid } from 'uuid'

import { dynamoDb } from '../../lib/dynamo'
import { LambdaResponse } from '../../lib/responses'

async function createAuction(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  if (!event.body) {
    return LambdaResponse(400, {
      error: 'Request body is required',
    })
  }
  const body = JSON.parse(event.body)

  const { title } = body

  if (!title) {
    return LambdaResponse(400, {
      error: 'Title is required',
    })
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
    return LambdaResponse(500, {
      error: 'Could not create auction',
    })
  }
  return LambdaResponse(201, {
    message: 'Auction created successfully',
    auction,
  })
}

export const handler = createAuction
