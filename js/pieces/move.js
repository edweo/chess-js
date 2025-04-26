export default class Move {
    moveSecondaryType;
    moveDirection; // Will be used for Queens / Rooks / Bishops
    constructor(moveSquare, moveType, moveSecondaryType, moveDirection) {
        this.moveSquare = moveSquare;
        this.moveType = moveType;
        this.moveSecondaryType = moveSecondaryType;
        this.moveDirection = moveDirection;
    }
};