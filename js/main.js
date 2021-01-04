var flashcard = document.getElementById('flashcard')
var fcFront = document.getElementById('flashcard-front')
var fcBack = document.getElementById('flashcard-back')
var fcFrontContent = document.getElementById('flashcard-front-content')
var fcBackContent = document.getElementById('flashcard-back-content')
var btnSuccess = document.getElementById('btn-success')
var btnFail = document.getElementById('btn-fail')
var CURRENT_FLASHCARD = false

function getRandomFlashcard() {
  return FLASHCARDS[Math.floor(Math.random() * FLASHCARDS.length)]
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

function onFlashcardsInitalized() {
  loadNextFlashcard()
}

function onSuccessClicked(evt) {
  evt.stopPropagation()
  CURRENT_FLASHCARD[FC_KEY_SUCCESSES] += 1
  CURRENT_FLASHCARD[FC_KEY_TRIES] += 1
  updateCounters(CURRENT_FLASHCARD)
  unflipCardWithoutTransition()
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
