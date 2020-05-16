import express from 'express'
import path from 'path'
import hbs from 'hbs'
import router from './routers/chat'

const app = express()

const publicDir = path.join(__dirname, '../public')
const viewsDir = 'templates/views'
const partialsDir = 'templates/partials'

app.set('view engine', 'hbs')
app.set('views', viewsDir)
hbs.registerPartials(partialsDir)

app.use(express.static(publicDir, { extensions: ["html"] }))
app.use(express.json())
app.use(router)

export default app