import { APIGatewayProxyResult } from 'aws-lambda'

export const LambdaResponse = (
  statusCode: number,
  body: object,
): APIGatewayProxyResult => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }
}
