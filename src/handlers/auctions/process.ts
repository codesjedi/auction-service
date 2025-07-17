import createHttpError from 'http-errors'

import { closeAuction } from '@/lib/closeAuction'
import { getEndedAuctions } from '@/lib/getEndedAuctions'
import { HandlerResponse } from '@/lib/responses'

async function processAuctions() {
  try {
    console.log('processing auctions!')
    const auctionsToClose = await getEndedAuctions()
    const closePromises = auctionsToClose.map(auction => closeAuction(auction))

    await Promise.all(closePromises)

    return HandlerResponse(200, {
      message: 'Auctions closed',
      closed: auctionsToClose.length,
    })
  } catch (error) {
    console.error(error)
    throw new createHttpError.InternalServerError(
      JSON.stringify({
        error: 'Could not close auctions',
      }),
    )
  }
}

export const handler = processAuctions
