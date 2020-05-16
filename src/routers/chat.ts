import express from 'express'

const router = express.Router()

router.get('/', async (req, res) => {
    res.render('index', {
        name: 'Chat App'
    })
})

export default router
