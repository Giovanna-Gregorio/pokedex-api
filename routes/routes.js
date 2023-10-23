module.exports = (app) => {
    app.route('/pokemons')
        .get(app.api.pokemon.get)

    app.route('/pokemon/:id')
        .get(app.api.pokemon.getById)

    app.route('/capture')
        .post(app.api.pokemon.saveCapture)
}