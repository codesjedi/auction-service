import { APIGatewayProxyEvent } from 'aws-lambda'
import AWS from 'aws-sdk'
import { v4 as uuid } from 'uuid'

const dynamoDb = new AWS.DynamoDB.DocumentClient()

async function createAuction(event: APIGatewayProxyEvent) {
  if (!event.body) {
    return {
      error: 'Body is required',
    }
  }

  const { title } = JSON.parse(event.body)

  if (!title) {
    return {
      error: 'Title is required',
    }
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
        TableName: 'AuctionsTable',
        Item: auction,
      })
      .promise()
  } catch (error) {
    console.error('Error creating auction:', error)
    return {
      statusCode: 500,
      body: {
        error: 'Could not create auction',
      },
    }
  }
  return {
    statusCode: 201,
    body: {
      message: 'Auction created successfully',
      auction,
    },
  }
}

export const handler = createAuction
