import express from 'express'

const router = express.Router()

router.get('/', async (req, res) => {
    res.render('index', {
        name: 'Chat App'
    })
})

router.get('/chat', async (req, res) => {
    res.render('chat', {
        name: 'Chat App'
    })
})

router.get('*', async (req, res) => {
    res.render('404', {
        name: 'Chat App'
    })
})

export default router
