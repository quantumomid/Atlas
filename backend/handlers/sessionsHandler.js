import getCurrentUser from './helperFunctions/getCurrentUser.js'


export default async function sessionsHandler(server, client){

    // handles checking whether user is currently logged in - is cookie valid
    const user = await getCurrentUser(server, client)
    // console.log("user.....", user)
    const isLoggedIn = (user) ? true : false
    
    await server.json({isLoggedIn})
}