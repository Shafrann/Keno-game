document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const startGameButton = document.getElementById('startGame');
    const resetGameButton = document.getElementById('resetGame');
    const randomGameButton = document.getElementById('randomGame');
    const betAmountInput = document.getElementById('betAmount');
    const message = document.getElementById('message');
    const drawnNumbersContainer = document.getElementById('drawnNumbers');
    const hitsContainer = document.getElementById('hits');
    const balanceElement = document.getElementById('balance');

    const totalNumbers = 80;
    const maxSelections = 20;
    let selectedNumbers = new Set();
    let drawnNumbers = new Set();

    function createBoard() {
        for (let i = 1; i <= totalNumbers; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.textContent = i;
            cell.addEventListener('click', () => selectNumber(i, cell));
            board.appendChild(cell);
        }
    }

    function selectNumber(number, cell) {
        if (selectedNumbers.size < maxSelections || selectedNumbers.has(number)) {
            if (selectedNumbers.has(number)) {
                selectedNumbers.delete(number);
                cell.classList.remove('selected');
            } else {
                selectedNumbers.add(number);
                cell.classList.add('selected');
            }
        }
    }

    function drawNumbers() {
        drawnNumbers.clear();
        while (drawnNumbers.size < 20) {
            const randomNumber = Math.floor(Math.random() * totalNumbers) + 1;
            drawnNumbers.add(randomNumber);
        }
    }

    function startGame() {
        if (selectedNumbers.size < 1) {
            message.textContent = 'Выберите хотя бы одну цифру.';
            return;
        }

        drawNumbers();
        updateBoard();
        displayDrawnNumbers();
        calculateResults();
    }

    function updateBoard() {
        document.querySelectorAll('.cell').forEach(cell => {
            const number = parseInt(cell.textContent, 10);
            cell.classList.remove('selected', 'hit', 'match');

            if (selectedNumbers.has(number) && drawnNumbers.has(number)) {
                cell.classList.add('match');  // Совпадающие числа - красный
            } else if (drawnNumbers.has(number)) {
                cell.classList.add('hit');  // Выбор компьютера - синий
            } else if (selectedNumbers.has(number)) {
                cell.classList.add('selected');  // Выбор пользователя - зеленый
            }
        });
    }

    function displayDrawnNumbers() {
        drawnNumbersContainer.innerHTML = '';
        drawnNumbers.forEach(number => {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.textContent = number;
            if (drawnNumbers.has(number)) {
                cell.classList.add('hit');  // Выбор компьютера - синий
            } else if (selectedNumbers.has(number)) {
                cell.classList.add('selected');  // Выбор пользователя - зеленый
            }
            drawnNumbersContainer.appendChild(cell);
        });
    }
    
    function calculateResults() {
        let hits = 0;
        let winnings = 0;
        const betAmount = parseInt(betAmountInput.value, 10);
        selectedNumbers.forEach(number => {
            if (drawnNumbers.has(number)) {
                hits++;
            }
        });

        if (hits > 0) {
            winnings = betAmount * hits;
        }

        message.textContent = `${hits} / ${winnings} TJK`;
        balanceElement.textContent = winnings; // Update the balance element
    }

    function displayHits() {
        hitsContainer.innerHTML = '';
        selectedNumbers.forEach(number => {
            const cell = document.createElement('div');
            cell.textContent = number;
            if (drawnNumbers.has(number)) {
                cell.classList.add('match');
            } else {
                cell.classList.add('hit');  
            }
            hitsContainer.appendChild(cell);
        });
    }
    
    function resetGame() {
        selectedNumbers.clear();
        drawnNumbers.clear();
        message.textContent = '';
        drawnNumbersContainer.innerHTML = '';
        hitsContainer.innerHTML = '';
        document.querySelectorAll('.cell').forEach(cell => {
            cell.classList.remove('selected', 'hit', 'match');
        });
    }

    function randomSelect() {
        resetGame();
        while (selectedNumbers.size < maxSelections) {
            const randomNumber = Math.floor(Math.random() * totalNumbers) + 1;
            selectedNumbers.add(randomNumber);
        }
        updateBoard();
    }
    
    startGameButton.addEventListener('click', startGame);
    resetGameButton.addEventListener('click', resetGame);
    randomGameButton.addEventListener('click', randomSelect);
    createBoard();
});
