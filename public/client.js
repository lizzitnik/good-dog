const serverBase = '//localhost:8080/'
const USER_URL = serverBase + 'users'

function login(userCreds) {
  $.ajax({
    url: "/auth/login",
    method: "POST",
    data: JSON.stringify(userCreds),
    success: addTokenToLocalStorage
  })
}

function addTokenToLocalStorage(response) {
  localStorage.setItem("TOKEN", response.authToken)
  localStorage.setItem("USER", JSON.stringify(response.user))
  window.location.href = "/dog.html"
}

function handleLogin() {
  console.log('preparing to login')
  $('.signin-form').submit(function(e) {
    console.log('logging in')
    e.preventDefault()

    login({
      username: $(this)
        .find('.user')
        .val(),
      password: $(this)
        .find('.pass')
        .val(),
    })
  })
}

function addUser(user) {
  const creds = {
    username: user.username,
    password: user.password
  }

  console.log('Adding user: ', user)
  $.ajax({
    method: "POST",
    url: USER_URL,
    data: JSON.stringify(user),
    success: function(data) {
      login(creds)
    },
    error: function(data) {
      console.log(data)
    }
  })
}

function handleUserAdd() {
  console.log("preparing to add user")
  $(".signup-form").submit(function(e) {
    console.log("adding user")
    e.preventDefault()
    addUser({
      firstName: $(this)
        .find(".first-name")
        .val(),
      lastName: $(this)
        .find(".last-name")
        .val(),
      username: $(this)
        .find(".user")
        .val(),
      password: $(this)
        .find(".pass")
        .val()
    })
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
  handleLogin()
  handleUserAdd()
})