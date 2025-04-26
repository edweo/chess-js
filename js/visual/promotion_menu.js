import { Colors, Pieces } from "../tools/enum.js";
import { createPieceImage } from "../tools/utilities.js";

export default class PromotionMenu {
    piecesColor;
    isPieceSelected;
    currentPiece;
    currentlySelectedPiece;
    chessBoardWrapperHTML;
    constructor(chessBoardWrapperHTML, chessGame) {
        this.isPieceSelected = false;
        this.currentlySelectedPiece = null;
        this.currentPiece = null;
        this.chessBoardWrapperHTML = chessBoardWrapperHTML;
        this.chessGame = chessGame;
    }

    createPromationMenu(whiteTurnToMove) {

        this.piecesColor = whiteTurnToMove ? Colors.White : Colors.Black;

        const promotionMenuHTML = document.createElement("div");
        promotionMenuHTML.className = "promotion-menu";
    
        const imagesDIV = document.createElement("div");
        imagesDIV.id = "images-div";
        
        const promote_btn = document.createElement("button");
        promote_btn.innerHTML = "Promote";
        promote_btn.className = "promotion-button";

        const piece_img_1 = this.createPromotionPieceImage(Pieces.Knight, this.piecesColor, imagesDIV, promote_btn);
        const piece_img_2 = this.createPromotionPieceImage(Pieces.Bishop, this.piecesColor, imagesDIV, promote_btn);
        const piece_img_3 = this.createPromotionPieceImage(Pieces.Rook, this.piecesColor, imagesDIV, promote_btn);
        const piece_img_4 = this.createPromotionPieceImage(Pieces.Queen, this.piecesColor, imagesDIV, promote_btn);
    
        imagesDIV.append(piece_img_1, piece_img_2, piece_img_3, piece_img_4);
        promotionMenuHTML.append(imagesDIV, promote_btn);
        this.chessBoardWrapperHTML.prepend(promotionMenuHTML);

        promote_btn.disabled = true;
        // Promote Button press
        promote_btn.onclick = () => {
            if (this.isPieceSelected && this.currentlySelectedPiece != null) {
                //this.resetPromotionMenu();
                promotionMenuHTML.remove();
                //gamePausedUserAction = false;
                this.chessGame.setGamePausedUserAction();
                this.chessGame.refreshGameAfterAction();
            }
        }
    }

    createPromotionPieceImage(pieceType, pieceColor, imagesDIV, promote_btn) {
        const piece_img = createPieceImage(pieceType, pieceColor);
        piece_img.className = "promotion-piece-img";
        
        // Piece select click
        piece_img.onclick = () => {
            this.isPieceSelected = true;
            this.currentlySelectedPiece = pieceType;
            
            promote_btn.disabled = false;

            // Remove other selection
            const selectedPieces = imagesDIV.getElementsByClassName("promotion-piece-selected");
            for (let i = 0; i < selectedPieces.length; i++) {
                const element = selectedPieces[i];
                element.className = "promotion-piece-img";
            }
            piece_img.className = "promotion-piece-selected";

            console.log("SELECTED:", this.currentlySelectedPiece, pieceColor)
        };
    
        return piece_img;
    }

    showRefreshMenu(whiteTurnToMove, currentPiece, promotionMove) {
        this.currentPiece = currentPiece;
        this.createPromationMenu(whiteTurnToMove, promotionMove);
    }

    resetPromotionMenu() {
        this.isPieceSelected = false;
        this.currentlySelectedPiece = null;
        this.currentPiece = null;
    }
}