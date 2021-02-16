const jwt = require ('jsonwebtoken');

const requireAuth = (req, res , next)=>{
    try{
        console.log(req.headers.Cookie)
       const token = req.headers.authorization.split(" ")[1] ;
   // const token = req.Cookies.jwt ; 
        const decoded = jwt.verify(token ,process.env.JWT_KEY);
       req.userDate = decoded ; 
        next();
    }
    catch(error){ 
        res.status (401).json({message : "Auth failed"});

    }
}
module.exports = requireAuth