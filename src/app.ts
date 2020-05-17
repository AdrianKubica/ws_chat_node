import express from 'express'
import path from 'path'
import hbs from 'hbs'
import router from './routers/chat'

const app = express()

const viewsDir = 'templates/views'
const partialsDir = 'templates/partials'

app.set('view engine', 'hbs')
app.set('views', viewsDir)
hbs.registerPartials(partialsDir)

app.use(express.static('public', { extensions: ["html"] }))
app.use(express.json())
app.use(router)

export default app