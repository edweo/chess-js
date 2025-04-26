export default class Square {
    currentPiece = null;
    hasPiece = false;

    /* 
    0-White Pieces
    1-Black Pieces
    -----------------
    Piece Array Indexes:
    0-Pawns, 1-Knights, 2-Bishops
    3-Rooks, 4-Queen, 5-King
    */
    targetedByPieces = [
        [[],[],[],[],[],[]],
        [[],[],[],[],[],[]]
    ];

    constructor(coordinate, squareColor) {
        this.square = coordinate;
        this.squareColor = squareColor;
    }
};