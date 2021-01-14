var cardsCounter = document.getElementById('cards-counter')
var flashcard = document.getElementById('flashcard')
var fcFront = document.getElementById('flashcard-front')
var fcBack = document.getElementById('flashcard-back')
var fcFrontContent = document.getElementById('flashcard-front-content')
var fcBackContent = document.getElementById('flashcard-back-content')
var btnSuccess = document.getElementById('btn-success')
var btnFail = document.getElementById('btn-fail')
var btnChallenge = document.getElementById('btn-challenge')
var CURRENT_FLASHCARD = false
var CHALLENGE_IS_ON = false
const LS_KEY_CHALLENGES = 'challenges'

function getRandomFlashcard() {
  if (FLASHCARDS.length === 1) return FLASHCARDS[0]
  var newCard;
  do {
    // avoid selecting current card again
    newCard =  FLASHCARDS[Math.floor(Math.random() * FLASHCARDS.length)]
  } while (newCard === CURRENT_FLASHCARD)
  return newCard
}

function getRandomSetOfFlashcards(count) {
  if (count > FLASHCARDS.length) return []
  if (count === FLASHCARDS.length) return FLASHCARDS
  var indexes = []
  while (indexes.length < count) {
    do {
      var rIdx = Math.floor(Math.random() * FLASHCARDS.length)
    } while (indexes.indexOf(rIdx) !== -1)
    indexes.push(rIdx)
  }
  result = []
  for (var i = 0; i < indexes.length; i++) {
    result.push(FLASHCARDS[indexes[i]])
  }
  return result
}

function unflipCardWithoutTransition() {
  let transition = flashcard.style.transition
  flashcard.style.transition = 'none'
  flashcard.classList.remove('flipped')
  setTimeout(() => { flashcard.style.transition = transition }, 500)
}

function loadNextFlashcard() {
  CURRENT_FLASHCARD = getRandomFlashcard()
  fcFrontContent.innerText = CURRENT_FLASHCARD['Englisch']
  fcBackContent.innerText = CURRENT_FLASHCARD['Deutsch']
}

function removeCurrentFlashcard() {
  for (var i = 0; i < FLASHCARDS.length; i++) {
    if (FLASHCARDS[i] === CURRENT_FLASHCARD) break
  }
  FLASHCARDS.splice(i, 1)
  cardsCounter.innerText = `Number of cards: ${FLASHCARDS.length}`
}

function onFlashcardsInitalized() {
  cardsCounter.innerText = `Number of cards: ${FLASHCARDS.length}`
  document.getElementById('loading').style.display = 'none'
  flashcard.style.display = 'block'
  if (CHALLENGE_IS_ON === false) btnChallenge.style.display = 'block'
  loadNextFlashcard()
}

function onStartChallenge(evt) {
  btnChallenge.style.display = 'none'
  var count = prompt('How many cards?', '20')
  if (isNaN(count) || count > FLASHCARDS.length || count < 2) count = 20
  FLASHCARDS = getRandomSetOfFlashcards(count)
  CHALLENGE_IS_ON = true
  onFlashcardsInitalized()
  storeCurrentChallenge()
}
btnChallenge.onclick = onStartChallenge

function endChallenge() {
  btnChallenge.style.display = 'block'
  CHALLENGE_IS_ON = false
  initFlashcards()
}

function storeCurrentChallenge() {
  let now = new Date()
  let challenge = {
    title: formatDateTime(now),
    timestamp: now.getTime(),
    cards: JSON.parse(JSON.stringify(FLASHCARDS)), /* deep clone */
  }
  var challenges = localStorage.getItem(LS_KEY_CHALLENGES)
  if (challenges === null) challenges = []
  challenges.push(challenge)
  localStorage.setItem(LS_KEY_CHALLENGES, JSON.stringify(challenges))
}

function formatDateTime(date) {
  return `${date.getDate()}.${date.getMonth()+1}.${date.getYear()} - ${date.getHours()}:${date.getMinutes()}`
}

function onSuccessClicked(evt) {
  evt.stopPropagation()
  CURRENT_FLASHCARD[FC_KEY_SUCCESSES] += 1
  CURRENT_FLASHCARD[FC_KEY_TRIES] += 1
  updateCounters(CURRENT_FLASHCARD)
  unflipCardWithoutTransition()
  if (CHALLENGE_IS_ON === true) {
    removeCurrentFlashcard()
    if (CHALLENGE_IS_ON && FLASHCARDS.length === 0) {
      endChallenge()
      return
    }
  }
  loadNextFlashcard()
}
btnSuccess.onclick = onSuccessClicked

function onFailClicked(evt) {
  evt.stopPropagation()
  CURRENT_FLASHCARD[FC_KEY_FAILS] += 1
  CURRENT_FLASHCARD[FC_KEY_TRIES] += 1
  updateCounters(CURRENT_FLASHCARD)
  unflipCardWithoutTransition()
  loadNextFlashcard()
}
btnFail.onclick = onFailClicked

function onFlashcardFrontClicked() {
  flashcard.classList.add('flipped')
}
fcFront.onclick = onFlashcardFrontClicked

function onFlashcardBackClicked() {
  flashcard.classList.remove('flipped')
}
fcBack.onclick = onFlashcardBackClicked
