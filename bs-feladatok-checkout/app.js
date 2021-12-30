const countrySelect = document.querySelector('#country');
const stateSelect = document.querySelector('#state');
let stateSettings = null;
const usaStates = [
  'AK - Alaska',
  'AL - Alabama',
  'AR - Arkansas',
  'AS - American Samoa',
  'AZ - Arizona',
  'CA - California',
  'CO - Colorado',
  'CT - Connecticut',
  'DC - District of Columbia',
  'DE - Delaware',
  'FL - Florida',
  'GA - Georgia',
  'GU - Guam',
  'HI - Hawaii',
  'IA - Iowa',
  'ID - Idaho',
  'IL - Illinois',
  'IN - Indiana',
  'KS - Kansas',
  'KY - Kentucky',
  'LA - Louisiana',
  'MA - Massachusetts',
  'MD - Maryland',
  'ME - Maine',
  'MI - Michigan',
  'MN - Minnesota',
  'MO - Missouri',
  'MS - Mississippi',
  'MT - Montana',
  'NC - North Carolina',
  'ND - North Dakota',
  'NE - Nebraska',
  'NH - New Hampshire',
  'NJ - New Jersey',
  'NM - New Mexico',
  'NV - Nevada',
  'NY - New York',
  'OH - Ohio',
  'OK - Oklahoma',
  'OR - Oregon',
  'PA - Pennsylvania',
  'PR - Puerto Rico',
  'RI - Rhode Island',
  'SC - South Carolina',
  'SD - South Dakota',
  'TN - Tennessee',
  'TX - Texas',
  'UT - Utah',
  'VA - Virginia',
  'VI - Virgin Islands',
  'VT - Vermont',
  'WA - Washington',
  'WI - Wisconsin',
  'WV - West Virginia',
  'WY - Wyoming',
];
const huCounties = [
  'Baranya',
  'Bács-Kiskun',
  'Békés',
  'Borsod-Abaúj-Zemplén',
  'Budapest',
  'Csongrád-Csanád',
  'Fejér',
  'Győr-Moson-Sopron',
  'Hajdú-Bihar',
  'Heves',
  'Jász-Nagykun-Szolnok',
  'Komárom-Esztergom',
  'Nógrád',
  'Pest',
  'Somogy',
  'Szabolcs-Szatmár-Bereg',
  'Tolna',
  'Vas',
  'Veszprém',
  'Zala',
];

function renderStates(states) {
  stateSelect.innerHTML = '<option selected>Choose...</option>';
  stateSelect.removeAttribute('disabled');
  states.forEach((state) => {
    const optionTag = document.createElement('option');
    optionTag.setAttribute('value', state);
    optionTag.innerText = state;
    stateSelect.appendChild(optionTag);
  });
}

function setStates() {
  if (countrySelect.value === 'usa') {
    if (stateSettings === 'usa') return;
    renderStates(usaStates);
    stateSettings = 'usa';
  } else {
    if (stateSettings === 'hu') return;
    renderStates(huCounties);
    stateSettings = 'hu';
  }
}

countrySelect.addEventListener('change', setStates);
