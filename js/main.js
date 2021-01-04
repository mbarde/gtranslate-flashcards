var flashcard = document.getElementById('flashcard')
var fcFront = document.getElementById('flashcard-front')
var fcBack = document.getElementById('flashcard-back')
var fcFrontContent = document.getElementById('flashcard-front-content')
var fcBackContent = document.getElementById('flashcard-back-content')
var btnNext = document.getElementById('btn-next-flashcard')

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
  let next = getRandomFlashcard()
  fcFrontContent.innerText = next['Englisch']
  fcBackContent.innerText = next['Deutsch']
}

function onFlashcardsInitalized() {
  loadNextFlashcard()
}

function onNextClicked(evt) {
  evt.stopPropagation()
  unflipCardWithoutTransition()
  loadNextFlashcard()
}
btnNext.onclick = onNextClicked

function onFlashcardFrontClicked() {
  flashcard.classList.add('flipped')
}
fcFront.onclick = onFlashcardFrontClicked

function onFlashcardBackClicked() {
  flashcard.classList.remove('flipped')
}
fcBack.onclick = onFlashcardBackClicked
