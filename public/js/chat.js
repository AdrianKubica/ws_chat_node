const socket = io()

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')

const $locationButton = document.querySelector('#send-location')
const $redBox = document.querySelector('.red-box')

const moveRedBox = () => {
    const red = parseInt(Math.random() * 255)
    const green = parseInt(Math.random() * 255)
    const blue = parseInt(Math.random() * 255)
    const marginLeft = parseInt(getComputedStyle($redBox).marginLeft)

    $redBox.style.backgroundColor = `rgb(${red},${green},${blue})`
    $redBox.style.marginLeft = `${marginLeft + 5}px`
}

socket.on('message', (message) => {
    console.log(message)
    moveRedBox()
})

$messageForm.addEventListener('submit', (evt) => {
    evt.preventDefault()
    $messageFormButton.setAttribute('disabled', 'disabled')
    const message = evt.target.elements.message.value
    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error) {
            return console.log(error)
        }

        console.log('Message delivered')
    })
})

$locationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }

    $locationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', { latitude: position.coords.latitude, longitude: position.coords.longitude }, () => {
            $locationButton.removeAttribute('disabled')
            console.log('Location shared')
        })
    })
})