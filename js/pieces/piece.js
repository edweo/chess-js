import { addPieceTo2DArrayList } from "../tools/utilities.js";

export default class Piece {
    pieceType;
    color;
    currentSquare;
    hasMoved = false;
    allMoves = [];
    legalMoves = [];
    isPinned = false;

    constructor(color, coordinate, chessBoard) {
        this.color = color;
        this.chessBoard = chessBoard
        this.currentSquare = this.chessBoard.getSquareByCoordinate(coordinate);
    }

    generateMoves() {
        // Clear any existing moves
        this.allMoves = [];
        // this.legalMoves = [];

        this.allMoves = this.generateAllMoves(this.currentSquare);
        // this.legalMoves = this.generateLegalMoves(this.currentSquare, this.allMoves);
    }

    filterGeneratedMovesToLegal() {
        this.legalMoves = [];
        this.legalMoves = this.generateLegalMoves(this.currentSquare, this.allMoves);
    }

    getTargetedByPiecesCount(targetedByPiecesArray) {
        let targetedByCount = 0;
        targetedByCount += targetedByPiecesArray[0].length;
        targetedByCount += targetedByPiecesArray[1].length;
        targetedByCount += targetedByPiecesArray[2].length;
        targetedByCount += targetedByPiecesArray[3].length;
        targetedByCount += targetedByPiecesArray[4].length;
        targetedByCount += targetedByPiecesArray[5].length;
        return targetedByCount;
    }

    addTargetableSquare(move) {
        addPieceTo2DArrayList(this, this.chessBoard.getSquareByCoordinate(move).targetedByPieces);
    }
}