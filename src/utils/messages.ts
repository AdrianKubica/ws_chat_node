export const generateMessage = (text: string, username: string) => {
    return {
        text,
        createdAt: new Date().getTime(),
        username
    }
}

export const generateLocationMessage = (url: string, username: string) => {
    return {
        url,
        createdAt: new Date().getTime(),
        username
    }
}