import { prevChar, nextChar } from "../../tools/utilities.js";
import { isMoveOutOfBounds, filterLegalMovesBishopRookQueen } from "./movesDetermine.js";
import { MoveDirection } from "../../tools/enum.js";

export function generateDiagonalMovesBishopQueen(chessBoard, square) {

    let movesArray = [];

    const startY = square.square.slice(1, 2);
    const startX = square.square.slice(0, 1);

    let y = startY;
    let x = startX;

    // Upper-left moves
    for (let i = 0; i < 7; i++) {
        y++;
        x = prevChar(x);
        isMoveOutOfBounds(chessBoard, x + y) ? null : movesArray.push(x + y);
    }

    y = startY;
    x = startX;

    // Upper-right moves
    for (let i = 0; i < 7; i++) {
        y++;
        x = nextChar(x);
        isMoveOutOfBounds(chessBoard, x + y) ? null : movesArray.push(x + y);
    }

     y = startY;
     x = startX;

    // Bottom-left moves
    for (let i = 0; i < 7; i++) {
        y--;
        x = prevChar(x);
        isMoveOutOfBounds(chessBoard, x + y) ? null : movesArray.push(x + y);
    }

    y = startY;
    x = startX;

    // Bottom-right moves
    for (let i = 0; i < 7; i++) {
        y--;
        x = nextChar(x);
        isMoveOutOfBounds(chessBoard, x + y) ? null : movesArray.push(x + y);
    }

    return movesArray;
    }

export function generateLegalDiagonalMovesBishopQueen(chessBoard, piece, square, allMoves) {

    let movesArray = [];

    const tempArray = getArrayDiogonalMovesBishopQueen(square, allMoves);

    let array1 = filterLegalMovesBishopRookQueen(chessBoard, piece, tempArray[0], MoveDirection.UpLeft);
    let array2 = filterLegalMovesBishopRookQueen(chessBoard, piece, tempArray[1], MoveDirection.UpRight);
    let array3 = filterLegalMovesBishopRookQueen(chessBoard, piece, tempArray[2], MoveDirection.DownLeft);
    let array4 = filterLegalMovesBishopRookQueen(chessBoard, piece, tempArray[3], MoveDirection.DownRight);
    
    array1.forEach(element => {
        movesArray.push(element);
    });
    
    array2.forEach(element => {
        movesArray.push(element);
    });
    
    array3.forEach(element => {
        movesArray.push(element);
    });
    
    array4.forEach(element => {
        movesArray.push(element);
    });

    return movesArray;
}

export function getArrayDiogonalMovesBishopQueen(square, moves) {

    let array = [];

    // Initial values
    let y = square.square.slice(1, 2);
    let x = square.square.slice(0, 1);

    const firstUpperLeftMove = prevChar(x)+(Number(y)+1);
    const firstUpperRightMove = nextChar(x)+(Number(y)+1);
    const firstLowerLeftMove = prevChar(x)+(Number(y)-1);
    const firstLowerRightMove = nextChar(x)+(Number(y)-1);

    // Will be used for queen, to stop going down-right
    // Because queen moves are stored both diagonal + side in one same array
    const firstUpperMove = x+(Number(y)+1);
    let firstUpperMoveReached = false;

    let upperLeftMoves = [];
    let upperRightMoves = [];
    let lowerLeftMoves = [];
    let lowerRightMoves = [];

    let currentDirectionCount = 0;
    moves.forEach(move => {
        
        if (move === firstUpperLeftMove || move === firstUpperRightMove 
            || move === firstLowerLeftMove || move === firstLowerRightMove) {
                currentDirectionCount++;
            }
        if (currentDirectionCount === 1) {
            upperLeftMoves.push(move);
        }
        else if (currentDirectionCount === 2) {
            upperRightMoves.push(move);
        }
        else if (currentDirectionCount === 3) {
            lowerLeftMoves.push(move);
        }
        else if (currentDirectionCount === 4 && !firstUpperMoveReached) {
            if (move === firstUpperMove) {
                firstUpperMoveReached = true;
            } else {
                lowerRightMoves.push(move);
            }
        }
    });

    array.push(upperLeftMoves);
    array.push(upperRightMoves);
    array.push(lowerLeftMoves);
    array.push(lowerRightMoves);

    return array;
}