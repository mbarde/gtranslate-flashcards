// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"]

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = "https://www.googleapis.com/auth/spreadsheets"

const FC_KEY_SUCCESSES = 'successes'
const FC_KEY_FAILS = 'fails'
const FC_KEY_TRIES = 'tries'
const FC_KEY_ROW = 'row'
const COL_SUCCESSES = 'E'
const COL_FAILS = 'F'
const COL_TRIES = 'G'
var FLASHCARDS = []

var authorizeButton = document.getElementById('authorize_button')
var signoutButton = document.getElementById('signout_button')

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient)
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus)

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get())
    authorizeButton.onclick = handleAuthClick
    signoutButton.onclick = handleSignoutClick
  }, function(error) {
    console.error(JSON.stringify(error, null, 2))
  })
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none'
    signoutButton.style.display = 'block'
    initFlashcards()
  } else {
    authorizeButton.style.display = 'block'
    signoutButton.style.display = 'none'
  }
}

function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn()
}

function handleSignoutClick(event) {
  document.getElementById('flashcard').style.display = 'none'
  gapi.auth2.getAuthInstance().signOut()
}

function sheetRow2flashcard(row) {
  var card = {}
  card[row[0]] = row[2]
  card[row[1]] = row[3]
  card[FC_KEY_SUCCESSES] = 0
  card[FC_KEY_FAILS] = 0
  card[FC_KEY_TRIES] = 0
  if (row.length > 4) card[FC_KEY_SUCCESSES] = row[4]
  if (row.length > 5) card[FC_KEY_FAILS] = row[5]
  if (row.length > 6) card[FC_KEY_TRIES] = row[6]
  return card
}

function initFlashcards() {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: SHEET_ID,
  }).then(function(response) {
    let range = response.result
    for (i = 0; i < range.values.length; i++) {
      let row = range.values[i]
      if (row.length >= 4) {
        var card = sheetRow2flashcard(row)
        card[FC_KEY_ROW] = i+1
        FLASHCARDS.push(card)
      }
    }
    onFlashcardsInitalized()
  }, function(response) {
    console.error(response.result.error.message)
  });
}

function updateCell(cellID, value) {
  gapi.client.sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_ID}!${cellID}:${cellID}`,
    valueInputOption: 'USER_ENTERED',
    values: [[value]]
  }).then((response) => {
    var result = response.result
    console.log(`${result.updatedCells} cells updated.`)
  })
}

function updateCounters(card) {
  let row = card[FC_KEY_ROW]
  let cellFrom = `${COL_SUCCESSES}${row}`
  let cellTo = `${COL_TRIES}${row}`
  gapi.client.sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_ID}!${cellFrom}:${cellTo}`,
    valueInputOption: 'USER_ENTERED',
    values: [[
      card[FC_KEY_SUCCESSES],
      card[FC_KEY_FAILS],
      card[FC_KEY_TRIES],
    ]]
  }).then((response) => {
    var result = response.result;
    console.log(`${result.updatedCells} cells updated.`);
  })
}
