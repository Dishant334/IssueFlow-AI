import express from 'express'
import protect from '../authMiddleWare/protect.js'
import { home } from '../controllers/homeController.js'

const homeRoute=express.Router()

homeRoute.get('/workspace/:workspaceid/home',protect,home)

export default homeRoute