import Piece from "./piece.js"
import { prevChar, nextChar } from "../tools/utilities.js";
import { Pieces, Colors, MoveType } from "../tools/enum.js";
import { isMoveOutOfBounds } from "./moves_functions/movesDetermine.js";
import Move from "./move.js";

export default class King extends Piece {

    hasCastled = false;

    leftCastleMove;
    rightCastleMove;

    // Castle left side values
    leftSideRookSquare;
    leftSq1;
    leftSq2;
    leftSq3;

    // Castle right side values
    rightSideRookSquare;
    rightSq1;
    rightSq2;

    constructor(color, coordinate, chessBoard) {
        super(color, coordinate, chessBoard);
        this.pieceType = Pieces.King;

        // White King
        if (color === Colors.White) {
            this.leftCastleMove = "c1";
            this.rightCastleMove = "g1";

            this.leftSideRookSquare = "a1";
            this.leftSq1 = "d1";
            this.leftSq2 = "c1";
            this.leftSq3 = "b1";

            this.rightSideRookSquare = "h1";
            this.rightSq1 = "f1";
            this.rightSq2 = "g1";
        // Black King
        } else {
            this.leftCastleMove = "c8";
            this.rightCastleMove = "g8";

            this.leftSideRookSquare = "a8";
            this.leftSq1 = "d8";
            this.leftSq2 = "c8";
            this.leftSq3 = "b8";

            this.rightSideRookSquare = "h8";
            this.rightSq1 = "f8";
            this.rightSq2 = "g8";
        }
    }

    generateAllMoves(square) {

        let movesArray = [];

        let y = square.square.slice(1, 2);
        let x = square.square.slice(0, 1);

        y++;
        isMoveOutOfBounds(this.chessBoard, x + y) ? null : movesArray.push(x + y);

        x = nextChar(x);
        isMoveOutOfBounds(this.chessBoard, x + y) ? null : movesArray.push(x + y);

        y--;
        isMoveOutOfBounds(this.chessBoard, x + y) ? null : movesArray.push(x + y);

        y--;
        isMoveOutOfBounds(this.chessBoard, x + y) ? null : movesArray.push(x + y);

        x = prevChar(x);
        isMoveOutOfBounds(this.chessBoard, x + y) ? null : movesArray.push(x + y);

        x = prevChar(x);
        isMoveOutOfBounds(this.chessBoard, x + y) ? null : movesArray.push(x + y);

        y++;
        isMoveOutOfBounds(this.chessBoard, x + y) ? null : movesArray.push(x + y);

        y++;
        isMoveOutOfBounds(this.chessBoard, x + y) ? null : movesArray.push(x + y);

        return movesArray;
    }

    generateLegalMoves(thisSquare, allMoves) {

        let movesArray = [];

        allMoves.forEach(move => {

            const square = this.chessBoard.getSquareByCoordinate(move);
            
            const targetedByPiecesArray = this.color === Colors.White ? square.targetedByPieces[1] : square.targetedByPieces[0];

            let targetedByCount = this.getTargetedByPiecesCount(targetedByPiecesArray);

            if (targetedByCount == 0) {
                // Regular move
                if (!square.hasPiece) {
                    const legalMove = new Move(move, MoveType.Regular, null);
                    movesArray.push(legalMove);
                }
                // Capture Move
                else if (square.hasPiece && square.currentPiece.color != this.color) {
                    const legalMove = new Move(move, MoveType.Capture, null);
                    movesArray.push(legalMove);
                }
            }
            this.addTargetableSquare(move);
        });

        // Castle move
        // If King has not castled or moved yet
        if (!this.hasCastled && !this.hasMoved && !window.whiteKingChecked && !window.blackKingChecked) {

            let squareLeftRook;
            let squareRightRook;
            let startingSquareKing;
            squareLeftRook = this.chessBoard.getSquareByCoordinate(this.leftSideRookSquare);
            squareRightRook = this.chessBoard.getSquareByCoordinate(this.rightSideRookSquare);

            // Determine if the king is standing on the starting position
            // to be able to castle
            if (this.color === Colors.White) {
                startingSquareKing = "e1";
            } else {
                startingSquareKing = "e8";
            }

            // Check if king is standing on the starting square
            if ((this.color === Colors.White && this.currentSquare.square === startingSquareKing)
            || (this.color === Colors.Black && this.currentSquare.square === startingSquareKing)) {

                // If rook on the specific side has not moved
                const squareLeftRook = this.chessBoard.getSquareByCoordinate(this.leftSideRookSquare);
                const squareRightRook = this.chessBoard.getSquareByCoordinate(this.rightSideRookSquare);
                
                // Left-side & Right-side rook castle
                if ((squareLeftRook.hasPiece && squareLeftRook.currentPiece.pieceType === Pieces.Rook && squareLeftRook.currentPiece.color === this.color)
                || squareRightRook.hasPiece && squareRightRook.currentPiece.pieceType === Pieces.Rook && squareRightRook.currentPiece.color === this.color) {
                    
                    // Square objects of interest to be checked to be not targetred
                    // by epponent pieces
                    const leftSquare1 = this.chessBoard.getSquareByCoordinate(this.leftSq1);
                    const leftSquare2 = this.chessBoard.getSquareByCoordinate(this.leftSq2);
                    const leftSquare3 = this.chessBoard.getSquareByCoordinate(this.leftSq3);

                    const rightSquare1 = this.chessBoard.getSquareByCoordinate(this.rightSq1);
                    const rightSquare2 = this.chessBoard.getSquareByCoordinate(this.rightSq2);
                    
                    // Check if squares are not occupied
                    const leftCastlePossible = !leftSquare1.hasPiece && !leftSquare2.hasPiece && !leftSquare3.hasPiece;
                    const rightCastlePossible = !rightSquare1.hasPiece && !rightSquare2.hasPiece;

                    // If either side is possible to castle to
                    if (leftCastlePossible || rightCastlePossible) {

                        // Counts to check how many peices target the specific square
                        // If square exceeds 0, it means check is not possible.
                        let square1TargetCount = 0;
                        let square2TargetCount = 0;
                        let square3TargetCount = 0;

                        // Left side castle          
                        if (leftCastlePossible) {
                            const leftSquare1targetedByPiecesArray = (this.color === Colors.White) ? leftSquare1.targetedByPieces[1] : leftSquare1.targetedByPieces[0];
                            square1TargetCount = this.getTargetedByPiecesCount(leftSquare1targetedByPiecesArray);
                            
                            const leftSquare2targetedByPiecesArray = (this.color === Colors.White) ? leftSquare2.targetedByPieces[1] : leftSquare2.targetedByPieces[0];
                            square2TargetCount = this.getTargetedByPiecesCount(leftSquare2targetedByPiecesArray);
                            
                            const leftSquare3targetedByPiecesArray = (this.color === Colors.White) ? leftSquare3.targetedByPieces[1] : leftSquare3.targetedByPieces[0];
                            square3TargetCount = this.getTargetedByPiecesCount(leftSquare3targetedByPiecesArray);

                            // Left side castle possible
                            if (square1TargetCount === 0 && square2TargetCount === 0 && square3TargetCount === 0) {
                                const legalMove = new Move(this.leftCastleMove, MoveType.LeftCastle, null);
                                movesArray.push(legalMove);
                            }
                        } 

                        // Reset count from left side castle
                        square1TargetCount = 0;
                        square2TargetCount = 0;
                        square3TargetCount = 0;

                        // Right side castle
                        if (rightCastlePossible) {

                            const rightSquare1targetedByPiecesArray = (this.color === Colors.White) ? rightSquare1.targetedByPieces[1] : rightSquare1.targetedByPieces[0];
                            square1TargetCount = this.getTargetedByPiecesCount(rightSquare1targetedByPiecesArray);
                            
                            const rightSquare2targetedByPiecesArray = (this.color === Colors.White) ? rightSquare2.targetedByPieces[1] : rightSquare2.targetedByPieces[0];
                            square2TargetCount = this.getTargetedByPiecesCount(rightSquare2targetedByPiecesArray);

                            // Right side castle possible
                            if (square1TargetCount === 0 && square2TargetCount === 0) {
                                const legalMove = new Move(this.rightCastleMove, MoveType.RightCastle, null);
                                movesArray.push(legalMove);
                            }
                        }
                    }
                }
            }
        }
        return movesArray;
    }
}