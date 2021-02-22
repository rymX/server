const jwt = require ('jsonwebtoken');
const { get } = require('mongoose');

const requireAuth = (req, res , next)=>{
    try{
        const cookies = req.headers.cookie ; 
        const getToken = ( cookies ) => {
            return cookies.split('; ').reduce((r, v) => {
              const parts = v.split('=')
              return parts[0] === 'jwt' ? decodeURIComponent(parts[1]) : r
            }, '') 
          };
      const token = getToken( cookies);
        const decoded = jwt.verify(token ,process.env.JWT_KEY);
        next();
    }
    catch(error){ 
        res.status (401).json({message : "Auth failed"});

    }
}
module.exports = requireAuth