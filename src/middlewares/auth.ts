import { Request, Response } from "express";
import Users from '../models/user'
import { v4 as uuidv4 } from 'uuid';


function generateUserName(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '1234567890'
    let result = '';
    result += characters.charAt(Math.floor(Math.random() * characters.length));
    result += characters.charAt(Math.floor(Math.random() * characters.length));
    // }
    for (let i = 0; i < length; i++) {
        result += numbers.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export const AddUser = async (req: Request, res: Response) => {
    const { name, email, image, phone, code,pan,docUrl } = req.body;
    if (name && email) {
        try {
            const user = await Users.findOne({
                $or: [
                    { email },
                    {
                        contactDetails: {
                            phone,
                            countryCode: code
                        }
                    },
                    {
                        PAN:pan
                    }
                ]
            })
            if (user) { 
                res.status(200).json({
                    error: true,
                    message: 'user already exists'
                })
             }
            else {
                const newUser = new Users({
                    userId: uuidv4(),
                    name,
                    userName: generateUserName(10),
                    email,
                    image: image ?? null,
                    contactDetails: {
                        phone,
                        countryCode: code
                    },
                    cart:[],
                    PAN:pan,
                    document:docUrl,
                    CompletedAuctions:[]
                })
                const userCreated = await newUser.save()
                res.status(200).json({
                    error: false,
                    message: 'registration successfull',
                    user:userCreated
                })
            }
        } catch (error: any) {
            res.status(200).json({
                error: true,
                message: error.message
            })
        }
    }
    else {
        res.status(200).json({
            error: true,
            message: 'fields are missing'
        })
    }
}

export const GetUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    if (userId) {
        try {
            const user = await Users.findOne({ userId })
            if (user) {
                res.status(200).json({
                    error: false,
                    message: 'login successfull',
                    user
                })
            }
            else {
                res.status(200).json({
                    error: true,
                    message: 'user not found',
                    user
                })
            }
        } catch (error: any) {
            res.status(200).json({
                error: true,
                message: error.message
            })
        }
    }
    else {
        res.status(200).json({
            error: true,
            message: 'userId is required'
        })
    }
}