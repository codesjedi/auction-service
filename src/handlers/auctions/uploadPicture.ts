import { APIGatewayProxyEvent } from "aws-lambda";
import createHttpError from "http-errors";

import { HandlerResponse } from "@/lib/responses"
import { getAuctionById } from "./getById";
import { uploadPicture } from "@/lib/uploadPicture";
import commonMiddleware from "@/lib/commonMiddleware";
import uploadPictureSchema from "./uploadPicture.schema.json";
import { setAuctionPictureUrl } from "@/lib/setAuctionPictureURL";

export async function uploadAunctionPicture(event: APIGatewayProxyEvent) {

    if (!event.body) {
        throw new createHttpError.BadRequest('Image is missing')
    }

    const { id } = event.pathParameters!;

    const auction = await getAuctionById(id!)

    const base64 = event.body!.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');

    try {
      const { Location } = await uploadPicture(auction.id + '.jpg', buffer)
      await setAuctionPictureUrl(auction.id, Location)
      return HandlerResponse(200, {
        message: 'Image uploaded successfully'
      })
    } catch(error) {
      console.error(error)
      throw new createHttpError.InternalServerError(JSON.stringify({
        error: 'Picture was not uploaded to S3',
      }))
    }

    
}

export const handler = commonMiddleware( uploadAunctionPicture, uploadPictureSchema)