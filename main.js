const gameState = {
    activeLetter: document.querySelector('.letter'),
    activeGuess: document.querySelector('.guess'),
    guesses: 0,
    word: getWord(),
}


function addLetterEvents(guess) {
    for(const letter of guess.children) {
        letter.addEventListener("click", handleLetterClick);
    }
}


function start() {
    const keyboard = document.querySelectorAll('.key');
    const helpBtn = document.querySelector('.help-btn');

    addLetterEvents(gameState.activeGuess);

    for (const key of keyboard) {
        key.addEventListener("click", handleKeyClick);
    }

    helpBtn.addEventListener("click", handleHelpClick);
}


function end() {
    const keyboard = document.querySelectorAll('.key');

    for (const key of keyboard) {
        key.removeEventListener("click", handleKeyClick);
    }
}


function mapKeyboard (key) {
    if (key.id == "send") {
        checkGuess();
    } else if (key.id == "backspace") {
        if(gameState.activeLetter.textContent == "") {
            const prevLetter = gameState.activeLetter.previousElementSibling;
            setActiveLetter(prevLetter);
        }
        gameState.activeLetter.textContent = "";

    } else {
        gameState.activeLetter.textContent = key.textContent;
        setActiveLetter(gameState.activeLetter.nextElementSibling);
    }
}


function handleHelpClick() {
    const instructions = document.createElement('div');
    const instTitle = document.createElement('h2');
    const introText = document.createElement('p');
    const exampleList = document.createElement('ul');
    const exOne = document.createElement('li')
    const exTwo = document.createElement('li')
    const exThree = document.createElement('li')
    const closeBtn = document.createElement('button');

    const main = document.querySelector('main');

    instTitle.textContent = "Ayuda";
    introText.textContent = "Cada intento debe ser una palabra de 5 letras válida. El color de la casilla determina lo siguiente:"
    exOne.textContent = "Verde - La letra está en la palabra y en el lugar correcto."
    exTwo.textContent = "Amarillo - La letra está en la palabra, pero en el lugar incorrecto."
    exThree.textContent = "Gris - La letra no está en la palabra."
    closeBtn.textContent = "X";

    instructions.className = "instructions";

    closeBtn.addEventListener("click", () => {
        instructions.remove();
    })

    exampleList.appendChild(exOne);
    exampleList.appendChild(exTwo);
    exampleList.appendChild(exThree);

    instructions.appendChild(closeBtn);
    instructions.appendChild(instTitle);
    instructions.appendChild(introText);
    instructions.appendChild(exampleList);

    main.appendChild(instructions);
}

function handleKeyClick(event) {
    mapKeyboard(event.currentTarget);
}


function handleLetterClick(event) {
    setActiveLetter(event.currentTarget);
}


function setActiveLetter(letter) {
    if(letter) {
        gameState.activeLetter.classList.remove('active-letter');
        letter.classList.add('active-letter');
        gameState.activeLetter = letter;
    }
}


async function wordExists(word) {
    const response = await fetch('word.json');
    const dictionary = await response.json();

    return dictionary.includes(word.toLowerCase());
}


async function getWord() {
    const response = await fetch('word.json');
    const words = await response.json();
    
    const word = words[Math.floor(Math.random() * words.length)];
    return word;
}


async function checkGuess() {
    const letters = gameState.activeGuess.children;
    let stringWord = "";

    for (const letter of letters) {
        stringWord += letter.textContent;
    }

    const exists = await wordExists(stringWord);
    if (!exists) {
        alert("La palabra no se encuentra en la lista");
        return;
    }

    let word = await gameState.word;
    word = word.toUpperCase();
  
    for (let n = 0; n < letters.length; n++) {
        if (letters[n].textContent == word[n]) letters[n].style.backgroundColor = "green";
        else if (word.includes(letters[n].textContent)) letters[n].style.backgroundColor = "#bfb41b";
        else letters[n].style.backgroundColor = "grey";
        
    }
    checkWinCondition(letters);
}


async function checkWinCondition(letters) {

    for (const letter of letters) {
        if (letter.style.backgroundColor !== "green") {
            gameState.guesses++;
            setNextGuess();
            
            if(gameState.guesses == 6) {
                alert(`Perdiste. La palabra es: ${await gameState.word}`);
                end()
            }
            return;
        }
    }
    alert(`Correcto! La palabra es: ${await gameState.word}`);
    end();
    setActiveLetter(null);

}
    

function setNextGuess() {
    let currentGuess = gameState.activeGuess;
    
    for(const letter of currentGuess.children) {
        letter.removeEventListener("click", handleLetterClick);
    }

    currentGuess = currentGuess.nextElementSibling;

    if (currentGuess) {
        for(const letter of currentGuess.children) {
            letter.addEventListener("click", handleLetterClick);
        }
        
        gameState.activeGuess = currentGuess;
        setActiveLetter(currentGuess.firstElementChild);
    }
}


start();