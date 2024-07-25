import bcrypt from 'bcrypt'
import userModel from '../model/model.js'
import jwt from 'jsonwebtoken'
import transporter from '../Email/emailconfiguration.js'


class UserController{
    static userRegistration = async(req,res)=>{
        const {name,email,password,c_password,tc} = req.body
        const user = await userModel.findOne({email:email})
        if(user){
            res.send({"status":"failed","message":"Email already Registered"})
        }
        else{
            if(name && email && password && c_password && tc){
                if( password === c_password){
                    try{
                        const salt=await bcrypt.genSalt(10)
                        const hashPassword = await bcrypt.hash(password,salt)
                        console.log(name,email,password,tc,hashPassword,salt)
                        const doc= new userModel({
                            name,
                            email,
                            password: hashPassword,
                            tc
                        });
                        await doc.save()
                        const saved_user = await userModel.findOne({email:email})
                        //generate token 
                        const token= jwt.sign({UserID: saved_user._id},"secretkey",{expiresIn:'30m'})
                        res.send({"status":"success","message":"Registration Successful","token":token})
                    }
                    catch(error){
                        res.send({status:'failed','message':error})
                    }
                }
                else{
                    res.send({"status":"failed","message":"Password and Confirm Password does not match"})
                }
            }
            else{
                res.send({"status":"failed","message":"All fields are required"})
            }
        }
    }
    static userLogin = async(req,res)=>{
            try{
                const {email, password}=req.body
                if(email && password){
                    const user = await userModel.findOne({email:email})
                    if (user){
                        const isMatch = await bcrypt.compare(password,user.password)
                        if(isMatch){
                            //generatetoken
                            const token = jwt.sign({UserID: user._id},"secretkey",{expiresIn :'30m'})
                            res.send({"status":"success","message":"Login Successful","token":token})
                        }
                        else{
                            res.send({"status":"failed","message":"Invalid Password or Email"})
                        }
                    }
                    else{
                        res.send({"status":"failed","message":"Invalid Email"})
                    }
                }
                else{
                    res.send({"status":"failed","message":"All fields are required"})
                }
            }
            catch(error){
                res.send({"status":"failed","message":"Unable to Login","error":error})
            }
    }
    static changeUserPassword = async(req,res)=>{
        const {password,c_password,token}=req.body
        console.log(password,c_password,req.user)
        if(password && c_password){
            if(password === c_password){
                const salt = await bcrypt.genSalt(10)
                const hashPassword = await bcrypt.hash(password, salt)
                const user = await userModel.findOneAndUpdate({_id: req.user._id},{password:hashPassword})
                console.log(user)
                if(user){
                res.send({"status":"success","message":"Password Changed successfully"})}
                else{
                res.send({"status":"failed","message":"Password not changed"})
                }
            }
            else{
            res.send({"status":"failed","message":"Password and Confirm Password does not match"})
            }
        }
        else{
            res.send({"status":"failed","message":"All fields are required"})
        }
    }

    static loggedUser = async(req,res)=>{
        res.send({"user":req.user})
    }

    static userPasswordReset=async(req,res)=>{
        const {password,c_password}=req.body
        const {id,token}=req.params
        const user=await userModel.findById(id)
        console.log(user)
        try{
            if(password && c_password){
                if(password===c_password){
                    const salt=await bcrypt.genSalt(10)
                    const hashPassword = await bcrypt.hash(password,salt)
                    const updated_user=await userModel.findIdAndUpdate(id,{"password":hashPassword},{new:true})
                    console.log(updated_user)
                    res.send({"status":"success","message":"Password changed Successfully"})
                }
                else{
                    res.send({"status":"failed","message":"Password and Confirm Password does not match"})
                }
            }
            else{
                res.send({"status":"failed","message":"All fields are required"})
            }
        }
        catch(err){
            console.log(err)
            res.send({"status":"failed","message":"Unable to change password","error":err})
        }
    }

    static sendUserPasswordEmail = async (req, res) =>{
        const { email } = req.body
        console.log(email)
        const user = await userModel.findOne({ email: email })
        if (user) {
            const token = jwt.sign({ id: user._id }, "secretkey")
            const link = `http://localhost:3000/user/reset-pass/${user._id}/${token}`
            const info = async()=>{
                await transporter.sendMail(
                    {
                        from: "wN5bV@example.com",
                        to: email,  
                        subject: "Reset Password",
                        html: `<a href=${link}>Click here to reset password</a>`
                    }
                )
            }
            info()
            res.send({ "status": "success", "message": "Password reset link sent to your email" })
        }
        else{
            res.send({ "status": "failed", "message": "Invalid Email or user not registered" })
        }
    }
}
export default UserController