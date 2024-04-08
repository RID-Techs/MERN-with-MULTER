const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"]
        if(!authHeader){
            console.log('Authorization header is missing');
            res.status(401).json({Mes: "You are unauthorized"})
        }

        const token = authHeader.split(" ")[1]
        if(!token){
            console.log('Token is missing');
            res.status(401).json({Mes: "No token, You are unauthorized"})
        }

        jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
            if(err){
                console.error('Token verification failed:', err);
                return res.status(401).json({ message: "Token verification failed" });
            } else{
                req.user = user;
                console.log('User authenticated:', user);
                next();
            }
        })
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }
}

module.exports = auth