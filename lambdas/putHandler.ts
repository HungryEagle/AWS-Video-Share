import { DB } from '../lib/db'
import { S3 } from '../lib/s3'
import { z } from 'zod'
import { createDoc as createVideoDoc } from '../entity/video'
import { v4 } from 'uuid'
import { withBodyValidation } from '../lib/handlers/api'
import { PutHandler as Env } from '../lib/lambdaEnv'

const env = process.env as Env

const db = new DB({
    region: env.VIDEO_TABLE_REGION || "us-east-1",
    tableName: env.VIDEO_TABLE_NAME || "test-table"
})
const s3 = new S3({
    bucketName: env.UPLOAD_BUCKET_NAME ||"test-bucket",
    region: env.UPLOAD_BUCKET_REGION || "us-east-1"
})

export const handler = withBodyValidation({
    schema: z.object({
        userId: z.string(),
        title: z.string(),
        description: z.string().optional(),
        tags: z.array(z.string()).optional()
    }),
    async handler({ title, userId, description, tags }) {
        const id = v4()
        await db.save(createVideoDoc({
            id,
            status: "NOT_UPLOADED",
            title,
            userId,
            uploadedTime: Date.now(),
            description,
            tags
        }));

        return {
            uploadUrl: await s3.getUploadURL({
                key: id,
                expiresIn: 60*10
            })
        }
    }
})