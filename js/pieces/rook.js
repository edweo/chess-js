import Piece from "./piece.js"
import { Pieces } from "../tools/enum.js";
import { generateSideMovesRookQueen, generateLegalSideMovesRookQueen } from "./moves_functions/movesSide.js";

export default class Rook extends Piece {
    promotedFromPawn;
    constructor(color, coordinate, chessBoard) {
        super(color, coordinate, chessBoard);
        this.pieceType = Pieces.Rook;
        this.promotedFromPawn = false;
    }

    generateAllMoves(square) {
        let movesArray = generateSideMovesRookQueen(this.chessBoard, square);
        return movesArray;
    }

    generateLegalMoves(square, allMoves) {
        let movesArray = generateLegalSideMovesRookQueen(this.chessBoard, this, square, allMoves);
        return movesArray;
    }
}