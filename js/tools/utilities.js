import { Colors, Pieces } from "./enum.js";

// Gets the next character
export function nextChar(c) {
    var i = (parseInt(c, 36) + 1 ) % 36;
    return (!i * 10 + i).toString(36);
}

// Gets the previous character
export function prevChar(c) {
    var i = (parseInt(c, 36) - 1 ) % 36;
    return (!i * 10 + i).toString(36);
}

export function addPieceTo2DArrayList(piece, arrayList) {
    switch (piece.pieceType) {
        case Pieces.Pawn:
            if (piece.color == Colors.White) {
                arrayList[0][0].push(piece);
            }
            else if (piece.color == Colors.Black) {
                arrayList[1][0].push(piece);
            }
        break;

        case Pieces.Knight:
            if (piece.color == Colors.White) {
                arrayList[0][1].push(piece);
            }
            else if (piece.color == Colors.Black) {
                arrayList[1][1].push(piece);
            }
        break;

        case Pieces.Bishop:
            if (piece.color == Colors.White) {
                arrayList[0][2].push(piece);
            }
            else if (piece.color == Colors.Black) {
                arrayList[1][2].push(piece);
            }
        break;

        case Pieces.Rook:
            if (piece.color == Colors.White) {
                arrayList[0][3].push(piece);
            }
            else if (piece.color == Colors.Black) {
                arrayList[1][3].push(piece);
            }
        break;

        case Pieces.Queen:
            if (piece.color == Colors.White) {
                arrayList[0][4].push(piece);
            }
            else if (piece.color == Colors.Black) {
                arrayList[1][4].push(piece);
            }
        break;

        case Pieces.King:
            if (piece.color == Colors.White) {
                arrayList[0][5].push(piece);
            }
            else if (piece.color == Colors.Black) {
                arrayList[1][5].push(piece);
            }
        break;
    }
}

export function removePieceFrom2DArrayList(piece, arrayList) {

    let colorSetIndex = -1;
    let piecesSetIndex = -1;
    let pieceRemoveIndex = -1;
    let hasFoundPieceRemove = false;

    for (const colorSet of arrayList) {
        colorSetIndex++;
        piecesSetIndex = -1;
        for (const piecesSet of colorSet) {
            piecesSetIndex++;
            pieceRemoveIndex = -1;
            for (const pieceFromSet of piecesSet) {
                pieceRemoveIndex++;
                //if (pieceFromSet.currentSquare === piece.currentSquare)
                if (pieceFromSet === piece) {
                    console.log("REMOVE PIECE from", pieceFromSet.currentSquare.square);
                    hasFoundPieceRemove = true;
                    break;
                }
            }
            if (hasFoundPieceRemove) {
                break;
            }
        }
        if (hasFoundPieceRemove) {
            break;
        }
    }
    console.log("REMOVE Position", colorSetIndex, piecesSetIndex, pieceRemoveIndex);


    // Remove Piece from 2D array list
    arrayList[colorSetIndex][piecesSetIndex].splice(pieceRemoveIndex, 1);
}

export function createPieceImage(pieceType, pieceColor) {
    
    var img = document.createElement("img");
    switch (pieceType) {

        case Pieces.Pawn:
            if (pieceColor == Colors.White) {
                img.src = "images/pieces/White_Pawn.png";
            }
            else if (pieceColor == Colors.Black) {
                img.src = "images/pieces/Black_Pawn.png";
            }
        break;

        case Pieces.Knight:
            if (pieceColor == Colors.White) {
                img.src = "images/pieces/White_Knight.png";
            }
            else if (pieceColor == Colors.Black) {
                img.src = "images/pieces/Black_Knight.png";
            }
        break;

        case Pieces.Bishop:
            if (pieceColor == Colors.White) {
                img.src = "images/pieces/White_Bishop.png";
            }
            else if (pieceColor == Colors.Black) {
                img.src = "images/pieces/Black_Bishop.png";
            }
        break;

        case Pieces.Rook:
            if (pieceColor == Colors.White) {
                img.src = "images/pieces/White_Rook.png";
            }
            else if (pieceColor == Colors.Black) {
                img.src = "images/pieces/Black_Rook.png";
            }
        break;

        case Pieces.Queen:
            if (pieceColor == Colors.White) {
                img.src = "images/pieces/White_Queen.png";
            }
            else if (pieceColor == Colors.Black) {
                img.src = "images/pieces/Black_Queen.png";
            }
        break;

        case Pieces.King:
            if (pieceColor == Colors.White) {
                img.src = "images/pieces/White_King.png";
            }
            else if (pieceColor == Colors.Black) {
                img.src = "images/pieces/Black_King.png";
            }
        break;
    }
    img.className = "piece-img";
    return img;
}

export function createPieceImageCaptured(piece) {
    
    var img = document.createElement("img");
    switch (piece.pieceType) {

        case Pieces.Pawn:
            if (piece.color == Colors.White) {
                img.src = "images/pieces/CapturedPieces/Captured_White_Pawn.png";
            }
            else if (piece.color == Colors.Black) {
                img.src = "images/pieces/CapturedPieces/Captured_Black_Pawn.png";
            }
        break;

        case Pieces.Knight:
            if (piece.color == Colors.White) {
                img.src = "images/pieces/CapturedPieces/Captured_White_Knight.png";
            }
            else if (piece.color == Colors.Black) {
                img.src = "images/pieces/CapturedPieces/Captured_Black_Knight.png";
            }
        break;

        case Pieces.Bishop:
            if (piece.color == Colors.White) {
                img.src = "images/pieces/CapturedPieces/Captured_White_Bishop.png";
            }
            else if (piece.color == Colors.Black) {
                img.src = "images/pieces/CapturedPieces/Captured_Black_Bishop.png";
            }
        break;

        case Pieces.Rook:
            if (piece.color == Colors.White) {
                img.src = "images/pieces/CapturedPieces/Captured_White_Rook.png";
            }
            else if (piece.color == Colors.Black) {
                img.src = "images/pieces/CapturedPieces/Captured_Black_Rook.png";
            }
        break;

        case Pieces.Queen:
            if (piece.color == Colors.White) {
                img.src = "images/pieces/CapturedPieces/Captured_White_Queen.png";
            }
            else if (piece.color == Colors.Black) {
                img.src = "images/pieces/CapturedPieces/Captured_Black_Queen.png";
            }
        break;

        case Pieces.King:
            if (piece.color == Colors.White) {
                img.src = "images/pieces/CapturedPieces/Captured_White_King.png";
            }
            else if (piece.color == Colors.Black) {
                img.src = "images/pieces/CapturedPieces/Captured_Black_King.png";
            }
        break;
    }
    img.className = "piece-img";
    return img;
}
