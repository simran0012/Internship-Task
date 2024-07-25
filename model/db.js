import mongoose from "mongoose"

const mongodb= async()=>{mongoose.connect('mongodb+srv://Simran123:simran123@cluster0.tymiinj.mongodb.net/loginDatabase?retryWrites=true&w=majority&appName=Cluster0')
const db= mongoose.connection
db.on("connected",()=>{
    console.log("Database connected")
})
db.on("error",()=>{
    console.log("Database not connected")
})
db.on("disconnected",()=>{
    console.log("Database disconneced")
})
}

export default mongodb;