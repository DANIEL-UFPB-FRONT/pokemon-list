const state = {
    pokemonRootContainerEnable: false,
}
const API_URL = 'https://pokeapi.co/api/v2/type/'

const viewPokemonData = async (event) => {
    const pokemon = document.getElementById('selectPokemonList').value
    if (pokemon === 'default') {
        (document.getElementById('predata') && document.getElementById('predata').remove())
        return
    }
    
    let data = document.getElementById('predata')
    if (!data) {
        data = document.createElement('pre')
        data.id = 'predata'
    }
    
    const pokemonDataRaw = await fetch(`${pokemon}`)
    const pokemonData = await pokemonDataRaw.json()
    data.innerHTML = `
    Abilities: ${pokemonData.abilities.reduce((accumulator, element) => { return `${element.ability.name} ${accumulator}`},"")}
    Name: ${pokemonData.name}
    Height: ${pokemonData.height}
    Weight: ${pokemonData.weight}
    Species: ${pokemonData.species.name}
    Base Experience: ${pokemonData.base_experience}
    `
    document.getElementById('pokemonRootContainer').append(data)
}


const buildPokemonRootContainer = async (types) =>{

    //Root container


    if(!document.getElementById('pokemonRootContainer')){

        const pokemonRootContainer = document.createElement('div')
        pokemonRootContainer.setAttribute("id", "pokemonRootContainer")
        const cabecalhoPokemon = document.createElement('h2')
        cabecalhoPokemon.id = 'selectpokemon'
        cabecalhoPokemon.textContent = 'Choose type'
        pokemonRootContainer.append(cabecalhoPokemon)
        document.body.append(pokemonRootContainer)
    
    
        //Selection list
        const selectPokemon = document.createElement('select');
        selectPokemon.id = 'selectPokemonList'
        pokemonRootContainer.append(selectPokemon)
        // selectPokemon.append(pokemonDefault)


        
        //Info buttom
        const searchButtom = document.createElement('input')
        searchButtom.type = 'submit'
        searchButtom.value = 'See info'
        searchButtom.id = 'seeInfo'
        pokemonRootContainer.append(searchButtom)
        document.getElementById('seeInfo').addEventListener('click', viewPokemonData)
    }

    const pokemonList = document.getElementById('selectPokemonList')
    // Clear list and populate again
    pokemonList.textContent = ''
    const pokemonDefault = document.createElement('option')
    pokemonDefault.id = 'pokemonDefault'
    pokemonDefault.value = 'default'
    pokemonDefault.innerText = 'Loading pokemons...'
    pokemonList.append(pokemonDefault)

    //Populate list
    pokemonData = await fetch(`${types}`)
    pokemons = await pokemonData.json()
    pokemons.pokemon.forEach(pokemonItem => {
        const pokemonOption = document.createElement('option')
        pokemonOption.innerText = pokemonItem.pokemon.name
        pokemonOption.value = pokemonItem.pokemon.url
        pokemonList.append(pokemonOption)
    });
    pokemonDefault.innerText = 'Choose a pokemon...'

}

const destroyPokemonRootContainer = () =>{
    if(document.getElementById('pokemonRootContainer'))
        document.getElementById('pokemonRootContainer').remove()

    if(document.getElementById('seeInfo')){
        document.getElementById('seeInfo').removeEventListener('click', viewPokemonData)
    }
}


async function loadTypes() {
    const typesData = await fetch(API_URL)
    const types = await typesData.json()
    const selectTypes = document.getElementById('select-types')
    types.results.forEach(item => {
        const typesOptions = document.createElement('option')
        typesOptions.innerText = item.name
        typesOptions.value = item.url
        selectTypes.append(typesOptions)
    });

    const typeDefault = document.getElementById('default-types')
    typeDefault.innerText = 'Loading Types...'
    
}

async function addPokemonList(types) {
    state.pokemonRootContainerEnable ?
        buildPokemonRootContainer(types) :
        destroyPokemonRootContainer()
}

async function selectType() {
    const selectedTypes = document.getElementById("select-types").value;
    state.pokemonRootContainerEnable = !(selectedTypes === "default")
    addPokemonList(selectedTypes)
}

window.addEventListener('load', loadTypes)
document.getElementById('select-types').addEventListener('change', selectType)
