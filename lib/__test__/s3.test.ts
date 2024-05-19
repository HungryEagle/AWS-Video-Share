import { S3 } from "../s3"

describe('Test for S3', () => { 
    test('should return a signed url properly', async () => { 
        const s3 = new S3({
            bucketName: "test-s3",
            region: 'us-east-1'
        })

        const url = await s3.getUploadURL({
            key: "test.png",
            expiresIn: 60*10
        })

        expect(url.includes('test-s3')).toBe(true)
        expect(url.includes("test.png")).toBe(true)
     })
})