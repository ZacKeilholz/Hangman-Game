//Current Bugs/improvements that NEED to happen: 
//1. Add icons to score and guessed letters
//2. Filter keyboard input to only allow letters and ignore anything else.
//3. random image backgrounds... tie into minimalism?
//4. Store 'used' words in a new array to prevent words from being used a second time
//5. Sick ambient background music that starts off but has a jquery play/pause button

//Last things:  1. Add a readme.md to repository describing project,2 . add the project to portfolio page.  3. add link in the homework submission in bootcampspot.  


//HTML Target variables

var mainWordTarget = document.getElementById("main-word-container");
var mainWordContent = document.createElement("h1");

var pressToBeginTarget = document.getElementById("press-to-begin");

var guessedLettersTarget = document.getElementById("guessed-letters-container");
var guessedLettersContent = document.createElement("h4");


var playerScoreTarget = document.getElementById("player-score-container");
var playerScoreContent = document.createElement("h4");


var hangmanDeathTarget = document.getElementById("hangman-death-container");
var hangmanDeathContent = document.createElement("h1");

//misc html
var gameTitleTarget = document.getElementById("game-title");
var gameInstructionsTarget = document.getElementById("game-instructions");

//targets bootstrap divider line
var hrTarget = document.getElementById("hr-line");


var userInput = "";

//Gamestarted is toggled at first key press after user enters website
var gameStarted = false;

//Wordlist
var hangmanWordlist = ["and", "terrible", "copper", "explain", "truck", "neat", "unite", "branch", "educated", "tenuous", "hum", "decisive", "notice", "camera", "glass", "nutty", "bent", "receive"];

//Global Arrays 
var hangmanUsedWords = [];
var currentWord = "";
var currentWordArray = [];
var wordConstructionArray = [];
var guessedLetters = [];

//The Character used to represent the unguessed letters in HTML
var blankLetter = "#";

//Incorrect Guess Counter
var hangmanDeath = 0;

//Counter for won games
var score = 0;

//Set this == to the number of tries a user gets before game over- you will need to change  '-' characters in a function below if this value is changed
var gameOverValue = 10;

//Tracks whether or not a letter input is a new letter or not
var newGuess = true;


//FUNCTIONS


//1. This function is run whenever the user presses the first key and initiates the game
document.onkeyup = function (event) {

    // Determines which key was pressed.
    userInput = event.key;
    playGame();
};

//2. Start Game- This function (mostly) changes the HTML to reflect a game start condition 
function playGame() {

    //Add Score and Guessed letters to HTML 
    updateHTML();

    //Initial Game Startup Sequence- This does everything up to the user choosing their first letter
    if (gameStarted === false) {
        gameTitleTarget.style.display = "none";
        gameInstructionsTarget.style.display = "none";
        wordGenerator();
        gameStarted = true;
    } else if (gameStarted) {

        //1.  Check if letter has been pressed already.  If it hasn't, add it to the checked letter list and if it HAS already been guessed, tell the user... Also, toggle a boolean for next phase.
        letterGuessUsed(userInput);
    }
}

//3. This function grabs a random word, removes the vowels, and creates the 'blank word' representation that is shown to the user
function wordGenerator() {
    currentWordArray = [];
    wordConstructionArray = [];
    guessedLetters = [];

    //Get a random word from dictionary. 

    var currentWord = hangmanWordlist[Math.floor(Math.random() * hangmanWordlist.length)];

    //Remove vowels from word for extra torture

    var vowel = ["a", "e", "i", "o", "u"];
    var vowelsRemoved = currentWord;
    for (var i = 0; i < vowel.length; i++) {
        var stringLength = vowelsRemoved.length;
        for (j = 0; j < stringLength; j++) {
            if (vowel[i] == vowelsRemoved.charAt(j)) {
                vowelsRemoved = vowelsRemoved.slice(0, j).concat(vowelsRemoved.slice(j + 1, stringLength));
            }
        }
    }
    console.log("Here's the word, because you're a total cheater...Original word was: " + currentWord + " and the vowel-removed word is: " + vowelsRemoved);
    //Turn currentWord into a blank-space partial-word array
    for (var i = 0; i < vowelsRemoved.length; i++) {
        currentWordArray.push(vowelsRemoved.charAt(i));
        wordConstructionArray.push(blankLetter);
    }
    mainWordContent.textContent = arrayToString(wordConstructionArray);
    mainWordContent.classList.add("text-center")
    mainWordTarget.appendChild(mainWordContent);
}


//4. Checks if input letter is already in the guessed letter array- if it's not, it's added to this array
function letterGuessUsed(input) {
    var newGuess = true;

    for (var i = 0; i < guessedLetters.length; i++) {
        if (input == guessedLetters[i]) {
            newGuess = false;
        }
    }
    if (newGuess) {
        guessedLetters.push(input);
    } else if (guessedLetters.length === 0) {
        newGuess = true;
        guessedLetters.push(input);
    } else {
        newGuess = true;
    }

    replaceLetter(userInput);
    gameScoreUpdate();
}


//5. Death toggle gets tripped if the userInput letter doesn't find a match of the newGuess in the currentWordArray.   
function replaceLetter(input) {

    var deathToggle = false;

    //Check if input letter is part of the current word
    for (var i = 0; i < currentWordArray.length; i++) {
        if (input === currentWordArray[i]) {
            wordConstructionArray[i] = input;
            deathToggle = true;
        }
    }
    if (!deathToggle) {
        hangmanDeath++;
    }
};


//6. This function is run after each guess to see if the game has been won or lost, in which case it zeros everything out and starts the game over.  
//If the game has not been won or lost, the function just updates the page with the latest score
function gameScoreUpdate() {
    //checks if YOU LOST!
    if (hangmanDeath == gameOverValue) {
        hangmanDeath = 0;
        score = 0;
        guessedLetters = [];
        document.body.style.backgroundImage = "url('https://images.pexels.com/photos/1749/fire-orange-emergency-burning.jpg?auto=compress&cs=tinysrgb&h=750&w=1260')"
        gameStarted = false;
        playGame();

        //Checks if you WON!
    } else if (arrayToString(wordConstructionArray) == arrayToString(currentWordArray)) {
        hangmanDeath = 0;
        gameStarted = false;
        guessedLetters = [];
        score++;
        document.body.style.backgroundImage = "url('')";
        playGame();

    } else {
        //STATUS UPDATE
        updateHTML();
    }
}

//7. This function is for updating the HTML on the page in the designated locations for each value.
function updateHTML() {
    //Guessed Letters HTML :
    guessedLettersContent.textContent = "Ltrs: " + arrayToString(guessedLetters);
    guessedLettersContent.classList.add("text-center")
    guessedLettersTarget.appendChild(guessedLettersContent);

    //Partial Word HTML :
    mainWordContent.textContent = arrayToString(wordConstructionArray);
    mainWordContent.classList.add("text-center")
    mainWordTarget.appendChild(mainWordContent);

    //Player Score HTML
    playerScoreContent.textContent = "Scr: " + score;
    playerScoreContent.classList.add("text-center")
    playerScoreTarget.appendChild(playerScoreContent);

    //Hangman HTML Drawing
    var hangmanBodyConstruction = "";
    switch (hangmanDeath) {
        case (0):
            hangmanBodyConstruction = "----------";
            break;
        case (1):
            hangmanBodyConstruction = "X---------";
            break;
        case (2):
            hangmanBodyConstruction = "XX--------";
            break;
        case (3):
            hangmanBodyConstruction = "XXX-------";
            break;
        case (4):
            hangmanBodyConstruction = "XXXX------";
            break;
        case (5):
            hangmanBodyConstruction = "XXXXX-----";
            break;
        case (6):
            hangmanBodyConstruction = "XXXXXX----";
            break;
        case (7):
            hangmanBodyConstruction = "XXXXXXX---";
            break;
        case (8):
            hangmanBodyConstruction = "XXXXXXXX--";
            break;
        case (9):
            hangmanBodyConstruction = "XXXXXXXXX-";
            break;
        case (10):
            hangmanBodyConstruction = "XXXXXXXXXX";
            break;

        default:
            hangmanBodyConstruction = "----------";
    }

    hangmanDeathContent.textContent = hangmanBodyConstruction;
    hangmanDeathContent.classList.add("text-center");
    hangmanDeathContent.classList.add("text-danger");
    hangmanDeathContent.classList.add("font-weight-bold");
    hangmanDeathTarget.appendChild(hangmanDeathContent);
}

//Misc-  THis is a helper function for quickly turning my arrays into strings for debugging/content purposes.  
function arrayToString(input) {
    var string = "";
    for (var i = 0; i < input.length; i++) {
        string += input[i];
    }
    return string;
}


