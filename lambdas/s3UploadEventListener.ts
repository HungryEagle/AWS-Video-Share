import { S3Handler } from "aws-lambda"
import { VideoDB } from "../entity/video"

const videoDB = new VideoDB({
    region: "test",
    tableName: "test"
})

export const handler: S3Handler = async (e) => {
    videoDB.update({
        id: "",
        attrs: {
            
        }
    })
}