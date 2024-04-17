const User = require('../Models/Users_Model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const SignUp = async (req, res) => {
    try {
        const hash = await bcrypt.hash(req.body.password, 10)
        const user = new User({
            pseudo: req.body.pseudo,
            email: req.body.email,
            password: hash
        })
        await user.save()
        res.status(201).json({mes: "User Created"})
    } catch (error) {
        res.status(500).json({Error: error})
    }
}

const Login = async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email})
        if(!user) {
            console.log('No User email like that !')
            return res.status(401).json({mesEmail: "Invalid Email"})
        }

        const passwordCheck = await bcrypt.compare(req.body.password, user.password)
        if(!passwordCheck){
            console.log('No password like that !')
            return res.status(401).json({mesPass: "Invalid Password"})
        }

        if(req.body.pseudo !== user.pseudo){
            console.log('No pseudo like that !')
            return res.status(401).json({mesPseudo: "Invalid Pseudo"})
        }

        res.status(200).json({
            userId: user._id,
            token: jwt.sign(
                {userId: user._id},
                process.env.ACCESS_TOKEN,
                {expiresIn: "1800s"}
            )
        })
        
    } catch (error) {
        return res.status(500).json({error})
    }
}

module.exports = { SignUp, Login }