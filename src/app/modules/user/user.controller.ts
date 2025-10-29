import { Request, Response } from "express";
import { CatchAsync } from "../../utils/CatchAsync";
import { SendResponse } from "../../utils/SendResponse";
import { userServices } from "./user.service";


const getAllUsers = CatchAsync(async (req: Request, res: Response) => {
    const result = await userServices.getAllUsersService();

    SendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Users fetched successfully!",
        data: result
    })
})


export const userControllers = {
    getAllUsers
}