import middy from '@middy/core'
import httpEventNormalizer from '@middy/http-event-normalizer'
import httpErrorHandler from '@middy/http-error-handler'
import { APIGatewayProxyHandler } from 'aws-lambda'

export default (handler: APIGatewayProxyHandler) =>
  middy(handler).use([httpEventNormalizer(), httpErrorHandler()])
