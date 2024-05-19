/**
 * Update video status to be uploaded
 * Processing the video file
 * 
 */
import { VideoDB } from "../../entity/video"
import { handler } from "../s3UploadEventListener"


describe('Tests for S3 upload event listener', () => {

    test('It should call the update method with the correct metadata', async () => {
        const spyUpdate = jest.spyOn(VideoDB.prototype, "update")

        const res = await (handler as any)();

        expect(spyUpdate).toHaveBeenCalledTimes(1)
    })
})