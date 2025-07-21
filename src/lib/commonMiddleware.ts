import middy from '@middy/core'
import validator from '@middy/validator'
import { transpileSchema } from '@middy/validator/transpile'
import httpEventNormalizer from '@middy/http-event-normalizer'
import httpErrorHandler from '@middy/http-error-handler'
import { APIGatewayProxyHandler } from 'aws-lambda'

export default (handler: APIGatewayProxyHandler, schema: any) =>
  middy(handler).use([
    httpEventNormalizer(),
    httpErrorHandler(),
    validator({
      eventSchema: transpileSchema(schema, {
        verbose: true,
      }),
    }),
  ])
