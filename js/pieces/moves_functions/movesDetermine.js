import { Colors, Pieces, MoveType } from "../../tools/enum.js";
import { prevChar, nextChar } from "../../tools/utilities.js";
import Move from "../move.js"

export function isMoveOutOfBounds(chessBoard, coordinate) {
    const square = chessBoard.getSquareByCoordinate(coordinate);
    let result = (square == null) ? true : false;
    return result;
}

export function isFutureMoveCheck(chessBoard, futureMoves, piece, currentSquare) {

    let isCheck = false;
    // Pawn Knight check
    if (piece.pieceType === Pieces.Pawn || piece.pieceType === Pieces.Knight) {
        futureMoves.forEach(move => {
            const square = chessBoard.getSquareByCoordinate(move);
            if (square.hasPiece) {
                // TODO -  "piece.color" -> "this.color" if something breaks 
                if (square.currentPiece.pieceType === Pieces.King && square.currentPiece.color != piece.color) {
                    isCheck = true;
                }
            }
        });
    }
    // Bishop check
    else if (piece.pieceType === Pieces.Bishop) {
        isCheck = checkDiagonalBishopQueenMovesCheck(chessBoard, piece, futureMoves, currentSquare);
    }
    // Rook check
    else if (piece.pieceType === Pieces.Rook) {
        isCheck = checkSideRookQueenMovesCheck(chessBoard, piece, futureMoves, currentSquare);
    }
    // Queen check
    else if (piece.pieceType === Pieces.Queen) {
        let diagonalCheck = checkDiagonalBishopQueenMovesCheck(chessBoard, piece, futureMoves, currentSquare);
        let sideCheck = checkSideRookQueenMovesCheck(chessBoard, piece, futureMoves, currentSquare);
        if (diagonalCheck || sideCheck) {
            return true;
        } else {
            return false;
        }
    }
    return isCheck;
}

// TODO
export function isFutureMoveNotExposingToCheck(piece, king) {

    if (king != null) {
        const kingSquare = king.currentSquare;
        const pieceSquare = piece.currentSquare;
        
        const opponentBishopPieces = king.color === Colors.White ? allPieces[0][2] : allPieces[1][2];
        const opponentRookPieces = king.color === Colors.White ? allPieces[0][3] : allPieces[1][3];
        const opponentQueenPieces = king.color === Colors.White ? allPieces[0][4] : allPieces[1][4];
        
        console.log("PIECE:", piece.pieceType, piece.color, piece.currentSquare.square)
        console.log("BISHOPS:", opponentBishopPieces)
        console.log("ROOKS:", opponentRookPieces)
        console.log("QUEENS:", opponentQueenPieces)

        // Check Opponent Bishop
        let bishopPinning = false;
        opponentBishopPieces.forEach(bishop => {
            const bishopMoves = this.getArrayDiogonalMovesBishopQueen(bishop.currentSquare, bishop.allMoves);
            let count = 0;
            bishopMoves[0].forEach(move => {
                count++;
                let kingsCount = 0;
                let piecesCount = 0;
                if (move.moveSquare === kingSquare.square && count <= 2 && piecesCount < 2) {
                    bishopPinning = true;
                }
                
            });
            //if (bishopKingsCount === 1 && bishopPiecesCount === 1) {
                //    bishopPinning = true;
                //}
            });
            // Check Opponent Rook
            
            // Check Opponent Queen
            
            //return isExposingCheck;
    }
}

export function filterLegalMovesBishopRookQueen(chessBoard, piece, oneDiogonalMoves, moveDirection) {
    let movesArray = []
    for (const move of oneDiogonalMoves) {
        const square = chessBoard.getSquareByCoordinate(move);

        const futureMoves = piece.generateAllMoves(square);
        const hasCheckMove = isFutureMoveCheck(chessBoard, futureMoves, piece, square);

        let legalMove;
        // Regular move
        if (!square.hasPiece) {

            if (hasCheckMove) {
                legalMove = new Move(move, MoveType.Regular, MoveType.Check, moveDirection);
            } else {
                legalMove = new Move(move, MoveType.Regular, null, moveDirection);
            }
            movesArray.push(legalMove);
            piece.addTargetableSquare(move);
        }
        // Capture move
        else if (square.hasPiece && square.currentPiece.color != piece.color) {

            if (hasCheckMove) {
                legalMove = new Move(move, MoveType.Capture, MoveType.Check, moveDirection);
                movesArray.push(legalMove);
                piece.addTargetableSquare(move);
            } else {
                legalMove = new Move(move, MoveType.Capture, null, moveDirection);
                movesArray.push(legalMove);
                piece.addTargetableSquare(move);
            }

            if (square.currentPiece.pieceType != Pieces.King) {
                break;
            }
        }
        else if (square.hasPiece && square.currentPiece.color === piece.color) {
            piece.addTargetableSquare(move);
            break;
        }
    }
    return movesArray;
}

export function getTemplateCheckSideOrDiagonal(chessBoard, piece, futureMoves, square1, square2, square3, square4) {
    // Initial values
    let isCheck = false;
    let sq1 = square1;
    let sq2 = square2;
    let sq3 = square3;
    let sq4 = square4;

    let sq1Done = false;
    let sq2Done = false;
    let sq3Done = false;
    let sq4Done = false;

    let currentMoveDirection = 0;
    futureMoves.forEach(move => {
        const square = chessBoard.getSquareByCoordinate(move);

        if (!sq1Done || !sq2Done || !sq3Done || !sq4Done) {
            // If new diogonal square move is detected, change to other diagonal
            if (move === sq1 || move === sq2
                || move === sq3 || move === sq4) {
                    currentMoveDirection++;
            }
            
            if (square.hasPiece) {

                if ((currentMoveDirection === 1 && !sq1Done)
                || (currentMoveDirection === 2 && !sq2Done)
                || (currentMoveDirection === 3 && !sq3Done)
                || (currentMoveDirection === 4 && !sq4Done)) {
                    if (square.currentPiece.pieceType === Pieces.King && square.currentPiece.color != piece.color) {
                        isCheck = true;
                    }
                    else {
                        // Up left
                        if (currentMoveDirection === 1) {
                            sq1Done = true;
                        }
                        // Up Right
                        else if (currentMoveDirection === 2) {
                            sq2Done = true;
                        }
                        // Down Left
                        else if (currentMoveDirection === 3) {
                            sq3Done = true;
                        }
                        // Down Right
                        else if (currentMoveDirection === 4) {
                            sq4Done = true;
                        }
                    }
                }
            }
        }
    });
    return isCheck;
}

export function checkDiagonalBishopQueenMovesCheck(chessBoard, piece, futureMoves, currentSquare) {
    let y = currentSquare.square.slice(1, 2);
    let x = currentSquare.square.slice(0, 1);
    let upLeftSquare = prevChar(x)+(Number(y)+1);
    let upRightSquare = nextChar(x)+(Number(y)+1);
    let downLeftSquare = prevChar(x)+(Number(y)-1);
    let downRightSquare = nextChar(x)+(Number(y)-1);
    return getTemplateCheckSideOrDiagonal(chessBoard, piece, futureMoves, upLeftSquare, upRightSquare, downLeftSquare, downRightSquare);
}

export function checkSideRookQueenMovesCheck(chessBoard, piece, futureMoves, currentSquare) {
    let y = currentSquare.square.slice(1, 2);
    let x = currentSquare.square.slice(0, 1);
    let upSquare = x+(Number(y)+1);
    let rightSquare = nextChar(x)+y;
    let downSquare = x+(Number(y)-1);
    let leftSquare = prevChar(x)+y;
    return getTemplateCheckSideOrDiagonal(chessBoard, piece, futureMoves, upSquare, rightSquare, downSquare, leftSquare);
}