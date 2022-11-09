import { Notify } from 'notiflix/build/notiflix-notify-aio';

function fetchCountries(value) {
  return fetch(
    `https://restcountries.com/v3.1/name/${value}?fields=name,capital,population,flags,languages`
  ).then(response => {
    if (response.ok) {
      // console.log(response.json());
      return response.json();
    }
    //   Notify.failure('Oops, there is no country with that name');
  });
}

export { fetchCountries };
