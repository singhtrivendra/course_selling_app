const {Router} = require("express");
const adminRouter = Router();
const {adminModel} = require("../db");
const {courseModel} = require("../db")
const jwt = require("jsonwebtoken");
// brcypt,zod ,jwt
const {JWT_ADMIN_PASSWORD} = require("../config");  
const { adminMiddleware } = require("../middleware/admin");
adminRouter.post("/signup", async function(req, res) {
    const { email, password, firstName, lastName } = req.body; 
    await adminModel.create({
        email: email,
        password: password,
        firstName: firstName, 
        lastName: lastName
    })
    
    res.json({
        message: "Signup succeeded"
    })
})
adminRouter.post("/signin", async function(req,res){
    const {email,password} = req.body;

    const admin = await adminModel.findOne({
        email:email,
        password:password,
    });
     if (admin){
       const token = jwt.sign({
            id:admin._id, 
        },JWT_ADMIN_PASSWORD);
        res.json( {
            token:token
        });
    } else {
        res.status(403).json( {
            message:"Invalid email or password"
        })
    }
});

adminRouter.get("/purchase",function(req,res){
    res.json( {
        message:"you are signed up"
    });
}   );
adminRouter.post("/course", adminMiddleware, async function(req, res) {
    const adminId = req.userId;   // to decode middleware

    const { title, description, imageUrl, price } = req.body;

    // creating a web3 saas in 6 hours video on youtube -> create pipelines how to image directly by user
    const course = await courseModel.create({
        title: title, 
        description: description, 
        imageUrl: imageUrl, 
        price: price, 
        creatorId: adminId
    })

    res.json({
        message: "Course created",
        courseId: course._id
    })
})

adminRouter.put("/course",adminMiddleware, async function(req,res){
    const adminId = req.userId;
    const {title,description,imageUrl,price,courseId} = req.body;
    const course =  await courseModel.updateOne({
        _id : courseId,  // flying beast
        creatorId:adminId // dhruv rathi
    },{
        
        title:title,
        description:description,
        imageUrl:imageUrl,
        price:price,
    });
    res.json( {
        message:"course Updated successfully",
        courseId:course._id
    });
});  
adminRouter.get("/course/bulk",adminMiddleware,async  function(req,res){    
    const adminId = req.userId;
    const courses =  await courseModel.find({
            creatorId:adminId
    });     
    res.json( {
        message:"course details",
        courses
    });
});
module.exports ={   
    adminRouter : adminRouter
}

