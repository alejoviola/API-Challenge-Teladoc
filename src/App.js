import React, {useEffect, useState} from 'react';
import './App.scss';
import Species from './Species';

const API_URL = 'https://swapi.dev/api/films/2/';
const SPECIES_IMAGES = {
  droid:
    'https://static.wikia.nocookie.net/starwars/images/f/fb/Droid_Trio_TLJ_alt.png',
  human:
    'https://static.wikia.nocookie.net/starwars/images/3/3f/HumansInTheResistance-TROS.jpg',
  trandoshan:
    'https://static.wikia.nocookie.net/starwars/images/7/72/Bossk_full_body.png',
  wookie:
    'https://static.wikia.nocookie.net/starwars/images/1/1e/Chewbacca-Fathead.png',
  yoda: 'https://static.wikia.nocookie.net/starwars/images/d/d6/Yoda_SWSB.png',
};
const CM_TO_IN_CONVERSION_RATIO = 2.54;

//////////////////////////////////////

// CUSTOM HOOK //
const useSpeciesList = url => {
  const [speciesList, setSpeciesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const solveData = async () => {
    setIsLoading(true);
    console.log('Fetching movie data...');
    const speciesAPIArray = await getSpeciesAPI();
    console.log('Fetching species...');
    const promises = await speciesAPIArray.map(value => {
      return new Promise(async (resolve, reject) => {
        const response = await fetch(value, {
          method: 'GET',
        });
        const species = await response.json();
        resolve(species);
      });
    });
    Promise.all(promises).then(value => {
      setSpeciesList(value);
      setIsLoading(false);
      console.log('Done');
    });
  };

  const getSpeciesAPI = async () => {
    const response = await fetch(url, {
      method: 'GET',
    });
    const {species} = await response.json();

    const speciesAPIArray = [];

    species.map(value => {
      speciesAPIArray.push(value);
    });
    return speciesAPIArray;
  };

  useEffect(() => {
    solveData();
  }, []);

  return {
    speciesList,
    isLoading,
  };
};

//////////////////////////////////////

// APP //
function App() {
  const {speciesList, isLoading} = useSpeciesList(API_URL);

  return (
    <div className="App">
      <h1>Empire Strikes Back - Species Listing</h1>
      <div className="App-species">
        {!isLoading ? (
          speciesList.map(value => {
            return (
              <Species
                key={value.name}
                name={value.name}
                classification={value.classification}
                designation={value.designation}
                height={
                  !isNaN(value.average_height)
                    ? `${(
                        value.average_height / CM_TO_IN_CONVERSION_RATIO
                      ).toFixed(0)}"`
                    : 'N/A'
                }
                image={
                  value.name.indexOf(`'`) > 0
                    ? SPECIES_IMAGES[
                        value.name
                          .slice(0, value.name.indexOf(`'`))
                          .toLowerCase()
                      ]
                    : SPECIES_IMAGES[value.name.toLowerCase()]
                }
                numFilms={value.films.length}
                language={value.language}
              />
            );
          })
        ) : (
          <div className="Loader" />
        )}
      </div>
    </div>
  );
}

export default App;
