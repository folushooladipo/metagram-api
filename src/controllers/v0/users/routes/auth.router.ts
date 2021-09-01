import * as bcrypt from "bcrypt"
import * as jwt from "jsonwebtoken"
import {Request, Response, Router} from "express"
import {NextFunction} from "connect"
import {validate as validateEmail} from "email-validator"

import {User} from "../models/User"
import {config as loadEnvironmentVariables} from "dotenv"

loadEnvironmentVariables()
const router: Router = Router()
const secondsInOneWeek = 60 * 60 * 24 * 7

const getPasswordHash = (plainTextPassword: string): string => {
  const saltingRounds = 10
  return bcrypt.hashSync(plainTextPassword, saltingRounds)
}

const comparePasswords = (plainTextPassword: string, hash: string): boolean => {
// function comparePasswords(plainTextPassword: string, hash: string): Promise<boolean> {
  //@TODO Use Bcrypt to Compare your password to your Salted Hashed Password
  return true
}

const generateJWT = (user: User): string => {
  const payload = {
    email: user.email,
  }
  const secondsSinceUnixEpoch = Math.floor(Date.now() / 1000)
  const expiresIn = secondsSinceUnixEpoch + secondsInOneWeek
  const jwtToken = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {
      expiresIn,
    }
  )
  return jwtToken
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  console.warn("auth.router not yet implemented, you'll cover this in lesson 5")
  return next()
  // if (!req.headers || !req.headers.authorization){
  //     return res.status(401).send({ message: 'No authorization headers.' });
  // }

  // const token_bearer = req.headers.authorization.split(' ');
  // if(token_bearer.length != 2){
  //     return res.status(401).send({ message: 'Malformed token.' });
  // }

  // const token = token_bearer[1];

  // return jwt.verify(token, "hello", (err, decoded) => {
  //   if (err) {
  //     return res.status(500).send({ auth: false, message: 'Failed to authenticate.' });
  //   }
  //   return next();
  // });
}

router.get("/verification", requireAuth, (req, res) => {
  return res.status(200).send({auth: true, message: "Authenticated."})
})

router.post("/login", async (req, res) => {
  const email = req.body.email
  const password = req.body.password
  // check email is valid
  if (!email || !validateEmail(email)) {
    return res.status(400).send({auth: false, message: "Email is required or malformed"})
  }

  // check email password valid
  if (!password) {
    return res.status(400).send({auth: false, message: "Password is required"})
  }

  const user = await User.findByPk(email)
  // check that user exists
  if (!user) {
    return res.status(401).send({auth: false, message: "Unauthorized"})
  }

  // check that the password matches
  const authValid = await comparePasswords(password, user.password_hash)

  if (!authValid) {
    return res.status(401).send({auth: false, message: "Unauthorized"})
  }

  // Generate JWT
  const jwt = generateJWT(user)

  res.status(200).send({auth: true, token: jwt, user: user.short()})
})

// Register a new user
router.post("/", async (req, res) => {
  const {
    email,
    password: plainTextPassword,
  } = req.body

  if (!email) {
    return res
      .status(400)
      .json({auth: false, message: "Email is required."})
  }

  if (!validateEmail(email)) {
    return res
      .status(400)
      .json({auth: false, message: "Email is not valid."})
  }

  if (!plainTextPassword) {
    return res
      .status(400)
      .json({auth: false, message: "Password is required."})
  }

  // @TODO: add a check that validates that plainTextPassword has the required strength
  // i.e two numbers, two lowercase letters, two uppercase letters, and two symbols
  // and, thus, at least 8 characters long.

  const user = await User.findByPk(email)
  if (user) {
    return res
      .status(422)
      .json({auth: false, message: "User already exists."})
  }

  const hashedPassword = getPasswordHash(plainTextPassword)
  const newUser = new User({
    email,
    password_hash: hashedPassword,
  })

  let savedUser
  try {
    savedUser = await newUser.save()
  } catch (e) {
    console.error(e)
    return res
      .status(500)
      .json({
        auth: false,
        message: "Failed to create account. Please try again.",
      })
  }

  const jwt = generateJWT(savedUser)

  res
    .status(201)
    .json({
      message: "Account created.",
      token: jwt,
      user: savedUser.short(),
    })
})

router.get("/", (req, res) => {
  res.send("auth")
})

export const AuthRouter: Router = router
