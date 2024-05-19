/**
 * TODO for put handler
 * 
 * should validate the body properly
 * body should contain
 *    userId <String>
 *    title <String>
 *    description? <String>
 *    tags? <String[]>
 * 
 * if a valid body is passed, save the data in the database
 * Create a presigned url and send it to the client
 */

import { handler } from '../putHandler'
import { DB } from '../../lib/db'
import { S3 } from '../../lib/s3'

describe('Tests for the put handler', () => {
    beforeEach(() => {
        jest.spyOn(DB.prototype, "save").mockImplementation((()=>{}) as any)
        jest.spyOn(S3.prototype, "getUploadURL").mockImplementation((() => "url") as any)
    })

    afterEach(() => {
        jest.restoreAllMocks();
    })


    test('should return a 400 status code if empty body is passed', async () => {
        const res = await (handler as any)({ body: JSON.stringify({}) })

        console.log(res)
        expect(res.statusCode).toBe(400);
    })

    test('should call save function if a proper body is passed', async () => {
        const spySave = jest.spyOn(DB.prototype, 'save')
        spySave.mockImplementation((async()=>{}) as any)

        const res = await (handler as any) ({body: JSON.stringify({
            userId: "user-123",
            title: "Cat video"
        })})

        expect(spySave).toHaveBeenCalled();
    })

    test('should call the save function', async () => {
        const spySave = jest.spyOn(DB.prototype, 'save')
        spySave.mockImplementation((async()=>{}) as any)

        const res = await (handler as any) ({body: JSON.stringify({
            userId: "user-123",
            title: "Cat video"
        })})

        expect(spySave).toHaveBeenCalled()
    })

    test('should call function to generate a presigned url', async() => {
        const spyGetUploadUrl = jest.spyOn(S3.prototype, 'getUploadURL')
        spyGetUploadUrl.mockImplementation(async()=>"http://upload-url")
        

        const res = await (handler as any) ({body: JSON.stringify({
            userId: "user-123",
            title: "Cat video"
        })})

        expect(spyGetUploadUrl).toHaveBeenCalledTimes(1)
        expect(JSON.parse(res.body).uploadUrl).toBe("http://upload-url")
    })
})