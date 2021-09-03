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

const comparePasswords = (plainTextPassword: string, hashedPassword: string): boolean => {
  return bcrypt.compareSync(plainTextPassword, hashedPassword)
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

router.post("/", async (req, res) => {
  const {
    email,
    password: plainTextPassword,
  } = req.body

  if (!email) {
    return res
      .status(400)
      .json({auth: false, error: "Email is required."})
  }

  if (!validateEmail(email)) {
    return res
      .status(400)
      .json({auth: false, error: "Email is not valid."})
  }

  if (!plainTextPassword) {
    return res
      .status(400)
      .json({auth: false, error: "Password is required."})
  }

  // @TODO: add a check that validates that plainTextPassword has the required strength
  // i.e two numbers, two lowercase letters, two uppercase letters, and two symbols
  // and, thus, at least 8 characters long.

  const user = await User.findByPk(email)
  if (user) {
    return res
      .status(422)
      .json({auth: false, error: "User already exists."})
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
        error: "Failed to create account. Please try again.",
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

router.post("/login", async (req, res) => {
  const {
    email,
    password: plainTextPassword,
  } = req.body

  if (!email) {
    return res.status(400).json({auth: false, error: "Email is required."})
  }

  if (!validateEmail(email)) {
    return res.status(400).json({auth: false, error: "Email is not valid."})
  }

  if (!plainTextPassword) {
    return res.status(400).json({auth: false, error: "Password is required."})
  }

  const user = await User.findByPk(email)
  if (!user) {
    return res.status(404).json({auth: false, error: "User not found."})
  }

  const authValid = comparePasswords(plainTextPassword, user.password_hash)
  if (!authValid) {
    return res.status(401).json({auth: false, error: "Unauthorized."})
  }

  const jwt = generateJWT(user)
  res
    .status(200)
    .json({
      message: "Account found.",
      token: jwt,
      user: user.short(),
    })
})

export const requireAuth = (req: Request, res: Response, next: NextFunction): Response => {
  if (!req.headers || !req.headers.authorization) {
    return res.status(400).json({error: "No authorization headers were supplied."})
  }

  const bearerTokenParts = req.headers.authorization.split(" ")
  if (bearerTokenParts.length !== 2) {
    return res.status(400).json({error: "Malformed token."})
  }

  const token = bearerTokenParts[1]

  jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) {
      return res.status(500).json({auth: false, error: "Failed to authenticate."})
    }
    return next()
  })
}

router.get("/verification", requireAuth, (req, res) => {
  return res.status(200).json({auth: true, message: "Authenticated."})
})

export const AuthRouter: Router = router
