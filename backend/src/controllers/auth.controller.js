const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
async function registerUserController(req, res) {
    try {
        const { username, email, password } = req.body
        
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        
        const user = await userModel.create({
            username,
            email,
            password: hashedPassword
        })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' })
        
        res.cookie('token', token, { httpOnly: true })
        res.status(201).json({ message: "User registered successfully", user: { id: user._id, username: user.username, email: user.email }, token })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}

async function loginUserController(req, res) {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" })
        }

        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' })
        
        res.cookie('token', token, { httpOnly: true })
        res.status(200).json({ message: "Logged in successfully", user: { id: user._id, username: user.username, email: user.email }, token })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}

async function logoutUserController(req, res) {
    try {
        const token = req.cookies?.token
        if (token) {
            await tokenBlacklistModel.create({ token })
        }
        res.clearCookie('token')
        res.status(200).json({ message: "Logged out successfully" })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

async function getMeController(req, res) {
    try {
        const user = await userModel.findById(req.user.id).select("-password")
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        res.status(200).json({ user })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = { registerUserController, loginUserController, logoutUserController, getMeController }