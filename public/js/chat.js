const socket = io()

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $messages = document.querySelector('#messages')

const $locationButton = document.querySelector('#send-location')
const $redBox = document.querySelector('.red-box')

const autoscroll = () => {
    const $newMessage = $messages.lastElementChild
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    const visibleHeight = $messages.offsetHeight

    const containerHeight = $messages.scrollHeight

    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

const { username, room} = Qs.parse(location.search, { ignoreQueryPrefix: true })

const moveRedBox = () => {
    const red = parseInt(Math.random() * 255)
    const green = parseInt(Math.random() * 255)
    const blue = parseInt(Math.random() * 255)
    const marginTop = parseInt(getComputedStyle($redBox).marginTop)

    $redBox.style.backgroundColor = `rgb(${red},${green},${blue})`
    $redBox.style.marginTop = `${marginTop + 5}px`
}

socket.on('message', (message) => {
    const div = `
        <div class="message">
            <p>
                <span class="message__name">${message.username}</span>
                <span class="message__meta">${moment(message.createdAt).format('HH:mm:ss')}</span>
                <p>${message.text}</p
            </p>
        </div>
    `
    $messages.insertAdjacentHTML('beforeend', div)
    autoscroll()
    moveRedBox()
})

socket.on('locationMessage', (message) => {
    const div = `
    <div class="message">
        <p>
            <span class="message__name">${message.username}</span>
            <span class="message__meta">${moment(message.createdAt).format('HH:mm:ss')}</span>
            <p><a href=${message.url} target='_blank'>My current location</a></p></p
        </p>
    </div>
`
    $messages.insertAdjacentHTML('beforeend', div)
    autoscroll()
    moveRedBox()
})

socket.on('roomData', ({ room, users }) => {
    console.log(room)
    console.log(users)
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

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})