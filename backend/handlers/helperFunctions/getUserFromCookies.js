import getCurrentUser from "./getCurrentUser.js"

async function getUserFromCookies(server) {
    let user
    const { sessionID, tempUser } = await server.cookies
    if (sessionID) {
        const userData = await getCurrentUser(server)
        if (userData) user = userData.username
        if (!userData) throw new Error('Session has expired. Please log back in to continue or refresh to play as guest.')
    } else if (tempUser) {
        user = tempUser
    } else {
        throw new Error("You should not be here!")
    }

    if (user) return user
    if (!user) return undefined
}

export default getUserFromCookies