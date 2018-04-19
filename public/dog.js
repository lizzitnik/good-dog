const serverBase = '//localhost:8080/'
const DOGS_URL = serverBase + 'dogs'
const COMMENTS_URL = serverBase + 'comments'

const editButtons = (`
  <button type='button' class='delete-button'>Delete</button>
  <button type='button' class='edit-button'>Edit</button>
  `)

const dogTemplate = (`
  <div class='row-container'>
    <div class='dog-wrap'>
      <div class='dog-results'>
        <div class='dog-html'>
          <div class='top-dog'>
            <img class='dog-image'>
            <h2 class='dog-heading'></h3>
          </div>
          <div class='bottom-dog'>
            <p class='dog-symptom'></p>
            <p class='dog-info'></p>
          </div>
          <div class='edit-buttons'></div>
          <button class='comment-button'>Comment</button>
        </div>
      </div>
    </div>
    <div class='comment-wrap'>
      <div class='comment-results'>
      </div>
    </div>
  </div>
`);

const commentTemplate = (comment) => (`
  <div class='comment-html'>
    <p class='comment-by'>${comment.commenterName}</p>
    <p class='comment-contents'>${comment.commentContent}</p>
  </div>
  `)

function decodeJwt() {
  const token = localStorage.getItem('TOKEN');
  const decoded = jwt_decode(token);
  window.decoded
}

function displayDogs() {
  console.log('Retrieving dogs')
  window.user = JSON.parse(localStorage.getItem('USER'))
  $.getJSON(DOGS_URL, function(dogs) {
    console.log(dogs);
    const dogsElement = dogs.dogs.map(function(dog) {
      const element = $(dogTemplate);
      const commentElement = dog.comments.map(function(comment) {
        return commentTemplate(comment);
      })

      element.attr('id', dog.id);
      element.find('.dog-image').attr('src', dog.dogImage)
      element.find('.dog-heading').text(dog.dogName + ' the ' + dog.dogBreed);
      element.find('.dog-symptom').text('Symptom: ' + dog.symptom);
      element.find('.dog-info').text('More Info: ' + dog.additionalInfo)
      element.find('.comment-results').html(commentElement.join(''))

      const owner = window.user && window.user.dogs.includes(dog.id)
      if (owner) {
        element.find('.comment-button').hide()
        element.find('.edit-buttons').html(editButtons)
      }

      return element;
    });

    $('.main-container').html(dogsElement)
  });
}

function displaySingleDog(dog) {

  const element = $(dogTemplate);
  element.attr('id', dog.id);
  element.find('.dog-heading').text(dog.dogName + ' the ' + dog.dogBreed);
  element.find('.dog-symptom').text('Symptom: ' + dog.symptom);
  element.find('.dog-info').text('More Info: ' + dog.additionalInfo)

  window.user = JSON.parse(localStorage.getItem('USER'))
  const owner = window.user && window.user.dogs.includes(dog.id)

  if (owner) {
    element.find('.comment-button').hide()
    element.find('.edit-buttons').html(editButtons)
  }

  $('.main-container').append(element)
}

function displaySingleComment(comment) {

  const commentElement = $(dogTemplate);
  element.attr('id', comment.id);
  element.find('.comment-by').text('By: ' + comment.commenterName);
  element.find('.comment-contents').text(comment.commentContent);

  $('.main-container').append(element)
}

function handleDogModal() {
  $('.create-button').on('click', function(e) {
    e.preventDefault();
    $('#dog-modal').show();
  })

  $('.close').on('click', function(e) {
    e.preventDefault();
    $('#dog-modal').hide();
  })

  $('.overlay').on('click', function(e) {
    e.preventDefault()
    $('#dog-modal').hide();
  })
}

function handleDogSubmit() {
  $('#dog-submit').on('click', function(e) {
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
    success: displayDogs
  })
}

function handleCommentModal() {
  $('#comment-modal').show();

  $('.close').on('click', function(e) {
    e.preventDefault();
    $('#comment-modal').hide();
  })

  $('.overlay').on('click', function(e) {
    e.preventDefault()
    $('#comment-modal').hide();
  })
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

function handleEditModal() {
  $('.edit-buttons').on('click', '.edit-button', function(e) {
    e.preventDefault()
    $('.edit-modal').show()
    let elementId = $(this).closest('.row-container').attr('id')
    $('.edit-modal').attr('id', elementId)
  })

  $('.close').on('click', function(e) {
    e.preventDefault();
    $('.edit-modal').hide();
  })

  $('.overlay').on('click', function(e) {
    e.preventDefault()
    $('.edit-modal').hide();
  })

  $('#edit-submit').on('click', function(e) {
    e.preventDefault();

    let newSymptom = $('#edit-symptom-input').val()
    let newInfo = $('#edit-info-input').val()
    let element = $('.edit-modal').attr('id')
    let item = {
      id: element,
      symptom: newSymptom,
      additionalInfo: newInfo
    }
    $('#edit-symptom-input').val('');
    $('#edit-info-input').val('')
    $('.edit-modal').hide();

    updateDog(item)
  })

  // $('#edit-symptom-input').attr('value', dog.symptom)
  // $('#edit-info-input').attr('value', dog.additionalInfo)

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

function handleDogDelete() {
  $('.main-container').on('click', '.edit-button', function(e) {
    e.preventDefault();
    deleteDog(
      $(this).attr('id')
    )
  })
}

function deleteDog(dogId) {
  $.ajax({
    url: DOGS_URL + '/' + dogId,
    method: 'DELETE',
    seccess: displayDogs
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
  handleEditModal();
  handleDogDelete();

  handleCommentSubmit();
  decodeJwt();
})