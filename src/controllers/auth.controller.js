// export function register(req, res) {
//     res.send('Register Controller')
// }
import bcrypt from 'bcryptjs'
import createHttpError from "http-errors"
import identityKeyUtil from "../utils/identity-key.util.js"
import prisma from "../config/prisma.config.js"
import { registerSchema } from '../validations/schema.js'

export const register = async (req, res, next) => {
   const {identity, firstName, lastName, password, confirmPassword} = req.body
   //validation
//    if(!identity?.trim()  ||  !firstName.trim()  ||  !lastName.trim() ||  !password.trim() || !confirmPassword.trim()) {
//       return next(createHttpError[400]('fill all inputs'))
//    }
    const rs = registerSchema.parse(req.body)
    console.log(rs)

   if(confirmPassword !== password) {
      return next(createHttpError[400]('check confirm-password'))
   }
   // check identity
    const identityKey = identityKeyUtil(identity)   

   if(!identityKey) {
    return next(createHttpError[400]('identity must be email or phone number'))
   }

   // find user if already have registered
   const haveUser = await prisma.user.findUnique({
    where : { [identityKey] :  identity }
   })
   if(haveUser) {
     return next(createHttpError[409]('This user already register'))
   }


   const newUser = {
    [identityKey]  :  identity,
    password :  await bcrypt.hash(password, 10),
    firstName : firstName,
    lastName  : lastName
   }
   const result = await prisma.user.create({data : newUser})

   res.json({
    msg : 'Register successful',
    result  :  result
   })
}

export const login = (req, res, next) => {
    // throw (new Error('This is my way'))
    // if(req.body.password === 'a1234') {
    //     return next (createHttpError[400]('Bad password'))
    // }
    res.json({
        msg: 'Login Controller',
        body: req.body
    })
}

export const getMe = (req, res) => {
    res.json({msg : 'GetMe controller'})
}
