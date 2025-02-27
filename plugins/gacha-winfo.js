import { promises as fs } from 'fs';

const pokemonFilePath = './src/database/pokemon.json';
const caughtPokemonFilePath = './src/database/caught.json';

async function loadPokemon() {
    try {
        const data = await fs.readFile(pokemonFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        throw new Error('No se pudo cargar el archivo pokemon.json.');
    }
}

async function loadCaughtPokemon() {
    try {
        const data = await fs.readFile(caughtPokemonFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

let handler = async (m, { conn, args }) => {
    if (args.length === 0) {
        await conn.reply(m.chat, '《✧》Debes especificar un Pokémon para ver su información.\n> Ejemplo » *#pinfo Pikachu*', m);
        return;
    }

    const pokemonName = args.join(' ').toLowerCase().trim();

    try {
        const pokedex = await loadPokemon();
        const pokemon = pokedex.find(p => p.name.toLowerCase() === pokemonName);

        if (!pokemon) {
            await conn.reply(m.chat, `《✧》No se encontró el Pokémon *${pokemonName}*.`, m);
            return;
        }

        const caught = await loadCaughtPokemon();
        const caughtEntry = caught.find(entry => entry.pokemonId === pokemon.id);
        const statusMessage = caughtEntry 
            ? `Capturado por @${caughtEntry.userId.split('@')[0]}` 
            : 'Salvaje';

        const message = `⚡ Nombre » *${pokemon.name}*\n#️⃣ Pokédex » *${pokemon.pokedex}*\n🔥 Tipo » *${pokemon.types.join(', ')}*\n✨ Habilidad » *${pokemon.ability}*\n🔄 Evolución » *${pokemon.evolution}*\n🏆 Estado » ${statusMessage}`;

        await conn.reply(m.chat, message, m, { mentions: [caughtEntry ? caughtEntry.userId : null] });
    } catch (error) {
        await conn.reply(m.chat, `✘ Error al cargar la información del Pokémon: ${error.message}`, m);
    }
};

handler.help = ['pinfo <nombre del Pokémon>'];
handler.tags = ['pokemon'];
handler.command = ['pinfo'];
handler.group = true;
handler.register = true;

export default handler;
