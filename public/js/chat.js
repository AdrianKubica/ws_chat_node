const socket = io()

const redBox = document.querySelector('.red-box')

const moveRedBox = () => {
    const red = parseInt(Math.random() * 255)
    const green = parseInt(Math.random() * 255)
    const blue = parseInt(Math.random() * 255)
    const marginLeft = parseInt(getComputedStyle(redBox).marginLeft)

    redBox.style.backgroundColor = `rgb(${red},${green},${blue})`
    redBox.style.marginLeft = `${marginLeft + 5}px`
}

socket.on('message', (message) => {
    console.log(message)
    moveRedBox()
})

document.querySelector('#message-form').addEventListener('submit', (evt) => {
    evt.preventDefault()
    const message = evt.target.elements.message.value
    socket.emit('sendMessage', message, (error) => {
        if (error) {
            return console.log(error)
        }

        console.log('Message delivered')
    })
})

document.querySelector('#send-location').addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', { latitude: position.coords.latitude, longitude: position.coords.longitude }, () => {
            console.log('Location shared')
        })
    })
})