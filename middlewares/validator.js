import joi from 'joi'

const validator = (req,res,next)=>{
    const{email,password}=req.body
    console.log(email,password)
    const schema = joi.object({
        name:joi.string().required().alphanum().min(3).max(30),
        email:joi.string().email({minDomainSegments:2,tlds:{allow:['com','net']}}).required().alphanum().min(3).max(30),
        password:joi.string().required(),
    })
    try{
        const value = schema.validate(password)
        console.log(value)
    }
    catch(err){
        return res.status(400).json({error: err.detail})
    }
    next()
}
export default validator