var flashcard = document.getElementById('flashcard')
var fcFront = document.getElementById('flashcard-front')
var fcBack = document.getElementById('flashcard-back')
var fcFrontContent = document.getElementById('flashcard-front-content')
var fcBackContent = document.getElementById('flashcard-back-content')
var btnNext = document.getElementById('btn-next-flashcard')

function getRandomFlashcard() {
  return FLASHCARDS[Math.floor(Math.random() * FLASHCARDS.length)]
}

function loadNextFlashcard() {  
  let next = getRandomFlashcard()
  fcFrontContent.innerText = next['Englisch']
  fcBackContent.innerText = next['Deutsch']
}
btnNext.onclick = loadNextFlashcard

function onFlashcardsInitalized() {
  loadNextFlashcard()
}

function onFlashcardFrontClicked() {
  flashcard.classList.add('flipped')
}
fcFront.onclick = onFlashcardFrontClicked

function onFlashcardBackClicked() {
  flashcard.classList.remove('flipped')
}
fcBack.onclick = onFlashcardBackClicked
