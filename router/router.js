import envVars from 'dotenv';
envVars.config();
import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../model/User.model.js'
import Product from '../model/products.model.js';
import bcrypt from 'bcrypt';
import { checkRole } from '../../e-school/server/middlewares/verifyUser.js';
import authenticateToken from '../middlewares/authenticateToken.js';
import isAdmin from '../middlewares/isAdmin.js';

const router = express.Router();


// ---------------  Non-protected URLS  ---------------------------------------------------------------------------------------


router.get("/", (req, res) => {
    res.status(200).send(`<h1>Welcome to store</h1> 
    <pre>   Methods	  Urls	          Actions 
    POST    /api/auth/signup	signup new account 
    POST    /api/auth/signin	login an account 
    GET	    /api/test/all	retrieve public content 
    GET	    /api/test/user	access User’s content 
    GET	    /api/test/mod	access Moderator’s content 
    GET	    /api/test/admin	access Admin’s content</pre>`);
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) return res.status(500).json({ status: "failed", message: "user not found" });
        
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) return res.status(401).send({ accessToken: null, message: "Invalid Password!" });
        
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: 600 });    // Token expires in 600sec = 10 min  
        res.status(200).send({ user, token });
        
    } catch (error) {
        console.log("error in /login");
        res.status(500).json({ status: "failed", message: error.message });
    }
});

router.post("/signup", checkRole, async (req, res) => {
    try {
        const { username, email, role } = req.body;
        
        const isEmailExist = await User.findOne({ email });
        if (isEmailExist) {
            console.log("Duplicate Email Found!");
            return res.status(400).json({ message: "Failed! Email is already in use!" });
        }
        
        const user = new User({
            username, email,
            password: bcrypt.hashSync(req.body.password, 10),
            role: role.toLowerCase()
        });
        await user.save();
        console.log("user added succesfully ! ", user);
        
        res.status(200).json({
            status: "success",
            message: "SignUp Succesful",
            userDetails: user,
        });
    } catch (error) {
        console.log("error in /signup");
        res.status(500).json({ status: "failed", message: error.message });
    }
});

router.get('/products', async (req, res) => {
    try {
        const allProducts = await Product.find();
        res.status(200).json(allProducts);
    } catch (error) {
        res.status(500).send("Failed to get all Products")
    }
})

router.get('/product/:_id', async (req, res) => {
    try {
        const allProducts = await Product.findById(req.params._id);
        res.status(200).json(allProducts);
    } catch (error) {

    }
})


// ---------------  Admin Protected URLS  ---------------------------------------------------------------------------------------


router.get('/users', authenticateToken, isAdmin, async(req,res)=> {
    // console.log(req.apiUser);
    // console.log(res.locals.apiUser);

    const allUsersData = await User.find();
    res.send(allUsersData);
})

router.post("/addProduct", authenticateToken, isAdmin,  async (req, res) => {
    try {
        const { name, image, price } = req.body
        const product = new Product({ name, image, price });
        await product.save();
        res.status(200).json(product);
    } catch (error) {
        res.status(500).send("Failed to add Product");
    }
})

router.delete("/deleteProduct/:_id", authenticateToken, isAdmin,  async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params._id);
        if(!product) return res.status(200).send({status:"failed", message:"Product with given id not found"});
        res.status(200).json({
            status: "success", message: "Product deleted succesfully!",
            deletedProductDetails: product
        });
    } catch (error) {
        res.status(500).send("Failed to get delete Products");
    }
})

router.patch("/updateProduct/:_id", authenticateToken, isAdmin,  async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params._id, req.body);
        if(!product) return res.status(400).send({message:"product not found"})
        console.log(product);
        res.status(200).json({
            status: "success", message: "Product updated succesfully!",
            updatedProductDetails: product
        });
    } catch (error) {
        res.status(500).send({message: "Failed to update Product", error});
    }
});


export default router;