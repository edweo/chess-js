import { nextChar, createPieceImage } from "../tools/utilities.js";
import { Colors } from "../tools/enum.js";
import Square from "./square.js"

export default class ChessBoard {
    squares = [];
    chessBoardHTML;

    constructor(game) {
        this.chessGame = game;
        this.generateSquares();
    }

    generateSquares() {
        let y = 1;
        for (let i = 0; i < 8; i++) {
            let x = 'a';
            let squareCount = 0;
            for (let k = 0; k < 8; k++) {

                let coordinate = x + y;
                let square;

                // Creates colored squares
                if (y % 2 != 0) {
                    if (squareCount % 2 == 0) {
                        square = new Square(coordinate, Colors.Black);
                        squareCount++;
                    }
                    else {
                        square = new Square(coordinate, Colors.White);
                        squareCount++;
                    }
                }
                else if (y % 2 == 0) {
                    if (squareCount % 2 == 0) {
                        square = new Square(coordinate, Colors.White);
                        squareCount++;
                    }
                    else {
                        square = new Square(coordinate, Colors.Black);
                        squareCount++;
                    }
                }
                this.squares.push(square);
                x = nextChar(x);
            }
            y++;
        }
    }

    generatePiecesTargetSquare() {
        
        // Clear current list
        this.clearPiecesTargetSquare();

        // White Pieces
        allPieces[0].forEach(set => {
            set.forEach(piece => {
                piece.legalMoves.forEach(legalMove => {
                    addPieceTo2DArrayList(piece, getSquareByCoordinate(legalMove.moveSquare).targetedByPieces);
                });
            });
        });

        // Black Pieces
        allPieces[1].forEach(set => {
            set.forEach(piece => {
                piece.legalMoves.forEach(legalMove => {
                    addPieceTo2DArrayList(piece, getSquareByCoordinate(legalMove.moveSquare).targetedByPieces);
                });
            });
        });
    }

    clearPiecesTargetSquare() {
        this.squares.forEach(square => {
            // Clear previous values
            square.targetedByPieces = [
                [[],[],[],[],[],[]],
                [[],[],[],[],[],[]]
            ];
        });
    }

    createChessBoardHTML(boardSize, boardID) {

        const chessBoardDIV = document.createElement("div");
        chessBoardDIV.className = "chess-board";
        chessBoardDIV.id = boardID;

        // Create 64-SQUARES
        let y = 8;
        let x = "a";
        let gridColumn = 1;
        let gridRow = 1;
        let blackSquare = false;
        for (let i = 1; i <= 64; i++) {

            const pos = x+y;
            const squareDIV = document.createElement("div");
            blackSquare ? squareDIV.className = `chess-square ${pos} black-square`
                       : squareDIV.className = `chess-square ${pos} white-square`

            chessBoardDIV.appendChild(squareDIV);

            if (i % 8 != 0) {
                blackSquare = !blackSquare
                gridColumn++;
                x = nextChar(x)
            } else {
                gridColumn = 1;
                gridRow++;
                y--;
                x = "a";
            }
        }

        this.chessBoardHTML = chessBoardDIV;
        this.createCoordinatesHTML();
        return chessBoardDIV;
    }

    createCoordinatesHTML() {
        if (this.chessBoardHTML != null) {
            // Y-axis coordinates
            const y = ["A8", "A7", "A6", "A5", "A4", "A3", "A2", "A1"]
            let num = 8;
            for (let i = 0; i < 8; i++) {
                const coordinate = document.createElement("label");
                coordinate.innerHTML = num
                coordinate.className = "coordinate-y"
                const squareHTML = this.getSquareHTML(y[i]);
                squareHTML.appendChild(coordinate);
                num--;
            }
            
            // X-axis coordinates
            const x = ["A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1"]
            let letter = "A";
            for (let i = 0; i < 8; i++) {
                const coordinate = document.createElement("label");
                coordinate.innerHTML = letter
                coordinate.className = "coordinate-x"
                const squareHTML = this.getSquareHTML(x[i]);
                squareHTML.appendChild(coordinate);
                letter = nextChar(letter).toUpperCase();
            }
        }
    }

    getSquareByCoordinate(coordinate) {
        let wantedSquare;
        this.squares.forEach(square => {
            if (coordinate === square.square) {
                wantedSquare = square;
            }
        });
        return wantedSquare;
    }

    getSquareHTML(square) {

        const squares = this.chessBoardHTML.getElementsByClassName("chess-square");
    
        for (const squareKey in squares) {
            const squareHTML = squares[squareKey];
            
            if (squareHTML.classList.contains(square.toLowerCase())) {
                return squareHTML;
            }
        }
    }

    addPieceImageToBoard(pieceType, pieceColor, square) {

        const squareObj = this.getSquareByCoordinate(square);

        if (squareObj.hasPiece != true) {
            const squareHTML = this.getSquareHTML(square);
            let img = createPieceImage(pieceType, pieceColor);
            img.className = "piece-img";
            squareHTML.appendChild(img);
            squareObj.hasPiece = true;
        }
    }

    resizeChessBoard(chessBoardSize) {
        this.chessBoardHTML.style.height = chessBoardSize+"px";
        this.chessBoardHTML.style.width = chessBoardSize+"px";

        const squareSize = chessBoardSize / 8;
        const squares = this.chessBoardHTML.getElementsByClassName("chess-square");
        for (let i = 0; i < squares.length; i++) {
            squares[i].style.width = squareSize+"px";
            squares[i].style.height = squareSize+"px";
        }
    }
}