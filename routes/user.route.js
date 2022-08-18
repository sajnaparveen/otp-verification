const router = require("express").Router();
const userSchema = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { twilio } = require('../middleware/twiliosms')

let globalOtp = 0;

router.post("/register", async (req, res) => {
    try {
  
      const username = req.body.username;
      const email = req.body.email;
      const mobilenumber = req.body.mobilenumber;
      const password = req.body.password;

      if (username && email && mobilenumber && password) {
        let userdetails = await userSchema.findOne({ username: username }).exec();
        let emailid = await userSchema.findOne({ email: email }).exec();
        let phn = await userSchema.findOne({ mobilenumber: mobilenumber }).exec();
        
        if (userdetails) {
          return res.json({
            status: "failure",
            message: "username already exist",
          });
        } else if (emailid) {
          return res.json({ status: "failure", message: "email already exist" });
        } else if (phn) {
          return res.json({
            status: "failure",
            message: "mobileno already exist",
          });
        }
           else {
            
            let otp = Math.floor((Math.random() * 1000) + 1000);
            const message = `Your Social signin OTP is ${otp}`
        
         await twilio(message, mobilenumber, otp, res)
         globalOtp = otp;
            let user = new userSchema(req.body);
            let salt = await bcrypt.genSalt(10);
            user.password = bcrypt.hashSync(password, salt);

            let result = await user.save();
            console.log("result", result);
            return res.status(200).json({
              status: "success",
              message: "user details added  successfully",
            });
        
          }
      } else {
        return res
          .status(400)
          .json({ status: "failure", message: "must include all details" });
      }
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ status: "failure", message: error.message });
    }
  });



  router.post("/sms-verify", async (req, res) => {
    try {
  console.log("globalOtp",globalOtp)
  console.log("otp",req.query.otp)
      if(globalOtp==req.query.otp){
        
        const data = await userSchema.findOne({ email: req.query.email }).exec();
  
        console.log("data", data)
       
          if (data.verifyed) {
              return res.status(200).json({ status: "failure", message:"Your account already verifyed" })
          } else {
              userSchema.findOneAndUpdate({ email: req.query.email }, { verifyed: true }).exec();
              return res.status(200).json( { status: "success", message: "Your account verifyed successfully" })
          }
      }else{
        return res.status(200).json( { status: "failed", message: "wrong otp" })

      }
      
    } catch (error) {
      return res.status(500).json({
        status: "failure",
        message: error.message
      })
    }
  })

  module.exports = router;