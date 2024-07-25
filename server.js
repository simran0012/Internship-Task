import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import db from "./model/db.js"
import mongodb from "./model/db.js"
import morgan from 'morgan'
import userRoutes from './routes/userRoutes.js'

const app=express()
app.use(cors())
mongodb()

//middleware
app.use(express.json())

//app.use(express.urlencoded({extended:true}))
app.use(morgan('dev'))

app.use('/api/users',userRoutes)

app.listen(3000,()=>console.log("Server Running"))


