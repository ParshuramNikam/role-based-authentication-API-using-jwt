import User from '../model/User.model.js';

export const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export const checkEmail = async (req, res, next) => {
    try {
        if(!validateEmail(req.body.email)) return res.status(400).json({ message: "Please, Enter a valid email !" });

        const user = await User.findOne({ email: req.body.email })
        if (user) {
            console.log("Duplicate Email Found!");
            return res.status(400).json({ message: "Failed! Email is already in use!" });
        }
        next();

    } catch (error) {
        console.log("error in checkEmail");
        res.send(500).json({ status: "failed", error: error.message })
    }
}

export const checkRole = async (req,res,next) => {
    try {
        if( req.body.role!==undefined && req.body.role !== 'user' && req.body.role !== 'admin'){
            console.log(`Invalid Role Found!  Role in request : ${req.body.role}`);
            res.status(400).json({ message: "Invalid Role Found!" });
            return;
        }
        if (req.body.role === undefined) req.body.role = "user";
		
        next();
    } catch (error) {
        console.log("error in checkRole");
        res.send(500).json({ status: "failed", error: error.message })
    }
}