import { promises as fs } from 'fs';

const pokemonFilePath = './src/database/pokemon.json';

async function loadPokemon() {
    try {
        const data = await fs.readFile(pokemonFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        throw new Error('❀ No se pudo cargar el archivo pokemon.json.');
    }
}

let handler = async (m, { conn, args }) => {
    const pokemonName = args.join(' ').toLowerCase().trim();

    try {
        const pokemons = await loadPokemon();
        const pokemon = pokemons.find(p =>
            p.name.toLowerCase() === pokemonName || (p.aliases && p.aliases.includes(pokemonName))
        );

        if (!pokemon) {
            await conn.reply(m.chat, `《✧》No se ha encontrado el Pokémon *${pokemonName}*. Asegúrate de que el nombre esté correcto.`, m);
            return;
        }

        // Seleccionar un video aleatorio
        const randomVideo = pokemon.vid[Math.floor(Math.random() * pokemon.vid.length)];

        const message = `❀ Nombre » *${pokemon.name}*
⚥ Género » *${pokemon.gender}*
❖ Tipo » *${pokemon.type}*
✦ Región » *${pokemon.region}*`;

        await conn.sendFile(m.chat, randomVideo, `${pokemon.name}.mp4`, message, m);
    } catch (error) {
        await conn.reply(m.chat, `✘ Error al cargar el video del Pokémon: ${error.message}`, m);
    }
};

handler.help = ['pokevideo <nombre del Pokémon>'];
handler.tags = ['pokemon'];
handler.command = ['pokevideo', 'pkmvideo', 'pvideo'];
handler.group = true;
handler.register = true;

export default handler;
