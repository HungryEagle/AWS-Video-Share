import { DB } from "../db"

describe.skip('Test for DB', () => { 
    test('Should save the data in the database properly', async() => {
        const db = new DB({
            region: 'us-east-1',
            tableName: "vidshare-video"
        })

        const res = await db.save({
            id: "test-123",
            userId: "user-123",
            tags: undefined
        })

        console.log(res)
    })
 })