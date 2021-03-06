const serverBase = "/"
const DOGS_URL = serverBase + "dogs"
const COMMENTS_URL = serverBase + "comments"

const editButtons = `
  <button type='button' class='delete-button'>Delete</button>
  <button type='button' class='edit-button'>Edit</button>
  `

const dogTemplate = `
  <div class='row-container'>
    <div class='dog-wrap'>
      <div class='dog-results'>
        <div class='dog-html'>
          <div class='top-dog'>
            <img class='dog-image'>
            <h2 class='dog-heading'></h3>
          </div>
          <div class='bottom-dog'>
            <p>Symptom: <span class='dog-symptom'></span></p>
            <p>More info:<span class='dog-info'></span></p>
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
`

const commentTemplate = comment => `
  <div class='comment-html'>
    <p class='comment-by'>${comment.commenterName}</p>
    <p class='comment-contents'>${comment.commentContent}</p>
  </div>
  `

function displayDogs() {
  window.user = JSON.parse(localStorage.getItem("USER"))
  $.getJSON(DOGS_URL, function(dogs) {
    const dogsElement = dogs.dogs.map(function(dog) {
      const element = $(dogTemplate)
      const commentElement = dog.comments.map(function(comment) {
        return commentTemplate(comment)
      })

      element.attr("id", dog.id)
      element.find(".dog-image").attr("src", dog.dogImage)
      element.find(".dog-heading").text(dog.dogName + " the " + dog.dogBreed)
      element.find(".dog-symptom").text(dog.symptom)
      element.find(".dog-info").text(dog.additionalInfo)
      element.find(".comment-results").html(commentElement.join(""))

      const owner = window.user && window.user.dogs.includes(dog.id)
      if (owner) {
        element.find(".edit-buttons").html(editButtons)
      }

      return element
    })

    $(".main-container").html(dogsElement)
    handleEditModal()
    handleCommentModal()
    handleDogDelete()
  })
}

function createSingleDog(dog) {
  window.user.dogs.push(dog.id)
  localStorage.setItem("USER", JSON.stringify(window.user))
  window.location.reload()
}

function updateSingleDog(dog) {
  const element = $(`#${dog.id}`)
  element.attr("id", dog.id)
  element.find(".dog-symptom").text(dog.symptom)
  element.find(".dog-info").text(dog.additionalInfo)
}

function createSingleComment(comment) {
  $.getJSON(DOGS_URL, function(dogs) {
    let dog = dogs.dogs.find(element => element.id === comment.id)
    dogs.dogs.dog.comments.push(comment.id)
  })
  const element = $(`#${comment.id}`)
  let fullComment = commentTemplate(comment)
  element.attr("id", comment.id)
  element.find(".comment-results").append(fullComment)

  window.location.reload()
}

function handleDogModal() {
  $(".create-button").on("click", function(e) {
    e.preventDefault()
    $("#dog-modal").show()
  })

  $(".close").on("click", function(e) {
    e.preventDefault()
    $("#dog-modal").hide()
  })

  $(".overlay").on("click", function(e) {
    e.preventDefault()
    $("#dog-modal").hide()
  })
}

function handleDogSubmit() {
  $("#dog-submit").on("click", function(e) {
    e.preventDefault()
    handleDogAdd()
  })
}

function handleDogAdd() {

  const dogName = $("#dog-name-input").val()
  const dogBreed = $("#dog-breed-input").val()
  const symptom = $("#dog-symptom-input").val()
  const additionalInfo = $("#info-input").val()

  addDog({
    dogName: dogName,
    dogBreed: dogBreed,
    symptom: symptom,
    additionalInfo: additionalInfo
  })

  $("#dog-name-input").val("")
  $("#dog-breed-input").val("")
  $("#dog-symptom-input").val("")
  $("#info-input").val("")
  $("#dog-modal").hide()
}

function addDog(dog) {
  console.log("Adding dog: " + dog)
  $.ajax({
    method: "POST",
    url: DOGS_URL,
    data: JSON.stringify(dog),
    success: createSingleDog
  })
}

function handleCommentModal() {
  $(".comment-button").on("click", function(e) {
    e.preventDefault()
    $(".comment-modal").show()
    let elementId = $(this)
      .closest(".row-container")
      .attr("id")
    $(".comment-modal").attr("id", elementId)
  })

  $(".close").on("click", function(e) {
    e.preventDefault()
    $(".comment-modal").hide()
  })

  $(".overlay").on("click", function(e) {
    e.preventDefault()
    $(".comment-modal").hide()
  })

  $("#comment-submit").on("click", function(e) {
    e.preventDefault()
    let commentId = $(".comment-modal").attr("id")
    $(".comment-modal").hide()
    handleCommentAdd(commentId)
  })
}

function handleCommentAdd(commentId) {

  const commenterName = $("#comment-name-input").val()
  const commentContent = $("#comment-input").val()

  addComment({
    id: commentId,
    commenterName: commenterName,
    commentContent: commentContent
  })

  $("#comment-name-input").val("")
  $("#comment-input").val("")
  $("#comment-modal").hide()
}

function addComment(comment) {
  console.log("Adding comment: " + comment)
  $.ajax({
    method: "POST",
    url: COMMENTS_URL,
    data: JSON.stringify(comment),
    success: createSingleComment
  })
}

function handleEditModal() {
  $(".edit-button").on("click", function(e) {
    e.preventDefault()
    $(".edit-modal").show()
    const row = $(this).closest(".row-container")
    let elementId = row.attr("id")
    const symptom = row.find(".dog-symptom").text()
    const info = row.find(".dog-info").text()
    $(".edit-modal").attr("id", elementId)
    $("#edit-symptom-input").val(symptom)
    $("#edit-info-input").val(info)
  })

  $(".close").on("click", function(e) {
    e.preventDefault()
    $(".edit-modal").hide()
  })

  $(".overlay").on("click", function(e) {
    e.preventDefault()
    $(".edit-modal").hide()
  })

  $("#edit-submit").on("click", function(e) {
    e.preventDefault()

    let newSymptom = $("#edit-symptom-input").val()
    let newInfo = $("#edit-info-input").val()
    let element = $(".edit-modal").attr("id")
    let item = {
      id: element,
      symptom: newSymptom,
      additionalInfo: newInfo
    }
    $("#edit-symptom-input").val("")
    $("#edit-info-input").val("")
    $(".edit-modal").hide()

    updateDog(item)
  })
}

function updateDog(dog) {
  console.log("Updating dog`" + dog.id + "`")
  $.ajax({
    url: DOGS_URL + "/" + dog.id,
    method: "PUT",
    data: JSON.stringify(dog),
    success: updateSingleDog
  })
}

function handleDogDelete() {
  $(".main-container").on("click", ".delete-button", function(e) {
    e.preventDefault()
    let dogId = $(this)
      .closest(".row-container")
      .attr("id")
    deleteDog(dogId)
  })
}

function deleteDog(dogId) {
  $.ajax({
    url: DOGS_URL + "/" + dogId,
    method: "DELETE",
    success: displayDogs
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
  displayDogs()

  handleDogModal()
  handleDogSubmit()
})