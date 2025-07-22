import AWS from 'aws-sdk';
import { s3 } from './s3';

export async function uploadPicture(key: string, body: any) {
    const result = await s3.upload({
        Bucket: process.env.AUCTIONS_BUCKET_NAME!,
        Key: key,
        Body: body,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg'
    }).promise()

    return result

}