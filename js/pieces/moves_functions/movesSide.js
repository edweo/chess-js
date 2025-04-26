import { isMoveOutOfBounds } from "./movesDetermine.js";
import { nextChar, prevChar } from "../../tools/utilities.js";
import { filterLegalMovesBishopRookQueen } from "./movesDetermine.js";
import { MoveDirection } from "../../tools/enum.js";

export function generateSideMovesRookQueen(chessBoard, square) {

    let movesArray = [];

    const startY = square.square.slice(1, 2);
    const startX = square.square.slice(0, 1);

    let y = startY;
    let x = startX;

    // Upper-side moves
    for (let i = 0; i < 7; i++) {
        y++;
        isMoveOutOfBounds(chessBoard, x + y) ? null : movesArray.push(x + y);
    }
    y = startY;

    // Right-side moves
    for (let i = 0; i < 7; i++) {
        x = nextChar(x);
        isMoveOutOfBounds(chessBoard, x + y) ? null : movesArray.push(x + y);
    }

    x = startX;
    // Lower-side moves
    for (let i = 0; i < 7; i++) {
        y--;
        isMoveOutOfBounds(chessBoard, x + y) ? null : movesArray.push(x + y);
    }

    y = startY;
    // Left-side moves
    for (let i = 0; i < 7; i++) {
        x = prevChar(x);
        isMoveOutOfBounds(chessBoard, x + y) ? null : movesArray.push(x + y);
    }

    return movesArray;
}

export function generateLegalSideMovesRookQueen(chessBoard, piece, square, allMoves) {

    let movesArray = [];

    // Initial values
    let y = square.square.slice(1, 2);
    let x = square.square.slice(0, 1);

    const firstUpperMove = x+(Number(y)+1);
    const firstRightMove = nextChar(x)+y;
    const firstLowerMove = x+(Number(y)-1);
    const firstLeftMove = prevChar(x)+y;

    let upperMoves = [];
    let rightMoves = [];
    let lowerMoves = [];
    let leftMoves = [];

    let currentDirectionCount = 0;
    allMoves.forEach(move => {
        
        if (move === firstUpperMove || move === firstRightMove 
            || move === firstLowerMove || move === firstLeftMove) {
                currentDirectionCount++;
            }
        if (currentDirectionCount === 1) {
            upperMoves.push(move);
        }
        else if (currentDirectionCount === 2) {
            rightMoves.push(move);
        }
        else if (currentDirectionCount === 3) {
            lowerMoves.push(move);
        }
        else if (currentDirectionCount === 4) {
            leftMoves.push(move);
        } 
    });

    let array1 = filterLegalMovesBishopRookQueen(chessBoard, piece, upperMoves, MoveDirection.Up);
    let array2 = filterLegalMovesBishopRookQueen(chessBoard, piece, rightMoves, MoveDirection.Right);
    let array3 = filterLegalMovesBishopRookQueen(chessBoard, piece, lowerMoves, MoveDirection.Down);
    let array4 = filterLegalMovesBishopRookQueen(chessBoard, piece, leftMoves, MoveDirection.Left);
    
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