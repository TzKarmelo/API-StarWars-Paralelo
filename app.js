const characterList = document.getElementById('lista-personajes');
const planetList = document.getElementById('lista-planetas');
const starshipList = document.getElementById('lista-naves');
const speciesList = document.getElementById('lista-especies');

async function fetchData(url) {
  try {
    const response = await fetch(url);
    return response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function fetchAllData() {
  const characterPromise = fetchData('https://swapi.dev/api/people/');
  const planetPromise = fetchData('https://swapi.dev/api/planets/');
  const starshipPromise = fetchData('https://swapi.dev/api/starships/');
  const speciesPromise = fetchData('https://swapi.dev/api/species/');

  const [characterData, planetData, starshipData, speciesData] = await Promise.all([
    characterPromise,
    planetPromise,
    starshipPromise,
    speciesPromise,
  ]);

  return { characterData, planetData, starshipData, speciesData };
}

function showData(list, data, imageUrlPrefix, altKey, propertyKeys) {
  let output = '';
  data.forEach(item => {
    const imageUrl = `${imageUrlPrefix}${item.url.match(/\d+/)}.jpg`;
    output += `
      <div class="item">
        <img src="${imageUrl}" alt="${item[altKey]}" onerror="this.src='error-image.jpg'; this.classList.add('error')">
        <h3>${item[altKey]}</h3>
        ${propertyKeys.map(key => `<p>${key}: ${item[key]}</p>`).join('')}
      </div>
    `;
  });
  list.innerHTML = output;
}

async function loadStarWarsData() {
  const data = await fetchAllData();

  if (data) {
    showData(characterList, data.characterData.results, 'https://starwars-visualguide.com/assets/img/characters/', 'name', ['gender', 'birth_year']);
    showData(planetList, data.planetData.results, 'https://starwars-visualguide.com/assets/img/planets/', 'name', ['climate', 'terrain', 'population']);
    showData(starshipList, data.starshipData.results, 'https://starwars-visualguide.com/assets/img/starships/', 'name', ['model', 'crew', 'passengers']);
    showData(speciesList, data.speciesData.results, 'https://starwars-visualguide.com/assets/img/species/', 'name', ['classification', 'designation', 'average_height']);
  }
}

loadStarWarsData().catch(error => console.error(error));
