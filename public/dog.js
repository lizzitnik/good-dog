var MOCK_DOGS = {
  'dogs': [{
      'id': '1111',
      'heading': 'Wet-nosed Huskey',
      'dogName': 'Fido',
      'dogBreed': 'Huskey',
      'symptom': 'Runny nose',
      'additionalInfo': 'His nose just won\'t stop leaking!'
    },
    {
      'id': '2222',
      'heading': 'Pitbull coughing up blood',
      'dogName': 'Steve',
      'dogBreed': 'Pitbull',
      'symptom': 'Hoarse Cough',
      'additionalInfo': 'He\' hacking up a storm!'
    },
    {
      'id': '3333',
      'heading': 'Strange lump on Setter',
      'dogName': 'Bacon',
      'dogBreed': 'Irish Setter',
      'symptom': 'Odd lump',
      'additionalInfo': 'I think it might be cancer!'
    },
  ]
};

function getRecentsDogs(callbackFn) {
  setTimeout(function() {
    callbackFn(MOCK_DOGS)
  }, 1);
}

function displayDogs(data) {
  for (index in data.dogs) {
    // let data.dogs[index] = this;
    $('.main-results').append(
      `
      <div class='dog-html'>
        <h3>${data.dogs[index].heading}</h3>
        <p>Name: ${data.dogs[index].dogName}</p>
        <p>Breed: ${data.dogs[index].dogBreed}</p>
      </div>
      `
    );
  }
}

function getAndDisplayDogs() {
  getRecentsDogs(displayDogs);
}

$(function() {
  getAndDisplayDogs();
})