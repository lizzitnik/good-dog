var MOCK_DOGS = {
  'dogs': [{
      'id': '1111',
      'dogName': 'Fido',
      'dogBreed': 'Huskey',
      'symptom': 'Runny nose',
      'additionalInfo': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauri.'
    },
    {
      'id': '2222',
      'dogName': 'Steve',
      'dogBreed': 'Pitbull',
      'symptom': 'Hoarse Cough',
      'additionalInfo': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauri.'
    },
    {
      'id': '3333',
      'dogName': 'Bacon',
      'dogBreed': 'Irish Setter',
      'symptom': 'Odd lump',
      'additionalInfo': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauri.'
    },
  ]
};

var MOCK_COMMENTS = {
  'comments': [{
      'id': '11111',
      'name': 'Nancy',
      'contents': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauri.'
    },
    {
      'id': '22222',
      'name': 'Brian',
      'contents': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauri.'
    },
    {
      'id': '33333',
      'name': 'Ted',
      'contents': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauri.'
    },
  ]
};

function decodeJwt() {
  const token = localStorage.getItem('TOKEN');
  const decoded = jwt_decode(token);
  window.decoded
}

function getRecentsDogs(callbackFn) {
  setTimeout(function() {
    callbackFn(MOCK_DOGS)
  }, 1);
}

function displayDogs(data) {
  for (index in data.dogs) {
    // let data.dogs[index] = this;
    $('.dog-results').append(
      `
      <div class='dog-html'>
        <div class='top-dog'>
          <h2 class='dog-heading'>${data.dogs[index].dogName} the
            ${data.dogs[index].dogBreed}</h3>
        </div>
        <div class='bottom-dog'>
          <p class='dog-symptom'>Symptom: <span class='symptom-span'>${data.dogs[index].symptom}</span>
          </p>
          <p class='dog-info'>More Info: <span class='info-span'>${data.dogs[index].additionalInfo}</span>
          </p>
        </div>
        <button type='button'class='comment-button'>Comment</button>
      </div>
      `
    );
  }
}

function getAndDisplayDogs() {
  getRecentsDogs(displayDogs);
}

function getRecentsComments(callbackFn) {
  setTimeout(function() {
    callbackFn(MOCK_COMMENTS)
  }, 1);
}

function displayComments(data) {
  for (index in data.comments) {
    $('.comment-results').append(
      `
      <div class='comment-html'>
        <p class='comment-by'>By: ${data.comments[index].name}</p>
        <p class='comment-contents'>${data.comments[index].contents}</p>
      </div>
      `
    );
  }
}

function getAndDisplayComments() {
  getRecentsComments(displayComments);
}



$(function() {
  getAndDisplayDogs();
  getAndDisplayComments();
  decodeJwt();
})