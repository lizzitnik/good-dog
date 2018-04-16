const serverBase = '//localhost:8080/'
const DOGS_URL = serverBase + 'dogs'
const COMMENTS_URL = serverBase + 'comments'

const dogTemplate = (`
<div class='dog-html'>
  <div class='top-dog'>
    <h2 class='dog-heading'></h3>
  </div>
  <div class='bottom-dog'>
    <p class='dog-symptom'></p>
    <p class='dog-info'></p>
  </div>
  <button type='button'class='comment-button'>Comment</button>
</div>
`);

const commentTemplate = (`
<div class='comment-html'>
  <p class='comment-by'></p>
  <p class='comment-contents'></p>
</div>
`)

function decodeJwt() {
  const token = localStorage.getItem('TOKEN');
  const decoded = jwt_decode(token);
  window.decoded
}

function displayDogs() {
  console.log('Retrieving dogs')
  $.getJSON(DOGS_URL, function(dogs) {
    console.log(dogs);
    const dogsElement = dogs.dogs.map(function(dog) {
      const element = $(dogTemplate);
      element.attr('id', dog.id);
      element.find('.dog-heading').text(dog.dogName + ' the ' + dog.dogBreed);
      element.find('.dog-symptom').text('Symptom: ' + dog.symptom);
      element.find('.dog-info').text('More Info: ' + dog.additionalInfo)

      return element;
    });
    $('.dog-results').html(dogsElement)
  });
}

function displayComments() {
  console.log('Retrieving comments')
  $.getJSON(COMMENTS_URL, function(comments) {
    console.log(comments);
    const commentsElement = comments.comments.map(function(comment) {
      const element = $(commentTemplate);
      element.attr('id', comment.id);
      element.find('.comment-by').text('By: ' + comment.commenterName);
      element.find('.comment-contents').text(comment.commentContent);

      return element;
    });
    $('.comment-results').html(commentsElement)
  });
}

function displaySingleDog(dog) {

  const element = $(dogTemplate);
  element.attr('id', dog.id);
  element.find('.dog-heading').text(dog.dogName + ' the ' + dog.dogBreed);
  element.find('.dog-symptom').text('Symptom: ' + dog.symptom);
  element.find('.dog-info').text('More Info: ' + dog.additionalInfo)

  $('.dog-results').append(element)
}

function displaySingleComment(comment) {

  const element = $(commentTemplate);
  element.attr('id', comment.id);
  element.find('.comment-by').text('By: ' + comment.commenterName);
  element.find('.comment-contents').text(comment.commentContent);

  $('.comment-results').append(element)
}

function handleDogModal() {
  $('.create-button').on('click', function(e) {
    e.preventDefault();
    $('#dog-modal').show();
  })

  $('#dog-modal-close').on('click', function(e) {
    e.preventDefault();
    $('#dog-modal').hide();
  })

  window.onclick = function(e) {
    if (event.target === document.getElementById('dog-modal')) {
      e.preventDefault()
      $('#dog-modal').hide();
    }
  }
}

function handleDogSubmit() {
  $('.submit-dog-button').on('click', function(e) {
    e.preventDefault();
    handleDogAdd()
  })
}

function handleDogAdd() {
  console.log('preparing to add')

  const dogName = $('#dog-name-input').val()
  const dogBreed = $('#dog-breed-input').val()
  const symptom = $('#dog-symptom-input').val()
  const additionalInfo = $('#info-input').val()

  addDog({
    dogName: dogName,
    dogBreed: dogBreed,
    symptom: symptom,
    additionalInfo: additionalInfo
  })

  $('#dog-name-input').val('')
  $('#dog-breed-input').val('')
  $('#dog-symptom-input').val('')
  $('#info-input').val('')
  $('#dog-modal').hide();
}

function addDog(dog) {
  console.log('Adding dog: ' + dog)
  $.ajax({
    method: 'POST',
    url: DOGS_URL,
    data: JSON.stringify(dog),
    success: displaySingleDog
  })
}

function handleCommentModal() {
  $('.comment-button').on('click', function(e) {
    e.preventDefault();
    $('#comment-modal').show();
  })

  $('#comment-modal-close').on('click', function(e) {
    e.preventDefault();
    $('#comment-modal').hide();
  })

  window.onclick = function(e) {
    if (event.target === document.getElementById('comment-modal')) {
      e.preventDefault()
      $('#comment-modal').hide();
    }
  }
}

function handleCommentSubmit() {
  $('.submit-comment-button').on('click', function(e) {
    e.preventDefault();
    handleCommentAdd()
  })
}

function handleCommentAdd() {
  console.log('preparing to add')

  const commenterName = $('#comment-name-input').val()
  const commentContent = $('#comment-input').val()

  addComment({
    commenterName: commenterName,
    commentContent: commentContent,
  })

  $('#comment-name-input').val('')
  $('#comment-input').val('')
  $('#comment-modal').hide();
}

function addComment(comment) {
  console.log('Adding comment: ' + comment)
  $.ajax({
    method: 'POST',
    url: COMMENTS_URL,
    data: JSON.stringify(comment),
    success: displaySingleComment
  })
}

function updateDog(dog) {
  console.log('Updating dog`' + dog.id + '`')
  $.ajax({
    url: DOGS_URL + '/' + dog.id,
    method: 'PUT',
    data: dog,
    success: displaySingleDog
  })
}


function setupAjax() {
  $.ajaxSetup({
    dataType: "json",
    contentType: "application/json",
    headers: {
      Authorization: "JWT " + localStorage.getItem("TOKEN")
    }
  })
}


$(function() {
  setupAjax()
  displayDogs();
  handleDogModal();
  handleDogSubmit();

  displayComments();
  handleCommentModal();
  handleCommentSubmit();
  decodeJwt();
})