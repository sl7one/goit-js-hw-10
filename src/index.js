import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetchCountries.js';

const debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;
const inputRef = document.querySelector('[id="search-box"]');
const countryListRef = document.querySelector('[class="country-list"]');
const singleCountryRef = document.querySelector('[class="country-info"]');

inputRef.addEventListener('input', debounce(search, DEBOUNCE_DELAY));

function search({ target: { value: targetValue } }) {
  const value = targetValue.trim();

  if (!value) {
    return;
  }

  const response = fetchCountries(value);

  response
    .then(data => {
      clearDomElements();

      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      if (data.length > 1 && data.length <= 10) {
        countryListRef.insertAdjacentHTML('beforeend', markupList(data));
        return;
      }

      if (data.length === 1) {
        singleCountryRef.insertAdjacentHTML('beforeend', markupSingle(data));
        return;
      }
    })
    .catch(error => Notify.failure('Oops, there is no country with that name'));
}

function clearDomElements() {
  countryListRef.innerHTML = '';
  singleCountryRef.innerHTML = '';
}

function markupList(countries) {
  return countries
    .map(country => {
      const {
        name: { common: shortName },
        flags: { svg },
      } = country;

      return `<li class='country-item'>
          <img src="${svg}" width = '30'></img>
          <p>${shortName}</p>
          </li>`;
    })
    .join('');
}

function markupSingle(countries) {
  const {
    name: { common: shortName },
    capital,
    population,
    flags: { svg },
    languages,
  } = countries[0];

  const languagesString = Object.values(languages).join(', ');

  return `<div class='wrapper'>
          <img src="${svg}" width = '50' height='30'></img>
          <p class='title'>${shortName}</p></div>
          <p><span class='text'>Capital : </span> ${capital}</p>
          <p><span class='text'>Population : </span> ${population}</p>
          <p><span class='text'>Languages : </span> ${languagesString}</p>`;
}
