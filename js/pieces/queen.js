import Piece from "./piece.js"
import { Pieces } from "../tools/enum.js";
import { generateDiagonalMovesBishopQueen, generateLegalDiagonalMovesBishopQueen } from "./moves_functions/movesDiagonal.js";
import { generateSideMovesRookQueen, generateLegalSideMovesRookQueen } from "./moves_functions/movesSide.js";

export default class Queen extends Piece {
    promotedFromPawn
    constructor(color, coordinate, chessBoard) {
        super(color, coordinate, chessBoard);
        this.pieceType = Pieces.Queen;
        this.promotedFromPawn = false;
    }

    generateAllMoves(square) {
        let movesArray = [];

        let array1 = generateDiagonalMovesBishopQueen(this.chessBoard, square);
        let array2 = generateSideMovesRookQueen(this.chessBoard, square);

        array1.forEach(element => {
            movesArray.push(element)
        });

        array2.forEach(element => {
            movesArray.push(element)
        });

        return movesArray;
    }

    generateLegalMoves(square, allMoves) {
        let movesArray = [];

        let array1 = generateLegalDiagonalMovesBishopQueen(this.chessBoard, this, square, allMoves);
        let array2 = generateLegalSideMovesRookQueen(this.chessBoard, this, square, allMoves);

        array1.forEach(element => {
            movesArray.push(element)
        });

        array2.forEach(element => {
            movesArray.push(element)
        });

        return movesArray;
    }
}