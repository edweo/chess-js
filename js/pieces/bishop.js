import Piece from "./piece.js"
import { Pieces } from "../tools/enum.js";
import { generateDiagonalMovesBishopQueen, generateLegalDiagonalMovesBishopQueen } from "./moves_functions/movesDiagonal.js";

export default class Bishop extends Piece {
    promotedFromPawn
    constructor(color, coordinate, chessBoard) {
        super(color, coordinate, chessBoard);
        this.pieceType = Pieces.Bishop;
        this.promotedFromPawn = false;
    }

    generateAllMoves(square) {
        let movesArray = generateDiagonalMovesBishopQueen(this.chessBoard, square);
        return movesArray;
    }

    generateLegalMoves(square, allMoves) {
        let movesArray = generateLegalDiagonalMovesBishopQueen(this.chessBoard, this, square, allMoves);
        return movesArray;
    }
}