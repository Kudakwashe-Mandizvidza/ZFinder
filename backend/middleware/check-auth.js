const jwt = require('jsonwebtoken');
const HttpError = require('../routes/models/http-error');

module.exports = (req, res, next)=>{
    if(req.method === 'OPTIONS'){
        return next();
    }
    
    //check for token availability //through the Authorization header
    try{
        const token = req.headers.authorization.split(' ')[1]; //Authorization: 'Bearer TOKEN'
        if(!token){
            throw new Error('Authentication failed');
        }
        
        const decodedToken = jwt.verify(token,process.env.JWT_KEY);//verifying the validity of the token, used the same private-key
        
        req.userData = {userId: decodedToken.userId}; //added data to the request
        next();
    }catch(err){
        const error = new HttpError('Authentication failed', 401);
        return next(error);
    }
    
    
};