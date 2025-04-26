import Piece from "./piece.js"
import { prevChar, nextChar } from "../tools/utilities.js";
import { isMoveOutOfBounds, isFutureMoveCheck } from "./moves_functions/movesDetermine.js";
import { Pieces, MoveType } from "../tools/enum.js";
import Move from "./move.js"

export default class Knight extends Piece {
    promotedFromPawn;
    constructor(color, coordinate, chessBoard) {
        super(color, coordinate, chessBoard);
        this.pieceType = Pieces.Knight;
        this.promotedFromPawn = false;
    }

    generateAllMoves(square) {

        let movesArray = [];

        let y = square.square.slice(1, 2);
        let x = square.square.slice(0, 1);

        // Upper circle-half moves
        y++;
        x = prevChar(x);
        x = prevChar(x);
        isMoveOutOfBounds(this.chessBoard, x + y) ? null : movesArray.push(x + y);

        y++;
        x = nextChar(x);
        isMoveOutOfBounds(this.chessBoard, x + y) ? null : movesArray.push(x + y);

        x = nextChar(x);
        x = nextChar(x);
        isMoveOutOfBounds(this.chessBoard, x + y) ? null : movesArray.push(x + y);

        y--;
        x = nextChar(x);
        isMoveOutOfBounds(this.chessBoard, x + y) ? null : movesArray.push(x + y);

        // Lower circle-half moves
        y--;
        y--;
        isMoveOutOfBounds(this.chessBoard, x + y) ? null : movesArray.push(x + y);

        y--;
        x = prevChar(x);
        isMoveOutOfBounds(this.chessBoard, x + y) ? null : movesArray.push(x + y);

        x = prevChar(x);
        x = prevChar(x);
        isMoveOutOfBounds(this.chessBoard, x + y) ? null : movesArray.push(x + y);

        y++;
        x = prevChar(x);
        isMoveOutOfBounds(this.chessBoard, x + y) ? null : movesArray.push(x + y);

        return movesArray;
    }

    generateLegalMoves(square, allMoves) {

        let movesArray = [];

        allMoves.forEach(move => {

            const square = this.chessBoard.getSquareByCoordinate(move);
            const futureMoves = this.generateAllMoves(square);
            const hasCheckMove = isFutureMoveCheck(this.chessBoard, futureMoves, this);

            if (hasCheckMove) {
                //console.log("FutureMoves: ", this.currentSquare.square, futureMoves);
                console.log("CHECK MOVE:", move, "|", this.pieceType, this.currentSquare.square);
            }

            // Regular move
            let legalMove;
            if (!square.hasPiece) {
                if (hasCheckMove) {
                    legalMove = new Move(move, MoveType.Regular, MoveType.Check);
                } else {
                    legalMove = new Move(move, MoveType.Regular, null);
                }
                movesArray.push(legalMove);
            }
            // Capture move
            else if (square.hasPiece && square.currentPiece.color != this.color) {
                if (hasCheckMove) {
                    legalMove = new Move(move, MoveType.Capture, MoveType.Check);
                } else {
                    legalMove = new Move(move, MoveType.Capture, null);
                }
                movesArray.push(legalMove);
            }

            this.addTargetableSquare(move);
        });

        return movesArray;
    }
}