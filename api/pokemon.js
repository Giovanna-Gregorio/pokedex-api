module.exports = (app) => {
    const axios = require('axios');
    
    const get = async (req, res) => {
        try {
            if(req.query.captured || req.query.name) 
                return filter(req,res);
            else
                return getAll(req,res);
        } catch (err) {
            return res.status(400).json( {
                error: err
            });
        }
    };

    const getAll = async (req, res) => {
        try {
            const response = await axios.get(process.env.BASE_URL_POKEAPI + '?limit=' + req.query.limit + '&offset=' + req.query.offset);

            const captures = await app.database('captures')
                .select('*');
            
            response.data.results.forEach(function(pokemon) {
                pokemon.capture = false;
                pokemon.captureDate = null;
                for (i = 0; i < captures.length; i++) {
                    if(pokemon.url.split("/")[6] == captures[i].id_pokemon) {
                        pokemon.capture = true;
                        pokemon.captureDate = captures[i].date;
                    }
                } 
            });

            return res.status(200).json(response.data);
        } catch (err) {
            return res.status(400).json( {
                error: err
            });
        }
    };

    const filter = async (req, res) => {
        try {
            const response = await axios.get(process.env.BASE_URL_POKEAPI+ '?limit=1292');

            const captures = await app.database('captures')
                .select('*');
            
            response.data.results.forEach(function(pokemon) {
                pokemon.capture = false;
                pokemon.captureDate = null;
                for (i = 0; i < captures.length; i++) {
                    if(pokemon.url.split("/")[6] == captures[i].id_pokemon) {
                        pokemon.capture = true;
                        pokemon.captureDate = captures[i].date;
                    } 
                } 
            });

            if(req.query.captured == 1) { //Capturados
                response.data.results = response.data.results.filter(item => item.capture == true);
            } else if (req.query.captured == 2) { //Não Capturados
                response.data.results = response.data.results.filter(item => item.capture == false);
            }

            if(req.query.name != null) {
                response.data.results = response.data.results.filter(item => item.name.includes(req.query.name));
            }

            response.data.count = response.data.results.length;
            response.data.results = response.data.results.slice(parseInt(req.query.offset), parseInt(req.query.offset) + 12);

            return res.status(200).json(response.data);
        } catch (err) {
            return res.status(400).json( {
                error: err
            });
        }
    };

    const getById = async (req, res) => {
        try {
            const id = req.params.id;

            let data = null;

            await axios.get(`${process.env.BASE_URL_POKEAPI}/${id}`)
                .then(resp => { data = resp.data});

            data.capture = false;
            data.captureDate = null;

            const captured = await app.database('captures')
                .where( { id_pokemon: parseInt(id) }).first();

            if (captured != null) {
                data.capture = true;
                data.captureDate = captured.date;
            }

            return res.status(200).json(data);
        } catch (err) {
            return res.status(500).json( {
                error: err
            });
        }
    };

    const saveCapture = async (req, res) => {
        const capture = { ...req.body };

        const captureExists = await app
            .database('captures')
            .where( {id_pokemon: capture.id_pokemon })
            .first();
        
        if (captureExists) {
            return res.status(400).json( {
                error: "Esse pokemon já foi capturado"
            });
        }

        app 
            .database('captures')
            .insert(capture)
            .then((_) => res.status(200).send({ msg: 'Captura realizada com sucesso.' }))
            .catch((err) => res.status(500).send(err));

    };

    return { get, getById, saveCapture }
}