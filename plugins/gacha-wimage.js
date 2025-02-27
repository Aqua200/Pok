import { promises as fs } from 'fs';

const charactersFilePath = './src/database/characters.json';

async function loadCharacters() {
    try {
        const data = await fs.readFile(charactersFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        throw new Error('❀ No se pudo cargar el archivo characters.json.');
    }
}

let handler = async (m, { conn, args }) => {
    const pokemonName = args.join(' ').toLowerCase().trim();

    try {
        const characters = await loadCharacters();
        const pokemon = characters.find(c => c.name.toLowerCase() === pokemonName);

        if (!pokemon) {
            await conn.reply(m.chat, `《✧》No se ha encontrado el Pokémon *${pokemonName}*. Asegúrate de escribir el nombre correctamente.`, m);
            return;
        }

        // Seleccionar una imagen aleatoria
        const randomImage = pokemon.img[Math.floor(Math.random() * pokemon.img.length)];

        const message = `❀ Nombre » *${pokemon.name}*
⚥ Género » *${pokemon.gender}*
✦ Tipo » *${pokemon.type.join(', ')}*
❖ Región » *${pokemon.region}*
⟿ Evolución » *${pokemon.evolution}*
✨ Fuente » *${pokemon.source}*`;

        await conn.sendFile(m.chat, randomImage, `${pokemon.name}.jpg`, message, m);
    } catch (error) {
        await conn.reply(m.chat, `✘ Error al cargar la imagen del Pokémon: ${error.message}`, m);
    }
};

handler.help = ['pimage <nombre del Pokémon>'];
handler.tags = ['pokemon'];
handler.command = ['pokeimage', 'pimage', 'pkmimage', 'pokemonimage'];
handler.group = true;
handler.register = true;

export default handler;
