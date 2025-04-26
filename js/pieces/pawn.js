import Piece from "./piece.js"
import { prevChar, nextChar } from "../tools/utilities.js";
import { isMoveOutOfBounds, isFutureMoveCheck, isFutureMoveNotExposingToCheck } from "./moves_functions/movesDetermine.js";
import { Pieces, Colors, MoveType } from "../tools/enum.js";
import Move from "./move.js"

export default class Pawn extends Piece {
    hasPromoted;
    promotionForwardSquare;
    promotionLeftSquare;
    promotionRightSquare;
    doubleForwardMove;
    enPassantSquare = null;
    isEnPassant = false;
    constructor(color, coordinate, chessBoard) {
        super(color, coordinate, chessBoard);
        this.pieceType = Pieces.Pawn;
        this.hasPromoted = false;
        this.generatePromotionSquares();

        console.log("Promotion", this.pieceType, this.color, this.currentSquare.square, "|", "Left", this.promotionLeftSquare, "Forward", this.promotionForwardSquare,  "Right", this.promotionRightSquare);
    }

    generatePromotionSquares() {
        if (!this.hasPromoted) {
            let x = this.currentSquare.square.slice(0, 1);
            if (this.color === Colors.White) {

                const forwardPromotionMove = x + 8;
                const leftPromotionMove = prevChar(x) + 8;
                const rightPromotionMove = nextChar(x) + 8;

                isMoveOutOfBounds(this.chessBoard, forwardPromotionMove) ? null : this.promotionForwardSquare = forwardPromotionMove;
                isMoveOutOfBounds(this.chessBoard, leftPromotionMove) ? null : this.promotionLeftSquare = leftPromotionMove;
                isMoveOutOfBounds(this.chessBoard, rightPromotionMove) ? null : this.promotionRightSquare = rightPromotionMove;
            } else {
                const forwardPromotionMove = x + 1;
                const leftPromotionMove = prevChar(x) + 1;
                const rightPromotionMove = nextChar(x) + 1;

                isMoveOutOfBounds(this.chessBoard, forwardPromotionMove) ? null : this.promotionForwardSquare = forwardPromotionMove;
                isMoveOutOfBounds(this.chessBoard, leftPromotionMove) ? null : this.promotionLeftSquare = leftPromotionMove;
                isMoveOutOfBounds(this.chessBoard, rightPromotionMove) ? null : this.promotionRightSquare = rightPromotionMove;
            }
        }
    }

    generateAllMoves(square) {

        let movesArray = [];

        let y = square.square.slice(1, 2);
        let x = square.square.slice(0, 1);

        if (this.color == Colors.White) {
            // Left move
            y++;
            x = prevChar(x);
            isMoveOutOfBounds(this.chessBoard, x + y) ? null : movesArray.push(x + y);

            // 1-square forward move
            x = nextChar(x);
            isMoveOutOfBounds(this.chessBoard, x + y) ? null : movesArray.push(x + y);

            // Right move
            x = nextChar(x);
            isMoveOutOfBounds(this.chessBoard, x + y) ? null : movesArray.push(x + y);

            if (!this.hasMoved) {
              // 2-square forward move
                y++;
                x = prevChar(x);
                isMoveOutOfBounds(this.chessBoard, x + y) ? null : movesArray.push(x + y);
            }
        }
        else if (this.color == Colors.Black) {
            // Left move
            y--;
            x = prevChar(x);
            isMoveOutOfBounds(this.chessBoard, x + y) ? null : movesArray.push(x + y);

            // 1-square forward move
            x = nextChar(x);
            isMoveOutOfBounds(this.chessBoard, x + y) ? null : movesArray.push(x + y);

            // Right move
            x = nextChar(x);
            isMoveOutOfBounds(this.chessBoard, x + y) ? null : movesArray.push(x + y);

            if (!this.hasMoved) {
                // 2-square forward move
                y--;
                x = prevChar(x);
                isMoveOutOfBounds(this.chessBoard, x + y) ? null : movesArray.push(x + y);
            }
        }

        return movesArray;
    }

    generateLegalMoves(square, allMoves) {

        // TODO - TEST REMOVE----------------------
        if (this.currentSquare.square === "f7") {
            console.log("WHITE KING", this.chessBoard.chessGame.whiteKing)
            isFutureMoveNotExposingToCheck(this, window.whiteKing);
        }

        let movesArray = [];

        // Initial values
        let y = square.square.slice(1, 2);
        let x = square.square.slice(0, 1);


        let forwardMove;
        let leftMove;
        let rightMove;

        // GALI BUTI CIA BLOGAI SUSKAIVCIUTOA TIE MOVWES DOUBLE IR KITI RIGHT
        // SITIE--------------------------------------------------
        let forwardLeftMove;
        let forwardRightMove;
        let doubleForwardLeftMove;
        let doubleForwardRightMove;

        if (this.color === Colors.White) {
            forwardMove = x+(Number(y)+1);
            this.hasMoved ? null : this.doubleForwardMove = x+(Number(y)+2);
            leftMove = prevChar(x)+(Number(y)+1);
            rightMove = nextChar(x)+(Number(y)+1);

            forwardRightMove = nextChar(x)+(Number(y)+2);
            doubleForwardLeftMove = nextChar(x)+(Number(y)+3);
            doubleForwardLeftMove = prevChar(x)+(Number(y)+3);
            forwardLeftMove = prevChar(x)+(Number(y)+2);
        }
        else if (this.color === Colors.Black) {
            forwardMove = x+(Number(y)-1);
            this.hasMoved ? null : this.doubleForwardMove = x+(Number(y)-2);
            leftMove = prevChar(x)+(Number(y)-1);
            rightMove = nextChar(x)+(Number(y)-1);

            forwardRightMove = nextChar(x)+(Number(y)-2);
            doubleForwardLeftMove = nextChar(x)+(Number(y)-3);
            doubleForwardLeftMove = prevChar(x)+(Number(y)-3);
            forwardLeftMove = prevChar(x)+(Number(y)-2);
        }

        const forwardSquare = this.chessBoard.getSquareByCoordinate(forwardMove);
        const doubleForwardMoveSquare = this.chessBoard.getSquareByCoordinate(this.doubleForwardMove);
        const leftSquare = this.chessBoard.getSquareByCoordinate(leftMove);
        const rightSquare = this.chessBoard.getSquareByCoordinate(rightMove);

        allMoves.forEach(move => {
            const square = this.chessBoard.getSquareByCoordinate(move);
            // A fix to make sure the upper move is not counted when looking for
            // Checkable moves, this allows only left-right moves to be a check move
            // for a Pawn piece. Just to temporarily disable the ability to move 2 squares up.
            let stateOfHasMoved = this.hasMoved;
            if (!stateOfHasMoved) {
                this.hasMoved = true;
            }
            const futureMoves = this.generateAllMoves(square);
            // Remove from future moves upper move because you can't check
            // a king upside
            let futureMovesUpdated = [];
            futureMoves.forEach(futureMove => {
                let y = move.slice(1, 2);
                let x = move.slice(0, 1);

                let upMove = "";
                if (this.color != Colors.Black) {
                    upMove = x+(Number(y)+1);
                } else {
                    upMove = x+(Number(y)-1);
                }

                if (futureMove != upMove) {
                    futureMovesUpdated.push(futureMove);
                }
            });
            const hasCheckMove = isFutureMoveCheck(this.chessBoard, futureMovesUpdated, this);
            if (!stateOfHasMoved) {
                this.hasMoved = false;
            }
            
            console.log("FUTURE MOVES:", this.pieceType, this.currentSquare.square, futureMoves, "Updated", futureMovesUpdated);
            // c4 e4

            // Regular move 1-square move
            let legalMove;

            // Not exposing to a check ehile being pinned
            //if 

            if ((move === forwardMove) && !forwardSquare.hasPiece) {
                
                // Promotion Move
                if (move === this.promotionForwardSquare) {
                    legalMove = new Move(move, MoveType.Promotion, MoveType.Regular);
                } else {
                   // Check move
                    if (hasCheckMove) {
                        legalMove = new Move(move, MoveType.Regular, MoveType.Check);
                    }
                    // Regular move
                    else {
                        legalMove = new Move(move, MoveType.Regular, null);
                    } 
                }
                movesArray.push(legalMove);
            }

            // Double forward move
            if (!this.hasMoved) {
                if (move === this.doubleForwardMove && !doubleForwardMoveSquare.hasPiece && !forwardSquare.hasPiece) {
                    if (hasCheckMove) {
                        legalMove = new Move(move, MoveType.Regular, MoveType.Check);
                    } else {
                        legalMove = new Move(move, MoveType.Regular, null);
                    }
                    movesArray.push(legalMove);
                }
            }

            // Capture move
            if ((move === leftMove && leftSquare.hasPiece) || (move === rightMove && rightSquare.hasPiece)) {

                // Left capture
                if (move === leftMove && leftSquare.currentPiece.color != this.color) {

                    if (move === this.promotionLeftSquare) {
                        legalMove = new Move(move, MoveType.Promotion, MoveType.Capture);
                    } else {
                        if (hasCheckMove) {
                            legalMove = new Move(move, MoveType.Capture, MoveType.Check);
                        } else {
                            legalMove = new Move(move, MoveType.Capture, null);
                        }
                    }
                    movesArray.push(legalMove);
                }

                // Right capture
                else if (move === rightMove && rightSquare.currentPiece.color != this.color) {

                    if (move === this.promotionRightSquare) {
                        legalMove = new Move(move, MoveType.Promotion, MoveType.Capture);
                    } else {
                        if (hasCheckMove) {
                            legalMove = new Move(move, MoveType.Capture, MoveType.Check);
                        } else {
                            legalMove = new Move(move, MoveType.Capture, null);
                        }
                    }
                    movesArray.push(legalMove);
                }
            }

            // En passant capture move
            if (this.isEnPassant != false) {
                if (move === this.enPassantSquare) {
                    if (hasCheckMove) {
                        legalMove = new Move(move, MoveType.EnPassant, MoveType.Check);
                    } else {
                        legalMove = new Move(move, MoveType.EnPassant, null);
                    }
                    movesArray.push(legalMove);
                }
            }

            // Targetable move - controled squares
            if (move === leftMove || move === rightMove) {
                this.addTargetableSquare(move);
            }
        });

        return movesArray;
    }
}