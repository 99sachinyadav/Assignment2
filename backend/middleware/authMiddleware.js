import jwt from 'jsonwebtoken';

 
const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization
  ) {
    try {
   
      token = req.headers.authorization.split(' ')[1];

     console.log(token)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user ID from token payload to request object
      req.userId = decoded.id;

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
 
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

export { protect };
