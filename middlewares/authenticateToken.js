import envVars from 'dotenv';
envVars.config();
import jwt from 'jsonwebtoken';

function authenticateToken(req, res, next) {
	let token = req.headers["x-access-token"] || req.headers.authorization || req.body.token;
	if(!token || !token.startsWith("Bearer ")) {
		return res.status(401).json({
			status: false,
			message: "Sorry, you must provide a token."
		});
	}
	
	token = token.slice(7, token.length).trimLeft();
	try {
		req.apiUser = jwt.verify(token, process.env.SECRET_KEY);
		res.locals.apiUser = req.apiUser;
		next();
	} catch (error) {
		res.status(401).json({
			error : error.message,
			status: false,
			message: "Sorry, you must provide a valid token."
		});
	}
}


export default authenticateToken;