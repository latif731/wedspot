import express from "express"
import User from "../model/user.js"
import jwt from "jsonwebtoken"
import sendToken from "../utils/jwtoken.js"
import { isAuthenticated } from "../middleware/auth.js"
import asyncHandler from "express-async-handler"


const Register = asyncHandler(async(req,res,next) => {
    try{
        const { name, email, password } = req.body
        console.log(req.body)

        const userEmail = await User.findOne({email})
        // memeriksa data user
        if(userEmail){
            res.status(400).json({
                success:"false",
                message:"User already exists"
            })
        }

        const user = await User.create({
            name,
            email,
            password
        })

        sendToken(user, 201, res)

    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
})


const Login = asyncHandler(async(req,res,next) => {
    try{
        const {email, password} = req.body

        if(!email || !password){
            res.status(400).json({
                success:"false",
                message:"Please Provide The All Fields"
            })
        }

        const user = await User.findOne({ email }).select("+password")

        if(!user){
            res.status(400).json({
                success: false,
                message: "User doesn't exists!",
              });
        }

        const isPasswordValid = password ? await user.comparePassword(password) : false

        if(!isPasswordValid){
            return next(new Error("Please Provide the correct information"))
        }

        const Token = user.getJwtToken()
        const refreshToken = await user.generateRefreshToken()

        await sendToken(user, 201, res, refreshToken, Token);


    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
          });
    }   
})

// const Register = 



export {
    Register,
    Login
}