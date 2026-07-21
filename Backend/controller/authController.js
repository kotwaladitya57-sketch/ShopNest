const User = require('../model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sendMail = require('../utils/sendMail')

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

// Register user

const registerUser = async (req, res) => {
    const { name, email, password } = req.body
    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = await User.create({ name, email, password: hashedPassword })
        if (newUser) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();

            const message = `Your OTP for email verification is: ${otp}`;
            await sendMail(email, 'Email Verification', message);

            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                token: generateToken(newUser._id)
            });
        }
        else {
            res.status(400).json({ message: 'Invalid user data' })
        }
    }
    catch (error) {
        console.error('Error in registerUser:', error)
        res.status(500).json({ message: 'Server error' })
    }
}

// Login user

const loginUser = async (req, res)=> {
    const { email, password } = req.body
    try{
        const foundUser = await User.findOne({email})
        if(foundUser && (await bcrypt.compare(password, foundUser.password))){
            res.json({
                _id: foundUser._id,
                name: foundUser.name,
                email: foundUser.email,
                role: foundUser.role,
                token: generateToken(foundUser._id)
            })
        }
        else{
            res.status(400).json({ message : 'invalid email or password'});
        }
    } 
    catch (error) {
        console.error('Error in loginUser:', error)
        res.status(500).json({message : 'Server error'})
    }
}

// Get user

const getUsers = async (req,res) => {
    try{
        const users = await User.find({}).select('-password');
        res.json(users);
    }
    catch (error) {
        console.error('Error in getUsers:', error)
        res.status(500).json({message : 'Server error'})
    }
}

module.exports = {registerUser, loginUser, getUsers};