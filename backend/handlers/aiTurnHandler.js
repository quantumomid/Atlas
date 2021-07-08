


async function aiTurnHandler(server) {
    console.log('AI turn triggered')

    const aiFinished = true

    await server.json({aiFinished})
}

export default aiTurnHandler