import middy from '@middy/core'
import jsonBodyParser from '@middy/http-json-body-parser'
import validator from '@middy/validator'
import { transpileSchema } from '@middy/validator/transpile'
import httpEventNormalizer from '@middy/http-event-normalizer'
import httpErrorHandler from '@middy/http-error-handler'
import { APIGatewayProxyHandler } from 'aws-lambda'

export default (
  handler: APIGatewayProxyHandler,
  schema: any,
  useJsonBodyParser = false,
) => {
  const middlewares = []

  if (useJsonBodyParser) {
    middlewares.push(jsonBodyParser())
  }

  middlewares.push(
    validator({
      eventSchema: transpileSchema(schema, {
        verbose: true,
      }),
    }),
    httpEventNormalizer(),
    httpErrorHandler(),
  )

  return middy(handler).use(middlewares)
}
