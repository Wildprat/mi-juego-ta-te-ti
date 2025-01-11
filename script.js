const board = document.getElementById('board');
const cells = document.querySelectorAll('[data-cell]');
const message = document.getElementById('message');
const modal = document.getElementById('modal');
const modalMessage = document.getElementById('modal-message');
const closeModal = document.getElementById('closeModal');
const restartButton = document.getElementById('restartButton');

const scoreXElement = document.getElementById('scoreX');
const scoreOElement = document.getElementById('scoreO');
const scoreDrawElement = document.getElementById('scoreDraw');
const gamesLeftElement = document.getElementById('gamesLeft');

let currentPlayer = 'X';
let gameActive = true;
let scoreX = 0;
let scoreO = 0;
let scoreDraw = 0;
let gamesPlayed = 0;
const totalGames = 10;
let startingPlayer = 'X'; // Jugador inicial alternante

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

cells.forEach(cell => {
    cell.addEventListener('click', handleClick, { once: true });
});

function handleClick(e) {
    const cell = e.target;
    if (!gameActive || cell.textContent !== '') return;

    cell.textContent = currentPlayer;
    if (checkWin()) {
        gameActive = false;
        if (currentPlayer === 'X') scoreX++;
        else scoreO++;
        gamesPlayed++;
        updateScoreboard();
        showModal(`¡${currentPlayer} ha ganado!`, () => {
            if (gamesPlayed === totalGames) {
                showFinalModal();
            } else {
                alternateStartingPlayer();
                restartGame();
            }
        });
    } else if (checkDraw()) {
        gameActive = false;
        scoreDraw++;
        gamesPlayed++;
        updateScoreboard();
        showModal('¡Empate!', () => {
            if (gamesPlayed === totalGames) {
                showFinalModal();
            } else {
                alternateStartingPlayer();
                restartGame();
            }
        });
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        message.textContent = `Turno de ${currentPlayer}`;
    }
}

function checkWin() {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return cells[index].textContent === currentPlayer;
        });
    });
}

function checkDraw() {
    return [...cells].every(cell => {
        return cell.textContent !== '';
    });
}

function restartGame() {
    currentPlayer = startingPlayer; // Usar el jugador inicial alternante
    gameActive = true;
    message.textContent = `Turno de ${currentPlayer}`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.addEventListener('click', handleClick, { once: true });
    });
}

function alternateStartingPlayer() {
    startingPlayer = startingPlayer === 'X' ? 'O' : 'X';
}

restartButton.addEventListener('click', () => {
    if (gameActive) {
        // Reinicia solo el tablero
        cells.forEach(cell => {
            cell.textContent = '';
            cell.addEventListener('click', handleClick, { once: true });
        });
        currentPlayer = startingPlayer; // Reiniciar con el jugador alternante actual
        message.textContent = `Turno de ${currentPlayer}`;
    }
});

function updateScoreboard() {
    scoreXElement.textContent = scoreX;
    scoreOElement.textContent = scoreO;
    scoreDrawElement.textContent = scoreDraw;
    gamesLeftElement.textContent = totalGames - gamesPlayed;
    gamesLeftElement.style.color = 'black';
}

function showModal(msg, callback) {
    modalMessage.textContent = msg;
    modal.style.display = 'block';

    closeModal.onclick = () => {
        modal.style.display = 'none';
        callback();
    };
}

function showFinalModal() {
    modalMessage.textContent = "¡Fin del juego! Gracias por jugar.";
    modal.style.display = 'block';

    closeModal.onclick = () => {
        modal.style.display = 'none';
        resetScores();
    };
}

function resetScores() {
    scoreX = 0;
    scoreO = 0;
    scoreDraw = 0;
    gamesPlayed = 0;
    startingPlayer = 'X'; // Restablecer al jugador X como inicial
    updateScoreboard();
    restartGame();
}

message.textContent = `Turno de ${currentPlayer}`;
updateScoreboard();

// Estilizar botones al pasar el mouse
restartButton.onmouseover = () => restartButton.style.backgroundColor = "#72d572";
restartButton.onmouseout = () => restartButton.style.backgroundColor = "#8BC34A";

closeModal.onmouseover = () => closeModal.style.backgroundColor = "#72d572";
closeModal.onmouseout = () => closeModal.style.backgroundColor = "#8BC34A";

// Resultados en color negro
scoreXElement.style.color = 'black';
scoreOElement.style.color = 'black';
scoreDrawElement.style.color = 'black';

// Botón de reiniciar con bordes redondeados
restartButton.style.borderRadius = '20px';

// Reducir tamaño de la ventana emergente
const modalContent = document.querySelector('.modal-content');
modalContent.style.width = '250px';
modalContent.style.height = '150px';
modalContent.style.borderRadius = '15px';

// Centrar y redondear el botón de cerrar
closeModal.style.margin = "0 auto";
closeModal.style.display = "block";
closeModal.style.borderRadius = "15px";

// Funcionalidad de arrastre para la ventana modal
let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;

modalContent.addEventListener("mousedown", dragStart);
document.addEventListener("mousemove", drag);
document.addEventListener("mouseup", dragEnd);

function dragStart(e) {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;

    if (e.target === modalContent) {
        isDragging = true;
    }
}

function dragEnd(e) {
    initialX = currentX;
    initialY = currentY;

    isDragging = false;
}

function drag(e) {
    if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;

        xOffset = currentX;
        yOffset = currentY;

        setTranslate(currentX, currentY, modalContent);
    }
}

function setTranslate(xPos, yPos, el) {
    el.style.transform = `translate(calc(-50% + ${xPos}px), calc(-50% + ${yPos}px))`;
}
