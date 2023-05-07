const pokemons = document.querySelector('.pokemons')
const search = document.querySelector('#search')
const pokemonImage = document.querySelector('.pokemon-image')
const pokemonInfo = document.querySelector('.pokemon-info')
const code = document.querySelector('.code')
const name = document.querySelector('.name')
const types = document.querySelector('.types')
const type = document.querySelectorAll('.type')
const modal = document.querySelector('.modal')
const searchInput = document.querySelector('#search')
let shiny = 0


// Cores dos cards dos Pokémons
const colors = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD',
};

// Função que obtem os dados de todos os Pokémons da primeria geração
async function getPokemons() {
    const pokeAPI = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151&offset=0')
    const response = await pokeAPI.json()
    const { results } = response

    for (let i = 0; i < results.length; i++) {
        const url = results[i].url
        const pokemon = await fetch(url)
        const data = await pokemon.json()

        pokemonData(data)
    }
}
getPokemons()

// Função que obtem as imagems dos Pokémons
function getPokemonImages(pokeID, shiny) {
    if (pokeID === 151) enableInput()

    if (shiny) {
        const imageShiny = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${shiny}.png`
        return imageShiny
    }

    const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokeID}.png`

    return image
}

// Função que ativa a barra de pesquisa quando todos os 151 Pokémons já estiverem criado
function enableInput() {
    searchInput.removeAttribute('disabled')
    const loader = document.querySelector('.loader')
    loader.style.opacity = 0
}

// Formata os dados de todos os Pokémons
function pokemonData(data) {
    const pokemonName = data.name
    const pokemonID = data.id
    const pokemonType = data.types.map((e) => e.type.name)

    const pokemonStatus = { pokemonName, pokemonID, pokemonType }

    pokemonCardGenerator(pokemonStatus)
}

// Gera os cards dos Pokémons
async function pokemonCardGenerator(data) {
    const { pokemonName, pokemonID, pokemonType } = data

    const div = document.createElement('div')
    div.classList.add('pokemon-card')
    div.setAttribute('data-id', pokemonID)
    const color = colors[pokemonType[0]]
    div.style.backgroundColor = color
    pokemons.appendChild(div)

    pokemonType.forEach((type, index) => {
        div.setAttribute(`data-type${index + 1}`, type)
    })

    const img = document.createElement('img')
    img.setAttribute('src', `${await getPokemonImages(pokemonID)}`)
    div.appendChild(img)

    const divPokemonInfo = document.createElement('div')
    divPokemonInfo.classList.add('pokemon-info')
    div.appendChild(divPokemonInfo)

    const h2Identifier = document.createElement('h2')
    h2Identifier.classList.add('identifiers')
    h2Identifier.innerHTML = `#${pokemonID.toString().padStart(3, '0')} - ${pokemonName[0].toUpperCase() + pokemonName.substring(1)}`
    divPokemonInfo.appendChild(h2Identifier)

    const divTypes = document.createElement('div')
    divTypes.classList.add('types')
    divPokemonInfo.appendChild(divTypes)

    pokemonType.forEach(type => {
        const spanType = `<p class="type">${type[0].toUpperCase() + type.substring(1)}</p> `
        divTypes.innerHTML += spanType
    })

    selectPokemonType()
}

// Função que pega os dados dos Pokémons para o modal
async function getPokemonModal(name) {
    const pokeAPI = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
    const response = await pokeAPI.json()

    const pokemonName = response.name
    const pokemonID = response.id
    const pokemonHeight = response.height
    const pokemonWeight = response.weight
    const pokemonType = response.types.map((e) => e.type.name)
    const hp = response.stats[0].base_stat
    const attack = response.stats[1].base_stat
    const defense = response.stats[2].base_stat
    const specialAttack = response.stats[3].base_stat
    const specialDefense = response.stats[4].base_stat
    const speed = response.stats[5].base_stat

    return {
        pokemonName,
        pokemonID,
        pokemonHeight,
        pokemonWeight,
        pokemonType,
        hp,
        attack,
        defense,
        specialAttack,
        specialDefense,
        speed
    }
}

// Evento que abre o modal e inseri os dados dos pokémons nele
pokemons.addEventListener('click', async (e) => {
    const element = e.target
    const parentElement = element.closest('.pokemon-card')
    const loading = document.querySelector('.loading')

    if (parentElement === null) return

    loading.style.display = "block"
    const getAttribute = parentElement.getAttribute('data-id')
    const modalData = await getPokemonModal(getAttribute)

    modal.innerHTML =
        `
            <div class="modal-info" data-id="${modalData.pokemonID}">
                <div class="pokemon">
                    <img src="${await getPokemonImages(getAttribute)}" alt="">
                    <h2>#${modalData.pokemonID.toString().padStart(3, '0')} - ${modalData.pokemonName[0].toUpperCase() + modalData.pokemonName.substring(1)}</h2>
                    <p class="modal-type">${modalData.pokemonType.join(' / ').toUpperCase()}</p>

                    <i class="fa-regular fa-star"></i>
                </div>
                
                <div class="status">
                    <h2>Status</h2>
                    <hr>
                    <p><strong>Ataque:</strong> ${modalData.attack}</p>
                    <p><strong>Defesa:</strong> ${modalData.defense}</p>
                    <p><strong>Ataque Especial:</strong> ${modalData.specialAttack}</p>
                    <p><strong>Defesa Especial:</strong> ${modalData.specialDefense}</p>
                    <p><strong>Peso:</strong> ${modalData.pokemonWeight}</p>
                    <p><strong>Altura:</strong> ${modalData.pokemonHeight}</p>
                </div>

                <i class="fa-solid fa-xmark"></i>
            </div>
        `

    const modalInfo = document.querySelector('.modal-info')
    const color = colors[modalData.pokemonType[0]]
    modalInfo.style.backgroundColor = `${color}`

    setTimeout(() => {
        modalInfo.style.animation = "openModal .3s"
        modal.style.animation = "openOpacity .3s"
        modal.style.visibility = 'visible'
        loading.style.display = "none"
    }, 1000)

    const star = document.querySelector('.fa-star')
    star.addEventListener('click', shinyVersion)
    shiny = 0
})

// Função que altera a versão do Pokémon para shiny
function shinyVersion(element) {
    const star = document.querySelector('.fa-star')

    if (shiny === 0) {
        star.classList.replace('fa-regular', 'fa-solid')
        const pokemonModalInfo = element.target.closest('.modal-info')
        const getPokemonID = pokemonModalInfo.getAttribute('data-id')
        const img = pokemonModalInfo.querySelector('img')
        const imgShiny = getPokemonImages(null, getPokemonID)
        img.src = imgShiny
        shiny = 1

        return
    }

    star.classList.replace('fa-solid', 'fa-regular')
    const pokemonModalInfo = element.target.closest('.modal-info')
    const getPokemonID = pokemonModalInfo.getAttribute('data-id')
    const img = pokemonModalInfo.querySelector('img')
    const imgShiny = getPokemonImages(getPokemonID, null)
    img.src = imgShiny
    shiny = 0
}

// Evento que fecha o modal
modal.addEventListener('click', element => {
    const target = element.target

    if (target.classList.contains('modal') || target.classList.contains('fa-xmark')) {
        const modalInfo = document.querySelector('.modal-info')
        modalInfo.style.animation = "closeModal .3s"
        modal.style.animation = "closeOpacity .3s"

        setTimeout(() => {
            modal.style.visibility = 'hidden'
        }, 300)
    }
})

// Evento que busca os pokémons na barra de pesquisa
/* searchInput.addEventListener('input', busca)
let counter
function busca() {
    const searchInputValue = searchInput.value.toLowerCase()
    const identifiers = document.querySelectorAll('.identifiers')
    const none = document.querySelector('#none')

    none.checked = true
    selectPokemonType()

    if (searchInputValue != '') {
        for (let h2 of identifiers) {
            const h2Text = h2.textContent.toLowerCase()

            if (h2Text.includes(searchInputValue)) {
                const father = h2.closest('.pokemon-card')
                father.style.display = 'flex'
            } else {
                const father = h2.closest('.pokemon-card')
                father.style.display = 'none'
            }
        }
    } else {
        for (let h2 of identifiers) {
            const father = h2.closest('.pokemon-card')
            father.style.display = 'flex'
        }
    }
} */

searchInput.addEventListener('input', searchPokemon)
let dlaySearch
function searchPokemon() {
    clearTimeout(dlaySearch)
    dlaySearch = setTimeout(() => {

        console.log('a');
        const searchInputValue = searchInput.value.toLowerCase()
        const identifiers = document.querySelectorAll('.identifiers')
        const none = document.querySelector('#none')

        none.checked = true
        selectPokemonType()

        if (searchInputValue != '') {
            for (let h2 of identifiers) {
                const h2Text = h2.textContent.toLowerCase()

                if (h2Text.includes(searchInputValue)) {
                    const father = h2.closest('.pokemon-card')
                    father.style.display = 'flex'
                } else {
                    const father = h2.closest('.pokemon-card')
                    father.style.display = 'none'
                }
            }
        } else {
            for (let h2 of identifiers) {
                const father = h2.closest('.pokemon-card')
                father.style.display = 'flex'
            }
        }
    }, 300)
}

// Função que filtra os Pokémons por tipo
function selectPokemonType() {
    const pokemonCard = document.querySelectorAll('.pokemon-card')
    const radioChecked = document.querySelector('input[name="pokemon-type"]:checked')
    const radioType = radioChecked.id
    const radio = document.querySelectorAll('[name="pokemon-type"]')

    radio.forEach(element => {
        if (element.checked === true) {
            const radioChecked = element.closest('label')
            const label = radioChecked.closest('label')

            label.style.backgroundColor = '#A4B7BB'
            label.style.backgroundColor = '#A4B7BB'

            label.style.color = 'white'
        } else {
            const radioChecked = element.closest('label')
            const label = radioChecked.closest('label')

            label.style.backgroundColor = '#E8ECED'
            label.style.color = 'black'
        }
    })

    pokemonCard.forEach(element => {
        const pokemonType1 = element.getAttribute('data-type1')
        const pokemonType2 = element.getAttribute('data-type2')

        if (radioType === pokemonType1 || radioType === pokemonType2) {
            element.style.display = 'block'
        } else {
            element.style.display = 'none'
        }

        if (radioType === 'none') {
            element.style.display = 'block'
        }
    })
}