import User from "../model/User.model.js";

const isAdmin = async (req,res,next) =>{
    const apiUser = req.apiUser;
    const user = await User.findById(apiUser.id, '-password');
    
    if(!user || (user.role!=='admin')) return res.status(401).send({message:"Dont have an accesss " })

    console.log("Admin details : ", user);
    next();
}

export default isAdmin;