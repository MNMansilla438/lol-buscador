const fetch = (...args) => import('node-fetch')
    .then(({ default: fetch }) => fetch(...args));


const busqueda = async (invocador1, invocador2, apiLol, cantidad) => {
    return await queryNames(invocador1, invocador2, apiLol, cantidad);
}

const queryNames = async (invocador1, invocador2, apiLol, cantidad) => {
    // Buscar id unico de los invocadores
    const puuid = await fetch(`https://la2.api.riotgames.com/lol/summoner/v4/summoners/by-name/${invocador1}?api_key=${apiLol}`);
    const getPuuidSummon1 = await puuid.json();
    const puuid2 = await fetch(`https://la2.api.riotgames.com/lol/summoner/v4/summoners/by-name/${invocador2}?api_key=${apiLol}`);
    const getPuuidSummon2 = await puuid2.json();

    //Extraer id unico
    const resultSummon1 = getPuuidSummon1["puuid"];
    const resultSummon2 = getPuuidSummon2["puuid"]

    if (resultSummon1 && resultSummon2) {
        return await getIdMatchs(invocador1, invocador2, apiLol, cantidad, resultSummon1);
    } else {
        if (!resultSummon1) {
            return [`no existe el invocador ${invocador1}`, false];
        } else {    
            return [`no existe el invocador ${invocador2}`, false];
        }
    }
}

const getIdMatchs = async (invocador1, invocador2, apiLol, cantidad, resultSummon1) => {
    //Buscar Ultimos juegos
    const getUsername = await fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${resultSummon1}/ids?start=0&count=${cantidad}&api_key=${apiLol}`);
    const response = await getUsername.json();
    return await orderGames(invocador1, invocador2, apiLol, [response]);
    
}

const orderGames = async (invocador1, invocador2, apiLol, [response]) => {
    // asignar los id para buscar partidas
    const matchs = [];
    response.forEach(idMatch => {
        matchs.push(`https://americas.api.riotgames.com/lol/match/v5/matches/${idMatch}?api_key=${apiLol}`);
    });

    return await matchFound(invocador1, invocador2, matchs);
}

const matchFound = async (invocador1, invocador2, response) => {
    // ganadas, peridas y total
    let matches = [];
    let ganadas = 0;
    let perdidas = 0;
    let count = 0;

    for (const buscar of response) {
        const getPart = await fetch(buscar);
        const getPart2 = await getPart.json();
        const resultados = await getPart2["info"]['participants'];

        for (const summ1 of resultados) {
            if (summ1["summonerName"] == invocador1) {
                const player1 = {
                    "Nombre invocador": summ1["summonerName"],
                    "Campeon": summ1["championName"],
                    "Asesinatos": summ1["kills"],
                    "Muertes": summ1["deaths"],
                    "Asistencias": summ1["assists"],
                    "Gano?": summ1["win"],
                    "Aliado": summ1["teamId"]
                };
                for (const summ2 of resultados) {
                    if (summ2["summonerName"] == invocador2) {
                        const player2 = {
                            "Nombre invocador": summ2["summonerName"],
                            "Campeon": summ2["championName"],
                            "Asesinatos": summ2["kills"],
                            "Muertes": summ2["deaths"],
                            "Asistencias": summ2["assists"],
                            "Aliado": summ2["teamId"]
                        };
                        matches.push([player1, player2]);
                        if (summ1["win"] == true) {
                            ganadas += 1;
                            count += 1;
                        } else {
                            perdidas += 1;
                            count += 1;
                        }
                    }
                }

            }
        }
    }
    return [matches, [ganadas, count, perdidas]];
}


module.exports.BusquedaServices = {
    busqueda,
}