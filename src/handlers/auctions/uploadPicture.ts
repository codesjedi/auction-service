import { HandlerResponse } from "@/lib/responses"

export async function uploadAunctionPicture() {

    return HandlerResponse(200, {
        status: 'it works!'
    })
}

export const handler = uploadAunctionPicture