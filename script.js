 document.addEventListener('DOMContentLoaded', () => {
    const chessboard = document.getElementById('chessboard');
    let selectedSquare = null;
    let boardState; // 8x8 array to hold the piece map

    // Unicode Mappings for Chess Pieces
    const PIECES = {
        'R': '♜', 'N': '♞', 'B': '♝', 'Q': '♛', 'K': '♚', 'P': '♟', // Black
        'r': '♖', 'n': '♘', 'b': '♗', 'q': '♕', 'k': '♔', 'p': '♙'  // White
    };

    // Standard starting position (FEN-like format represented as an array)
    const INITIAL_BOARD = [
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r']
    ];

    /**
     * Initializes the board state and renders the board in the DOM.
     */
    function initializeBoard() {
        boardState = JSON.parse(JSON.stringify(INITIAL_BOARD)); // Deep copy the initial state
        renderBoard();
    }

    /**
     * Creates all 64 squares and adds event listeners.
     */
    function renderBoard() {
        chessboard.innerHTML = ''; // Clear existing board
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.classList.add('square');
                
                // Determine light or dark color
                const isLight = (row + col) % 2 === 0;
                square.classList.add(isLight ? 'light' : 'dark');

                // Assign coordinates for easy lookup in JS
                square.dataset.row = row;
                square.dataset.col = col;

                // Add the piece if it exists in the boardState
                const pieceCode = boardState[row][col];
                if (pieceCode) {
                    square.textContent = PIECES[pieceCode];
                    // 'r', 'n', 'b', etc. are lowercase (white)
                    if (pieceCode === pieceCode.toLowerCase()) {
                        square.classList.add('white-piece');
                    } else {
                        square.classList.add('black-piece');
                    }
                }

                square.addEventListener('click', handleSquareClick);
                chessboard.appendChild(square);
            }
        }
    }

    /**
     * Handles the logic when a square is clicked (selection or movement).
     * @param {Event} event The click event.
     */
    function handleSquareClick(event) {
        const targetSquare = event.currentTarget;
        const row = parseInt(targetSquare.dataset.row);
        const col = parseInt(targetSquare.dataset.col);

        // 1. If no square is currently selected
        if (!selectedSquare) {
            // Only select if the clicked square contains a piece
            if (boardState[row][col]) {
                selectedSquare = { element: targetSquare, row, col };
                targetSquare.classList.add('selected');
            }
        } 
        // 2. If a square IS selected
        else {
            const currentPieceCode = boardState[selectedSquare.row][selectedSquare.col];

            // 2a. User clicks the same piece again (Deselect)
            if (selectedSquare.row === row && selectedSquare.col === col) {
                selectedSquare.element.classList.remove('selected');
                selectedSquare = null;
                return;
            }

            // 2b. User clicks a new square (Move attempt)
            
            // --- MOVEMENT LOGIC (Simplified MVP) ---
            
            // 1. Update the JavaScript data model
            boardState[row][col] = currentPieceCode; // Move piece to new spot (captures automatically)
            boardState[selectedSquare.row][selectedSquare.col] = null; // Clear old spot

            // 2. Update the DOM
            selectedSquare.element.classList.remove('selected');
            renderBoard(); // Re-render the entire board to reflect the move

            // 3. Reset selection state
            selectedSquare = null;
        }
    }

    // Start the game
    initializeBoard();
});
