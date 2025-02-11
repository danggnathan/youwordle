var height = 6; // Number of guesses
var width = 3;  // Length of the word
var row = 0;    // Current guess attempt
var col = 0;    // Current letter for that attempt
var gameOver = false;
var word = "YOU"; // Target word

window.onload = function () {
    initialize();
};

function initialize() {
    let board = document.getElementById("board");
    board.innerHTML = ""; // Clear previous content

    for (let r = 0; r < height; r++) {
        let rowDiv = document.createElement("div");
        rowDiv.classList.add("row");

        // Add left heart
        let leftHeart = document.createElement("span");
        leftHeart.classList.add("heart", "left");
        leftHeart.innerHTML = '❤️';
        rowDiv.appendChild(leftHeart);

        // Add tiles
        for (let c = 0; c < width; c++) {
            let tile = document.createElement("span");
            tile.id = `${r}-${c}`;
            tile.classList.add("tile");
            tile.innerText = "";
            rowDiv.appendChild(tile);
        }

        // Add right heart
        let rightHeart = document.createElement("span");
        rightHeart.classList.add("heart", "right");
        rightHeart.innerHTML = '❤️';
        rowDiv.appendChild(rightHeart);

        board.appendChild(rowDiv);
    }

    document.addEventListener("keyup", handleKeyPress);
}


function handleKeyPress(e) {
    if (gameOver) return;

    if ("KeyA" <= e.code && e.code <= "KeyZ") {
        if (col < width) {
            let currTile = document.getElementById(`${row}-${col}`);
            if (currTile.innerText === "") {
                currTile.innerText = e.code[3];
                col += 1;
            }
        }
    } 
    else if (e.code === "Backspace") {
        if (col > 0) {
            col -= 1;
        }
        let currTile = document.getElementById(`${row}-${col}`);
        currTile.innerText = "";
    } 
    else if (e.code === "Enter") {
        if (col === width) {
            checkWord();
        }
    }
}

function checkWord() {
    let guess = "";
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(`${row}-${c}`);
        guess += currTile.innerText;
    }

    if (guess.length < width) return; // Prevent incomplete guesses

    updateColors(guess);
    row += 1;
    col = 0;

    if (guess === word) {
        gameOver = true;
        document.getElementById("answer").innerText = "You win!";
    } else if (row === height) {
        gameOver = true;
        document.getElementById("answer").innerText = `The word was: ${word}`;
    }
}

function updateColors(guess) {
    let wordMap = {}; 
    for (let c = 0; c < width; c++) {
        wordMap[word[c]] = (wordMap[word[c]] || 0) + 1;
    }

    // First pass: Check correct letters
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(`${row}-${c}`);
        let letter = guess[c];

        if (word[c] === letter) {
            currTile.classList.add("correct");
            wordMap[letter]--; 
        }
    }

    // Second pass: Check misplaced letters
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(`${row}-${c}`);
        let letter = guess[c];

        if (!currTile.classList.contains("correct")) {
            if (word.includes(letter) && wordMap[letter] > 0) {
                currTile.classList.add("present");
                wordMap[letter]--;
            } else {
                currTile.classList.add("absent");
            }
        }
    }
}

function addRandomCats() {
    let catFolder = "cats/"; // Folder where the GIFs are stored
    let catImages = ["cat1.gif", "cat2.gif", "cat3.gif", "peng.gif", "pib.gif", "pan.gif", "pan2.gif", "racc.gif", "racc2.gif",
         "rpan.gif", "rpan2.gif"]; // All your GIFs

    let board = document.getElementById("board");
    let title = document.getElementById("title");
    let keyboard = document.getElementById("keyboard"); // Assuming this is the ID of your keyboard element
    
    let boardRect = board.getBoundingClientRect(); // Board position
    let titleRect = title.getBoundingClientRect(); // Title position
    let keyboardRect = keyboard.getBoundingClientRect(); // Keyboard position
    
    let placedCats = []; // Track placed cats to prevent overlapping

    for (let i = 0; i < 15; i++) { // Number of cats on screen
        let catImage = document.createElement("img");
        catImage.src = catFolder + catImages[Math.floor(Math.random() * catImages.length)];
        catImage.classList.add("cat-gif");

        let posX, posY;
        let isOverlapping;
        let maxAttempts = 20; // Try 20 times to find a good position
        let attempts = 0;

        do {
            posX = Math.random() * (window.innerWidth - 100);
            posY = Math.random() * (window.innerHeight - 100);
            isOverlapping = false;

            // Prevent overlapping with the Wordle board
            if (
                posX > boardRect.left - 80 && posX < boardRect.right + 80 &&
                posY > boardRect.top - 80 && posY < boardRect.bottom + 80
            ) {
                isOverlapping = true;
            }

            // Prevent overlapping with the title
            if (
                posX > titleRect.left - 80 && posX < titleRect.right + 80 &&
                posY > titleRect.top - 80 && posY < titleRect.bottom + 80
            ) {
                isOverlapping = true;
            }

            // Prevent overlapping with the keyboard area
            if (
                posX > keyboardRect.left - 80 && posX < keyboardRect.right + 80 &&
                posY > keyboardRect.top - 80 && posY < keyboardRect.bottom + 80
            ) {
                isOverlapping = true;
            }

            // Prevent overlapping with other cats
            for (let cat of placedCats) {
                let distance = Math.sqrt((posX - cat.x) ** 2 + (posY - cat.y) ** 2);
                if (distance < 100) { // Keep at least 100px distance between cats
                    isOverlapping = true;
                    break;
                }
            }

            attempts++;
        } while (isOverlapping && attempts < maxAttempts);

        if (attempts < maxAttempts) {
            catImage.style.position = "absolute";
            catImage.style.left = `${posX}px`;
            catImage.style.top = `${posY}px`;
            catImage.style.width = "80px"; // Adjust size as needed

            placedCats.push({ x: posX, y: posY }); // Store placed cat position

            document.body.appendChild(catImage);
        }
    }
}


// Run when the page loads
window.onload = function () {
    initialize(); // Your existing Wordle function
    addRandomCats(); // Add random cat GIFs around the board
};

document.addEventListener("DOMContentLoaded", function () {
    const keys = document.querySelectorAll(".key-tile, .enter-key-tile");

    keys.forEach(key => {
        key.addEventListener("click", () => {
            const keyText = key.innerText;

            if (keyText === "⌫") {
                // Handle backspace
                handleKeyPress({ code: "Backspace" });
            } else if (keyText === "ENTER") {
                // Handle enter
                handleKeyPress({ code: "Enter" });
            } else {
                // Handle letter keys
                handleKeyPress({ code: `Key${keyText}` });
            }
        });
    });
});