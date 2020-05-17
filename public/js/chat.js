const socket = io()

// socket.on('countUpdated', (count) => {
//     console.log('The count has been updated', count)
// })

// document.querySelector('#increment').addEventListener('click', () => {
//     console.log('Clicked')
//     socket.emit('increment')
// })

const msgInput = document.querySelector('#msg')
const redBox = document.querySelector('.red-box')

socket.on('message', (message) => {
    console.log(message)
    redBox.style.backgroundColor = `rgb(${parseInt(Math.random() * 255)}, ${parseInt(Math.random() * 255)}, ${parseInt(Math.random() * 255)})`
})

document.querySelector('form').addEventListener('submit', (evt) => {
    evt.preventDefault()
    const chatMsg = msgInput.value
    socket.emit('chatMsg', chatMsg)
})