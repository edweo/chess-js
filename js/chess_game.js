import Pawn from "./pieces/pawn.js"
import Knight from "./pieces/knight.js"
import Bishop from "./pieces/bishop.js"
import Rook from "./pieces/rook.js"
import Queen from "./pieces/queen.js"
import King from "./pieces/king.js"

import Player from "./visual/player.js"
import ChessBoard from "./board/chessboard.js"
import Counter from "./visual/counter.js"
import PromotionMenu from "./visual/promotion_menu.js"
import ScoreSection from "./visual/score_section.js"

import { nextChar, addPieceTo2DArrayList, createPieceImage,
        createPieceImageCaptured, removePieceFrom2DArrayList } from "./tools/utilities.js";

import { Colors, MoveType, Pieces, CountryFlags } from "./tools/enum.js"

import * as sound from "./visual/sound.js"

export default class ChessGame {

    constructor(player1, player2) {

        // MAIN PROGRAM------------------------------------------------------------------------------------
        /* 
        0-White Pieces
        1-Black Pieces
        -----------------
        Piece Array Indexes:
        0-Pawns, 1-Knights, 2-Bishops
        3-Rooks, 4-Queen, 5-King
        */
        this.allPieces = [
           [[],[],[],[],[],[]],
           [[],[],[],[],[],[]]
        ];

        this.capturedPieces = [
            [[],[],[],[],[],[]],
            [[],[],[],[],[],[]]
        ];
        
        this.currentlySelectedPiece = null;
        this.currentlyDisplayedDots = [];
        
        this.whiteKingChecked = false;
        this.blackKingChecked = false;
        this.kingCheckedOverlayRemoved = false;
        this.checkGivenByPieces = [];
        
        this.whiteTurnToMove = true;
        this.gamePausedUserAction = false;
        
        this.rotationEnabled = true;
        
        // Implement these-----------------------
        this.gameStarted = false;
        this.gameFinished = false;
        
        this.isEnPassant = false;
        this.enPassantPiece = null;
        this.enPassantSquare = null;
        this.enPassantWait = false;
        //-------------------------------------------
        
        this.whiteHasmoved = false;
        this.blackHasMoved = false;
        
        this.pastSquarePieceBeforeMoveHTML = null;
        this.newSquarePieceAfterMoveHTML = null;
        
        this.chessBoardWrapperHTML = document.getElementById("chess-board-wrapper");
        
        this.chessBoard = new ChessBoard(this);
        this.chessBoard.createChessBoardHTML(0, "main-chess-board");
        this.chessBoardWrapperHTML.prepend(this.chessBoard.chessBoardHTML);
        
        this.promotionMenu = new PromotionMenu(this.chessBoardWrapperHTML, this);

        this.player_white = player1
        this.player_black = player2

        // Convert Minutes to Sec
        this.player_white.convert_min_to_sec()
        this.player_black.convert_min_to_sec()

        this.blackCounter = new Counter(this.player_black.timer);
        this.whiteCounter = new Counter(this.player_white.timer);
        
        this.black_score_section = new ScoreSection(this.player_black, this.blackCounter, this.capturedPieces);
        this.black_score_section.createScoreSectionHTML("black-scoreboard");
        this.black_score_section.scoreSectionHTML.className += " " + "section-scoreboard-upper"
        this.chessBoardWrapperHTML.prepend(this.black_score_section.scoreSectionHTML);
        
        this.white_score_section = new ScoreSection(this.player_white, this.whiteCounter, this.capturedPieces);
        this.white_score_section.createScoreSectionHTML("white-scoreboard");
        this.white_score_section.scoreSectionHTML.className += " " + "section-scoreboard-lower"
        this.chessBoardWrapperHTML.append(this.white_score_section.scoreSectionHTML);
        
        this.timerRunningColor = getComputedStyle(document.documentElement).getPropertyValue("--timer-running");
        this.timerIdleColor = getComputedStyle(document.documentElement).getPropertyValue("--timer-idle");
        this.whiteCounter.countHTML.style.backgroundColor = this.timerRunningColor;
        
        this.changeTimerIconColor(this.whiteCounter.countHTML, Colors.Green);
        this.addStartingPiecesToBoard();
        this.addClickableSquareForPieces(Colors.White);
        this.generateAllMovesPieces();
        this.refreshCapturedMaterialDisplay();
        
        this.whiteKing;
        this.blackKing;
        
        this.whiteLeftRook;
        this.whiteRightRook;
        
        this.blackLeftRook;
        this.blackRightRook;
        
        this.pastSquareHighlightHTML1 = this.createPastMoveSquare();
        this.pastSquareHighlightHTML2 = this.createPastMoveSquare();
        
        this.white_score_section.refreshAll();
                
    }
    //------------------------------------------------------------------------------------------------

    addStartingPiecesToBoard() 
    {
        // White Pieces ---------------------------------------------------------------------
        // Pawns
        let x = 'a';
        let y = 2;
        for (let i = 1; i < 9; i++) 
        {
            const coordinate = x + y;
            const square = document.getElementById(coordinate);
            this.addPieceToBoardGame(new Pawn(Colors.White, coordinate, this.chessBoard));
            x = nextChar(x);
        }
        
        // Knights
        this.addPieceToBoardGame(new Knight(Colors.White, "b1", this.chessBoard));
        this.addPieceToBoardGame(new Knight(Colors.White, "g1", this.chessBoard));

        // Bishops
        this.addPieceToBoardGame(new Bishop(Colors.White, "c1", this.chessBoard));
        this.addPieceToBoardGame(new Bishop(Colors.White, "f1", this.chessBoard));

        // Rooks
        this.addPieceToBoardGame(new Rook(Colors.White, "a1", this.chessBoard));
        this.addPieceToBoardGame(new Rook(Colors.White, "h1", this.chessBoard));

        // Queen
        this.addPieceToBoardGame(new Queen(Colors.White, "d1", this.chessBoard));

        // King
        this.addPieceToBoardGame(new King(Colors.White, "e1", this.chessBoard));


        // Black Pieces----------------------------------------------------------------------
        // Pawns
        y = 7;
        x = 'a';
        for (let i = 1; i < 9; i++)
        {
            const coordinate = x + y;
            this.addPieceToBoardGame(new Pawn(Colors.Black, coordinate, this.chessBoard));
            x = nextChar(x);
        }

        // Knights
        this.addPieceToBoardGame(new Knight(Colors.Black, "b8", this.chessBoard));
        this.addPieceToBoardGame(new Knight(Colors.Black, "g8", this.chessBoard));

        // Bishops
        this.addPieceToBoardGame(new Bishop(Colors.Black, "c8", this.chessBoard));
        this.addPieceToBoardGame(new Bishop(Colors.Black, "f8", this.chessBoard));

        // Rooks
        this.addPieceToBoardGame(new Rook(Colors.Black, "a8", this.chessBoard));
        this.addPieceToBoardGame(new Rook(Colors.Black, "h8", this.chessBoard));

        // Queen
        this.addPieceToBoardGame(new Queen(Colors.Black, "d8", this.chessBoard));

        // King
        this.addPieceToBoardGame(new King(Colors.Black, "e8", this.chessBoard));

        this.whiteKing = this.allPieces[0][5][0];
        this.blackKing = this.allPieces[1][5][0];
        
        this.whiteLeftRook = this.allPieces[0][3][0];
        this.whiteRightRook = this.allPieces[0][3][1];
        
        this.blackLeftRook = this.allPieces[1][3][0];
        this.blackRightRook = this.allPieces[1][3][1];
    }

    rotateBoard() {
        
        // TODO - Coordinates rotation
        let pieceImages = document.getElementsByClassName("piece-img");

        if (!this.whiteTurnToMove) {

            this.black_score_section.scoreSectionHTML.className = "section-scoreboard section-scoreboard-lower";
            this.chessBoardWrapperHTML.append(this.black_score_section.scoreSectionHTML);
            this.white_score_section.scoreSectionHTML.className = "section-scoreboard section-scoreboard-upper";
            this.chessBoardWrapperHTML.prepend(this.white_score_section.scoreSectionHTML);

            this.chessBoard.chessBoardHTML.style.transform = "rotate(180deg)";

            for (let i = 0; i < pieceImages.length; i++) {
                const img = pieceImages[i];

                img.style.transform = "rotate(180deg) translate(50%,50%)";
            }
        }
        else if (this.whiteTurnToMove) {

            this.black_score_section.scoreSectionHTML.className = "section-scoreboard section-scoreboard-upper";
            this.chessBoardWrapperHTML.prepend(this.black_score_section.scoreSectionHTML);
            this.white_score_section.scoreSectionHTML.className = "section-scoreboard section-scoreboard-lower";
            this.chessBoardWrapperHTML.append(this.white_score_section.scoreSectionHTML);

            this.chessBoard.chessBoardHTML.style.transform = "rotate(0deg)"

            for (let i = 0; i < pieceImages.length; i++) {
                const img = pieceImages[i];

                img.style.transform = "translate(-50%,-50%)";
            }
        }
    }

    setOponnetTurnToMove() {

        this.removeAllClickableSquares();

        if (this.whiteTurnToMove) {
            this.whiteTurnToMove = false;
            this.whiteCounter.countHTML.style.backgroundColor = this.timerIdleColor;
            this.blackCounter.countHTML.style.backgroundColor = this.timerRunningColor;
            this.changeTimerIconColor(this.whiteCounter.countHTML, Colors.Orange);
            this.changeTimerIconColor(this.blackCounter.countHTML, Colors.Green);
            this.addClickableSquareForPieces(Colors.Black);
        }
        else if (!this.whiteTurnToMove) {
            this.whiteTurnToMove = true;
            this.whiteCounter.countHTML.style.backgroundColor = this.timerRunningColor;
            this.blackCounter.countHTML.style.backgroundColor = this.timerIdleColor;
            this.changeTimerIconColor(this.whiteCounter.countHTML, Colors.Green);
            this.changeTimerIconColor(this.blackCounter.countHTML, Colors.Orange);
            this.addClickableSquareForPieces(Colors.White);
        }

        this.rotationEnabled ? this.rotateBoard() : null;
    }

    changeTimerIconColor(timerSectionHTML, color) {

        let img_color_src;
        switch (color) {
            case Colors.White:
                img_color_src = "images/icons/icon_timer_white.png";
            break;

            case Colors.Green:
                img_color_src = "images/icons/icon_timer_green.png";
            break;

            case Colors.Orange:
                img_color_src = "images/icons/icon_timer_orange.png";
            break;
        }

        const timer_icon = timerSectionHTML.getElementsByClassName("timer-icon");
        for (let i = 0; i < timer_icon.length; i++) {
            const element = timer_icon[i];
            element.src = img_color_src;
        }
    }

    generateAllMovesPieces() {

        // Clear previous target squares by pieces
        this.chessBoard.clearPiecesTargetSquare();

        // All moves
        for (let i = 0; i < 2; i++) {
            this.allPieces.forEach(coloredPiecesSet => {
                coloredPiecesSet.forEach(slot => {
                    slot.forEach(piece => {
                        piece.generateMoves();
                    });
                });
            });     
        }

        // Legal moves
        for (let i = 0; i < 2; i++) {
            this.allPieces.forEach(coloredPiecesSet => {
                coloredPiecesSet.forEach(slot => {
                    slot.forEach(piece => {
                        piece.filterGeneratedMovesToLegal();
                    });
                });
            });     
        }
    }

    determineKingCheckedCurrentPosition(king) {

        const kingSquare = king.currentSquare.square;

        // White King is checked by Black pieces
        if (king.color === Colors.White) {
            for (const piecesSetKey in allPieces[1]) {
                const piecesSet = allPieces[1][piecesSetKey];

                for (const pieceKey in piecesSet) {
                    const piece = piecesSet[pieceKey];
                    const futureAllMoves = piece.generateAllMoves(piece.currentSquare);
                    const futureLegalMoves = piece.generateLegalMoves(piece.currentSquare, futureAllMoves);

                    for (const moveKey in futureLegalMoves) {   
                        const move = futureLegalMoves[moveKey];               
                        if (move.moveSquare === kingSquare) {
                            console.log("KING CHECK", move.moveSquare)
                            return true
                        }
                    }
                }
            }
        }

        // Black king is checked by White pieces
        else {
            for (const piecesSetKey in allPieces[0]) {
                const piecesSet = allPieces[0][piecesSetKey];

                for (const pieceKey in piecesSet) {
                    const piece = piecesSet[pieceKey];
                    const futureAllMoves = piece.generateAllMoves(piece.currentSquare);
                    const futureLegalMoves = piece.generateLegalMoves(piece.currentSquare, futureAllMoves);

                    for (const moveKey in futureLegalMoves) {   
                        const move = futureLegalMoves[moveKey];               
                        if (move.moveSquare === kingSquare) {
                            console.log("KING CHECK", move.moveSquare)
                            return true
                        }
                    }
                }
            }
        }

        return false;
    };

    refreshCapturedMaterialDisplay() {

        let blackSectionScore = this.black_score_section.materialSectionHTML;
        let whiteSectionScore = this.white_score_section.materialSectionHTML;

        // Clear previous elements
        blackSectionScore.innerHTML = "";
        whiteSectionScore.innerHTML = "";

        let evaluationArray = this.evaluateMaterialDifference();
        let colorLeading = evaluationArray[0];
        let score = evaluationArray[1];
        
        blackSectionScore.className = "section-material-captured-no-background";
        whiteSectionScore.className = "section-material-captured-no-background";

        if (score != 0) {
            // White captured Pieces
            let slotCount = -1;
            let whiteCapturedDisplayCount = 0;
            this.capturedPieces[0].forEach(slot => {
                slotCount++;
                let capturedPiecesCount = slot.length;
                let myPiecesCount = this.capturedPieces[1][slotCount].length;
                let difference = capturedPiecesCount - myPiecesCount;

                let count = 0;
                for (let i = 0; i < difference; i++) {
                    const piece = slot[i];
                    if (count != difference && difference > 0) {
                        var img = createPieceImageCaptured(piece);
                        img.className = "material-img";
                        blackSectionScore.appendChild(img);
                    }
                    count++;
                    whiteCapturedDisplayCount++;
                }
            });
            if (score > 0 && whiteCapturedDisplayCount != 0) {
                const scoreLabel = document.createElement("label");
                if (colorLeading === Colors.Black) {
                    scoreLabel.innerHTML = "+" + score;
                    scoreLabel.className = "score-label";
                }
                blackSectionScore.className = "section-material-captured";
                blackSectionScore.append(scoreLabel);
            }

            // Black captured Pieces
            slotCount = -1;
            let blackCapturedDisplayCount = 0;
            this.capturedPieces[1].forEach(slot => {
                slotCount++;
                let capturedPiecesCount = slot.length;
                let myPiecesCount = this.capturedPieces[0][slotCount].length;
                let difference = capturedPiecesCount - myPiecesCount;

                let count = 0;
                for (let i = 0; i < difference; i++) {
                    const piece = slot[i];
                    if (count != difference && difference > 0) {
                        var img = createPieceImageCaptured(piece);
                        img.className = "material-img";
                        whiteSectionScore.appendChild(img);
                        blackCapturedDisplayCount++;
                    }
                    count++;
                }
            });
            if (score > 0 && blackCapturedDisplayCount != 0) {
                const scoreLabel = document.createElement("label");
                if (colorLeading === Colors.White) {
                    scoreLabel.innerHTML = "+" + score;
                    scoreLabel.className = "score-label";
                }
                whiteSectionScore.className = "section-material-captured";
                whiteSectionScore.append(scoreLabel);
            }
        }
    }

    evaluateMaterialDifference() {
        let blackScore = 0;
        let whiteScore = 0;

        // White Pieces score
        this.capturedPieces[1].forEach(slot => {
            slot.forEach(piece => {
                piece.pieceType === Pieces.Pawn ? whiteScore += 1 : null;
                piece.pieceType === Pieces.Knight ? whiteScore += 3 : null;
                piece.pieceType === Pieces.Bishop ? whiteScore += 3 : null;
                piece.pieceType === Pieces.Rook ? whiteScore += 5 : null;
                piece.pieceType === Pieces.Queen ? whiteScore += 9 : null;
            });
        });

        // Black Pieces score
        this.capturedPieces[0].forEach(slot => {
            slot.forEach(piece => {
                piece.pieceType === Pieces.Pawn ? blackScore += 1 : null;
                piece.pieceType === Pieces.Knight ? blackScore += 3 : null;
                piece.pieceType === Pieces.Bishop ? blackScore += 3 : null;
                piece.pieceType === Pieces.Rook ? blackScore += 5 : null;
                piece.pieceType === Pieces.Queen ? blackScore += 9 : null;
            });
        });

        let difference = whiteScore - blackScore;
        console.log("Diff: ", difference);
        if (difference === 0) {
            return [null, difference];
        }
        else if (difference > 0) {
            return [Colors.White, difference];
        } else if (difference < 0) {
            return [Colors.Black, difference*(-1)];
        }
    }

    addPieceToBoardGame(piece) {

        const square = piece.currentSquare;

        const squareHTML = this.chessBoard.getSquareHTML(piece.currentSquare.square);

        if (!square.hasPiece) {
            // Update square object
            square.currentPiece = piece;
            square.hasPiece = true;

            addPieceTo2DArrayList(piece, this.allPieces);

            var img = createPieceImage(piece.pieceType, piece.color);

            img.className = "piece-img";
            squareHTML.appendChild(img);
        }
    }


    addCapturedPieceToList(capturedPiece) {

        // CIA IMPLEMENT
        console.log("ADD CAPTURE PIECE LIST");
        let piecesSet;
        if (capturedPiece.color == Colors.White) {
            piecesSet = this.allPieces[0];
        } else {
            piecesSet = this.allPieces[1];
        }

        console.log("Pieces Set ", piecesSet);

        let foundPiece = false;
        piecesSet.forEach(set => {
            
            for (let i = 0; i < set.length; i++) {
                
                if (set[i] === capturedPiece) {
                    set.splice(i, 1);
                    foundPiece = true;
                    break;
                }
            }
        });

        if (foundPiece) {
            addPieceTo2DArrayList(capturedPiece, this.capturedPieces);
        }
    }


    movePieceOnBoard(piece, move) {

        const selectedSquare = this.currentlySelectedPiece.currentSquare;
        const selectedSquareHTML = this.chessBoard.getSquareHTML(selectedSquare.square);

        const targetSquare = this.chessBoard.getSquareByCoordinate(move.moveSquare);
        const targetSquareHTML = this.chessBoard.getSquareHTML(move.moveSquare);

        const selectedSquarePieceHTML = selectedSquareHTML.querySelector(".piece-img");

        // Remove Red overlay King Check Indication
        // Clear checkGivenByPieces list
        if (this.whiteKingChecked || this.blackKingChecked) {
            this.removeCheckedOverlay();
            this.checkGivenByPieces = [];
        }

        switch (move.moveType) {

            case MoveType.Regular:
                this.performRegularMove(piece, move, targetSquare,
                                targetSquareHTML, selectedSquare,
                                selectedSquareHTML, selectedSquarePieceHTML);
            break;

            case MoveType.Capture:
                this.performCaptureMove(piece, move, targetSquare,
                    selectedSquare, selectedSquareHTML, 
                    selectedSquarePieceHTML, targetSquareHTML);
            break;

            case MoveType.LeftCastle:
                this.performCastleMove(piece, targetSquare,
                    targetSquareHTML, selectedSquare,
                    selectedSquareHTML, selectedSquarePieceHTML, MoveType.LeftCastle);
            break;

            case MoveType.RightCastle:
                this.performCastleMove(piece, targetSquare,
                    targetSquareHTML, selectedSquare,
                    selectedSquareHTML, selectedSquarePieceHTML, MoveType.RightCastle);
            break;

            case MoveType.EnPassant:
                this.performEnPassantMove(piece, move, targetSquare,
                    selectedSquare, selectedSquareHTML, 
                    selectedSquarePieceHTML, targetSquareHTML);
                this.isEnPassant = false;
                this.enPassantSquare = null;
                this.enPassantPiece = null;

                // Clear en passant square from pawns
                if (piece.color === Colors.White) {
                    // White Pawns
                    this.allPieces[0][0].forEach(pawn => {
                        pawn.enPassantSquare = null;
                    });
                } else {
                    // Black pawns
                    this.allPieces[1][0].forEach(pawn => {
                        pawn.enPassantSquare = null;
                    });
                }
            break;

            case MoveType.Promotion:
                console.log("PROMOTED", piece.pieceType,
                            piece.color, piece.currentSquare.square);
                this.setSquarePastMove(selectedSquare.square, targetSquare.square);
                this.pauseGame(false);
                // Regular move promotion
                if (move.moveSecondaryType === MoveType.Regular) {
                    this.promotionMoveAction(piece, move, targetSquare, targetSquareHTML,
                        selectedSquare, selectedSquareHTML, selectedSquarePieceHTML,
                        MoveType.Regular, this.promotionMenu);
                }
                // Promotion with a capture move
                else if (move.moveSecondaryType === MoveType.Capture) {
                    this.promotionMoveAction(piece, move, targetSquare, targetSquareHTML,
                        selectedSquare, selectedSquareHTML, selectedSquarePieceHTML,
                        MoveType.Capture, this.promotionMenu);
                }
            break;
        }

        this.gameStarted ? null : this.determineIfGameHasStarted(piece);
        this.setSquarePastMove(selectedSquare.square, targetSquare.square);
        this.refreshGameAfterAction();
    }

    setSquarePastMove(squarePast, squareNew) {

        if (!this.gamePausedUserAction) {

            // Clear previous squares highlights
            if (this.pastSquarePieceBeforeMoveHTML != null && this.newSquarePieceAfterMoveHTML != null) {
                this.pastSquareHighlightHTML1.remove();
                this.pastSquareHighlightHTML2.remove();
                this.pastSquarePieceBeforeMoveHTML = null;
                this.newSquarePieceAfterMoveHTML = null;
            }
            
            // Create the new highlights
            this.pastSquarePieceBeforeMoveHTML = this.chessBoard.getSquareHTML(squarePast);
            this.pastSquarePieceBeforeMoveHTML.append(this.pastSquareHighlightHTML1);
            
            this.newSquarePieceAfterMoveHTML = this.chessBoard.getSquareHTML(squareNew);
            this.newSquarePieceAfterMoveHTML.append(this.pastSquareHighlightHTML2);
        }

    }

    determineIfGameHasStarted(piece) {
        if (!this.gameStarted) {   
            if (!this.whiteHasmoved && piece.color === Colors.White) {
                this.whiteHasmoved = true;
            } else if (!this.blackHasMoved && piece.color === Colors.Black) {
                this.blackHasMoved = true;
            }
            (this.whiteHasmoved && this.blackHasMoved) ? this.gameStarted = true : null;

            if (this.gameStarted) {
                console.log("STARTING THE GAME!!!!!!!");
                sound.soundGameStart.play();
            }
        }
    }

    promotionMoveAction(piece, move, targetSquare, targetSquareHTML,
                                selectedSquare, selectedSquareHTML, selectedSquarePieceHTML,
                                promotionSecondMoveType, promotionMenu) {

        this.promotionMenu.showRefreshMenu(this.whiteTurnToMove, piece, move);
        
        let pieceToPromoteTo;
        //async function pauseUntilEvent(clickListenerPromise) {
        let pauseUntilEvent = async (clickListenerPromise) => {
            console.log('start')
            await clickListenerPromise

            console.log('end')

            pieceToPromoteTo = promotionMenu.currentlySelectedPiece;
            console.log("PROMOTING TO:", pieceToPromoteTo);

            promotionMenu.resetPromotionMenu();

            if (promotionSecondMoveType === MoveType.Regular) {
                this.performRegularMove(piece, move, targetSquare,
                    targetSquareHTML, selectedSquare,
                    selectedSquareHTML, selectedSquarePieceHTML);
                sound.soundRegularMove.play();
            }
            else if (promotionSecondMoveType === MoveType.Capture) {
                this.performCaptureMove(piece, move,targetSquare,
                    selectedSquare, selectedSquareHTML, 
                    selectedSquarePieceHTML, targetSquareHTML);
                sound.soundCheck.play();
            }

            // Remove previous pawn piece
            this.removePieceFromBoardCompletely(piece);
            
            // ADD NEW PIECE
            this.addPieceToBoardGame(this.createPromotedPiece(pieceToPromoteTo, piece.color, move.moveSquare));
            
            this.unpauseGame();
            this.setSquarePastMove(selectedSquare.square, targetSquare.square);
        }
        
        function createClickListenerPromise (target) {
            return new Promise((resolve) => target.addEventListener('click', (resolve)));
        }
        
        pauseUntilEvent(createClickListenerPromise(this.chessBoardWrapperHTML.getElementsByClassName('promotion-button')[0]))

    }

    createPromotedPiece(pieceType, pieceColor, promotionMove) {
        let wantedPiece;
        switch(pieceType) {
            case Pieces.Knight:
                wantedPiece = new Knight(pieceColor, promotionMove, this.chessBoard)
            break;
            case Pieces.Bishop:
                wantedPiece = new Bishop(pieceColor, promotionMove, this.chessBoard)
            break;
            case Pieces.Rook:
                wantedPiece = new Rook(pieceColor, promotionMove, this.chessBoard)
            break;
            case Pieces.Queen:
                wantedPiece = new Queen(pieceColor, promotionMove, this.chessBoard)
            break;
        }
        wantedPiece.promotedFromPawn = true;

        return wantedPiece;
    }

    refreshGameAfterAction() {

        // Re-calcualte all piece moves
        if (!this.gamePausedUserAction) {

            this.switchStartTimer();
            this.generateAllMovesPieces();
            this.setOponnetTurnToMove();
            this.refreshCapturedMaterialDisplay();
            
            console.log(this.chessBoard);
            console.log("All Pieces", this.allPieces);
            console.table("Captured Pieces", this.capturedPieces);
        }
    }

    pauseGame(isTimerPaused) {
        this.gamePausedUserAction = true;
        if (isTimerPaused) {
            this.whiteTurnToMove ? this.whiteCounter.stopCounter() : this.blackCounter.stopCounter();
        }
        this.clearAllDotsOnTheBoard();
        this.removeAllClickableSquares();
    }

    setGamePausedUserAction() {
        this.gamePausedUserAction = !this.gamePausedUserAction;
    }

    unpauseGame() {
        this.gamePausedUserAction = false;

        this.clearAllDotsOnTheBoard();
        this.removeAllClickableSquares();
        this.generateAllMovesPieces();
        this.refreshCapturedMaterialDisplay();
        
        if (!this.whiteTurnToMove) {
            this.addClickableSquareForPieces(Colors.Black);
        } else {
            this.addClickableSquareForPieces(Colors.White);
        }
    }

    switchStartTimer() {
        // Switch timer to opponent and start counting

        if (this.whiteHasmoved && this.blackHasMoved) {    
            this.whiteTurnToMove ? 
            (this.blackCounter.startCounter(), this.whiteCounter.stopCounter()) 
            : (this.whiteCounter.startCounter(), this.blackCounter.stopCounter());
        }
    }

    removePieceFromBoardCompletely(piece) {

        const currentSquare = piece.currentSquare;
        const currentSquareHTML = this.chessBoard.getSquareHTML(currentSquare.square);
    
        // Current Square
        currentSquare.currentPiece = null;
        currentSquare.hasPiece = false;

        // Display change in HTML DOM
        currentSquareHTML.innerHTML = "";

        // Piece remove
        removePieceFrom2DArrayList(piece, this.allPieces);
    }

    resetEnPassantPawns() {
        this.allPieces[0][0].forEach(pawn => {
            pawn.enPassantSquare = null;
            pawn.isEnPassant = false;
        });

        this.allPieces[1][0].forEach(pawn => {
            pawn.enPassantSquare = null;
            pawn.isEnPassant = false;
        });
    }

    performRegularMove(piece, move, targetSquare, targetSquareHTML, 
                                selectedSquare, selectedSquareHTML, 
                                selectedSquarePieceHTML) {

        // If pawn and enpassant
        if (piece.pieceType === Pieces.Pawn && !piece.hasMoved) {
            // If double forward move
            if (move.moveSquare === piece.doubleForwardMove) {

                let yPassant = piece.doubleForwardMove.slice(1, 2);
                let xPassant = piece.doubleForwardMove.slice(0, 1);

                this.isEnPassant = true;
                piece.color != Colors.Black ? this.enPassantSquare = xPassant+(Number(yPassant)-1)
                                            : this.enPassantSquare = xPassant+(Number(yPassant)+1);
                this.enPassantPiece = piece;

                // Update all pawns en passant square
                if (piece.color === Colors.Black) {
                    // White Pawns
                    this.allPieces[0][0].forEach(pawn => {
                        pawn.enPassantSquare = this.enPassantSquare;
                        pawn.isEnPassant = true;
                    });
                } else {
                    // Black pawns
                    this.allPieces[1][0].forEach(pawn => {
                        pawn.enPassantSquare = this.enPassantSquare;
                        pawn.isEnPassant = true;
                    });
                }

                console.log("PASSANT", this.enPassantSquare, this.enPassantPiece);
            } else {
                this.isEnPassant ? this.isEnPassant = false : null;
                this.enPassantSquare != null ? this.enPassantSquare = null : null
                this.enPassantPiece != null ? this.enPassantPiece = null : null
                this.resetEnPassantPawns();
            }
        } else {
            this.isEnPassant ? this.isEnPassant = false : null;
            this.enPassantSquare != null ? this.enPassantSquare = null : null
            this.enPassantPiece != null ? this.enPassantPiece = null : null
            this.resetEnPassantPawns();
        }
        
        // TEST--------------------------------
        if (move.moveSecondaryType != null) {

            // Regular Check move
            if (move.moveSecondaryType === MoveType.Check) {
                console.log("CHEEEEEEEEECK");

                this.removeCheckedOverlay();
                this.kingCheckedOverlayRemoved = false;

                // FIX THISSSSSSSSSSSSSS IMPLEMENT KITUS 
                if (piece.color != Colors.Black) {
                    this.blackKingChecked = true;
                    const squareHTML = this.chessBoard.getSquareHTML(this.blackKing.currentSquare.square);
                    const checkedOverlay = this.createCheckedOverlay();
                    squareHTML.appendChild(checkedOverlay);
                } else {
                    this.whiteKingChecked = true;
                    const squareHTML = this.chessBoard.getSquareHTML(this.whiteKing.currentSquare.square);
                    const checkedOverlay = this.createCheckedOverlay();
                    squareHTML.appendChild(checkedOverlay);
                }
                sound.soundCheck.play();
                
            }
        }
        // -----------------------------------------
        // Target Square
        targetSquare.currentPiece = piece;
        targetSquare.hasPiece = true;
        console.log(targetSquareHTML);

        // Selected Square
        selectedSquare.currentPiece = null;
        selectedSquare.hasPiece = false;
        selectedSquareHTML.removeChild(selectedSquarePieceHTML);
        this.restoreDefaultSquareColor();

        // Display in HTML DOM
        targetSquareHTML.appendChild(createPieceImage(piece.pieceType, piece.color));

        // Piece update
        piece.currentSquare = targetSquare;

        if (!piece.hasMoved) {
            piece.hasMoved = true;
        }

        sound.soundRegularMove.play();
    }

    performCaptureMove(piece, move,targetSquare,
                                selectedSquare, selectedSquareHTML, 
                                selectedSquarePieceHTML, targetSquareHTML) {

        // TEST--------------------------------
        if (move.moveSecondaryType != null) {
            if (move.moveSecondaryType === MoveType.Check) {
                console.log("CHEEEEEEEEECK");

                this.removeCheckedOverlay();
                this.kingCheckedOverlayRemoved = false;

                // FIX THISSSSSSSSSSSSSS IMPLEMENT KITUS
                if (piece.color != Colors.Black) {
                    this.blackKingChecked = true;
                    const squareHTML = this.chessBoard.getSquareHTML(this.blackKing.currentSquare.square);
                    const checkedOverlay = this.createCheckedOverlay();
                    squareHTML.appendChild(checkedOverlay);
                } else {
                    this.whiteKingChecked = true;
                    const squareHTML = this.chessBoard.getSquareHTML(this.whiteKing.currentSquare.square);
                    const checkedOverlay = this.createCheckedOverlay();
                    squareHTML.appendChild(checkedOverlay);
                }
                sound.soundCheck.play();
            }
        }
        //---------------------------------------------

        const capturedPiece = targetSquare.currentPiece;

        // Target Square
        targetSquare.hasPiece = true;

        // Selected Square
        selectedSquare.currentPiece = null;
        selectedSquare.hasPiece = false;
        selectedSquareHTML.removeChild(selectedSquarePieceHTML);
        this.restoreDefaultSquareColor();

        // Display in HTML DOM
        const targetPieceHTML = targetSquareHTML.querySelector(".piece-img");
        targetPieceHTML.remove();
        targetSquareHTML.appendChild(createPieceImage(piece.pieceType, piece.color));

        // Piece update
        piece.currentSquare = targetSquare;

        if (!piece.hasMoved) {
            piece.hasMoved = true;
        }

        // After each capture create new promotion square
        if (piece.pieceType === Pieces.Pawn) {
            piece.generatePromotionSquares();
        }

        this.addCapturedPieceToList(capturedPiece);
        targetSquare.currentPiece = piece;

        sound.soundCapture.play();
    }

    performEnPassantMove(piece, move, targetSquare,
                                selectedSquare, selectedSquareHTML, 
                                selectedSquarePieceHTML, targetSquareHTML) {

        // TEST--------------------------------
        if (move.moveSecondaryType != null) {
            if (move.moveSecondaryType === MoveType.Check) {
                console.log("CHEEEEEEEEECK");

                this.removeCheckedOverlay();
                this.kingCheckedOverlayRemoved = false;

                // TODO - fix
                if (piece.color != Colors.Black) {
                    this.blackKingChecked = true;
                    const squareHTML = this.chessBoard.getSquareHTML(this.blackKing.currentSquare.square);
                    const checkedOverlay = this.createCheckedOverlay();
                    squareHTML.appendChild(checkedOverlay);
                } else {
                    this.whiteKingChecked = true;
                    const squareHTML = this.chessBoard.getSquareHTML(this.whiteKing.currentSquare.square);
                    const checkedOverlay = createCheckedOverlay();
                    squareHTML.appendChild(checkedOverlay);
                }
                sound.soundCheck.play();
            }
        }
        //---------------------------------------------

        const capturedPiece = this.enPassantPiece;

        // Target Square
        targetSquare.hasPiece = true;

        // Selected Square
        selectedSquare.currentPiece = null;
        selectedSquare.hasPiece = false;
        selectedSquareHTML.removeChild(selectedSquarePieceHTML);
        this.restoreDefaultSquareColor();

        // Display in HTML DOM
        const targetPieceSquare = this.enPassantPiece.currentSquare
        targetPieceSquare.currentPiece = null;
        targetPieceSquare.hasPiece = false;
        const capturePieceHTML = this.chessBoard.getSquareHTML(targetPieceSquare.square);
        const targetPieceHTML = capturePieceHTML.querySelector(".piece-img");
        targetPieceHTML.remove();
        targetSquareHTML.appendChild(createPieceImage(piece.pieceType, piece.color));
        
        // Piece update
        piece.currentSquare = targetSquare;

        if (!piece.hasMoved) {
            piece.hasMoved = true;
        }

        // After each capture create new promotion square
        if (piece.pieceType === Pieces.Pawn) {
            piece.generatePromotionSquares();
        }

        this.addCapturedPieceToList(capturedPiece);
        targetSquare.currentPiece = piece;
        sound.soundCapture.play();
    }

    performCastleMove(kingPiece, targetSquare, targetSquareHTML,
        selectedSquare, selectedSquareHTML,
        selectedSquarePieceHTML, castleSide) {
        console.log("Castle Move:", kingPiece.color, kingPiece.pieceType);

        // King Target Square
        targetSquare.currentPiece = kingPiece;
        targetSquare.hasPiece = true;
        console.log(targetSquareHTML)

        // King Selected Square
        selectedSquare.currentPiece = null;
        selectedSquare.hasPiece = false;
        selectedSquareHTML.removeChild(selectedSquarePieceHTML);
        this.restoreDefaultSquareColor()

        // King Display in HTML DOM
        targetSquareHTML.appendChild(createPieceImage(kingPiece.pieceType, kingPiece.color))

        // King update
        kingPiece.currentSquare = targetSquare
        if (!kingPiece.hasMoved) {
            kingPiece.hasMoved = true;
        }
        kingPiece.hasCastled = true

        // Move rook
        let rookPiece;
        let newRookSquareCoordinate;
        if (kingPiece.color === Colors.White) {
            if (castleSide === MoveType.LeftCastle) {
                rookPiece = this.whiteLeftRook;
                newRookSquareCoordinate = "d1";
            }
            else if (castleSide === MoveType.RightCastle) {
                rookPiece = this.whiteRightRook;
                newRookSquareCoordinate = "f1";
            }
        } else {
            rookPiece = this.blackLeftRook;
            if (castleSide === MoveType.LeftCastle) {
                rookPiece = this.blackLeftRook;
                newRookSquareCoordinate = "d8";
            }
            else if (castleSide === MoveType.RightCastle) {
                rookPiece = this.blackRightRook;
                newRookSquareCoordinate = "f8";
            }
        }
        const newRookSquare = this.chessBoard.getSquareByCoordinate(newRookSquareCoordinate);
        const newRookSquareHTML = this.chessBoard.getSquareHTML(newRookSquareCoordinate)
        
        const currentRookSquareHTML = this.chessBoard.getSquareHTML(rookPiece.currentSquare.square);
        const targetRookPieceHTML = currentRookSquareHTML.querySelector(".piece-img");
        targetRookPieceHTML.remove()

        rookPiece.currentSquare.hasPiece = false;
        rookPiece.currentSquare.currentPiece = null;
        rookPiece.currentSquare = newRookSquare

        newRookSquare.currentPiece = rookPiece;
        newRookSquare.hasPiece = true;
        newRookSquareHTML.appendChild(createPieceImage(rookPiece.pieceType, rookPiece.color));
        
        sound.soundCastling.play(); 
    }

    createMovesAsDotsOnTheBoard(piece) {

        piece.legalMoves.forEach(legalMove => {

            const squareHTML = this.chessBoard.getSquareHTML(legalMove.moveSquare);

            let clickableDot;
            if (legalMove.moveType === MoveType.Regular 
                || legalMove.moveType === MoveType.LeftCastle
                || legalMove.moveType === MoveType.RightCastle
                || (legalMove.moveType === MoveType.Promotion
                    && legalMove.moveSecondaryType === MoveType.Regular)) {
                clickableDot = document.createElement("div");
                clickableDot.className = "clickable-dot";
            }
            else if (legalMove.moveType === MoveType.Capture
                || (legalMove.moveType === MoveType.Promotion
                    && legalMove.moveSecondaryType === MoveType.Capture)
                || legalMove.moveType === MoveType.EnPassant) {
                clickableDot = this.createClickableSquareOverlay();
            }

            // Dot on click event
            squareHTML.onclick = () => {
                
                this.movePieceOnBoard(piece, legalMove);

                console.log(`This is move: ${legalMove.moveSquare}`)

                this.restoreDefaultSquareColor();
                this.clearAllDotsOnTheBoard();

                this.currentlySelectedPiece = null;
            }

            squareHTML.appendChild(clickableDot);
            squareHTML.style.cursor = "pointer";

            this.currentlyDisplayedDots.push(legalMove);
        });
    }

    createCheckedOverlay() {
        const checkedOverlay = document.createElement("div");
        checkedOverlay.id = "checked-overlay";
        return checkedOverlay;
    }

    removeCheckedOverlay() {
        if (this.blackKingChecked) {
            this.blackKingChecked = false;

            if (!this.kingCheckedOverlayRemoved) {
                const squareHTML = this.chessBoard.getSquareHTML(this.blackKing.currentSquare.square);
                const removeRedCheckOverlay = document.getElementById("checked-overlay");
                squareHTML.removeChild(removeRedCheckOverlay);
            }
        }
        else if (this.whiteKingChecked) {
            this.whiteKingChecked = false;

            if (!this.kingCheckedOverlayRemoved) {
                const squareHTML = this.chessBoard.getSquareHTML(this.whiteKing.currentSquare.square);
                const removeRedCheckOverlay = document.getElementById("checked-overlay");
                squareHTML.removeChild(removeRedCheckOverlay);
            }
        }
    }

    createClickableSquareOverlay() {

        const squareDiv = document.createElement("div");
        squareDiv.className = "square-div";
        
        // Upper-left corner
        const holeDiv1 = document.createElement("div");
        holeDiv1.className = "div-hole-1";

        // Lower-left corner
        const holeDiv2 = document.createElement("div");
        holeDiv2.className = "div-hole-2";

        // Lower-left corner
        const holeDiv3 = document.createElement("div");
        holeDiv3.className = "div-hole-3";

        // Lower-left corner
        const holeDiv4 = document.createElement("div");
        holeDiv4.className = "div-hole-4";

        squareDiv.append(holeDiv1, holeDiv2, holeDiv3, holeDiv4)

        return squareDiv;
    }

    createSelectedSquareBackground() {
        const squareDiv = document.createElement("div");
        squareDiv.className = "currently-selected-square";
        return squareDiv;
    }

    createPastMoveSquare() {
        const squareDiv = document.createElement("div");
        squareDiv.className = "past-move-square";
        return squareDiv;
    }

    clearAllDotsOnTheBoard() {

        this.currentlyDisplayedDots.forEach(legalMoveDot => {

            const squareHTML = this.chessBoard.getSquareHTML(legalMoveDot.moveSquare);
            const square = this.chessBoard.getSquareByCoordinate(legalMoveDot.moveSquare);

            let dotOnBoard;
            if (legalMoveDot.moveType === MoveType.Regular
                || legalMoveDot.moveType === MoveType.LeftCastle
                || legalMoveDot.moveType === MoveType.RightCastle
                || (legalMoveDot.moveType === MoveType.Promotion
                    && legalMoveDot.moveSecondaryType === MoveType.Regular)) {
                dotOnBoard = squareHTML.querySelector(".clickable-dot");
            }
            else if (legalMoveDot.moveType === MoveType.Capture
                || (legalMoveDot.moveType === MoveType.Promotion
                    && legalMoveDot.moveSecondaryType === MoveType.Capture)
                || legalMoveDot.moveType === MoveType.EnPassant) {
                dotOnBoard = squareHTML.querySelector(".square-div");
            }

            squareHTML.onclick = "";
            squareHTML.style.cursor = "default";
            
            //if (!whiteKingChecked && !blackKingChecked) {

            if (square.hasPiece) {
                if (square.currentPiece.color === Colors.White && this.whiteTurnToMove) {
                    squareHTML.onclick = () => {
                        this.clickableSquarePiece(square.currentPiece);
                    }
                }
                else if (square.currentPiece.color === Colors.Black && !this.whiteTurnToMove) {
                    squareHTML.onclick = () => {
                        this.clickableSquarePiece(square.currentPiece);
                    }
                }
            }               
            
            squareHTML.removeChild(dotOnBoard);
        });

        this.currentlyDisplayedDots = [];
    }

    addClickableSquareForPieces(pieceColor) {

        // Control if it is a check
        if (!this.blackKingChecked && !this.whiteKingChecked) {
            let piecesArray;
            pieceColor === Colors.White ? piecesArray = this.allPieces[0] : piecesArray = this.allPieces[1];

            piecesArray.forEach(piecesSet => {   
                piecesSet.forEach(piece => {
                    this.chessBoard.squares.forEach(square => {

                        if (piece.currentSquare.square === square.square) {
                            const squareHTML = this.chessBoard.getSquareHTML(square.square);
                            squareHTML.style.cursor = "pointer";
                            squareHTML.onclick = () => {
                                this.clickableSquarePiece(piece);
                            }
                        }
                    });
                });
            });
        }
        else if (this.whiteKingChecked) {
            console.log("WHITE KING CHECKED");
            this.getPossibleMovesWhenKingChecked(this.whiteKing);
            // IMPLEMENT
        }
        else if (this.blackKingChecked) {
            console.log("BLACK KING CHECKED")
            this.getPossibleMovesWhenKingChecked(this.blackKing);
        }
    }

    getPossibleMovesWhenKingChecked(kingPiece) {

        // Clear all click events on board
        this.removeAllClickableSquares();
        this.clearAllDotsOnTheBoard();

        // Determine pieces color. Pieces that will try to capture the checker or block it
        const allPiecesArray = (kingPiece.color === Colors.White) ? this.allPieces[0] : this.allPieces[1];

        // TODO - BUG allPieces[0] not working
        this.generatePiecesCheckingKing(kingPiece);

        // Create King moves
        const kingSquareHTML = this.chessBoard.getSquareHTML(kingPiece.currentSquare.square);
        kingSquareHTML.onclick = () => {
            this.clickableSquarePiece(kingPiece);
            // Clear checked by pieces list
            //checkGivenByPieces = [];
        }

        // TODO Create clickable pieces which can block or capture CHECK
        allPiecesArray.forEach(piecesSet => {
            piecesSet.forEach(piece => {
                if (piece.pieceType != Pieces.King) {

                    const pieceSquareHTML = this.chessBoard.getSquareHTML(piece.currentSquare.square);
                    pieceSquareHTML.onclick = "";
                    let newLegalMoves = [];
                    piece.legalMoves.forEach(move => {
                        
                        // Capture single checking piece
                        if (this.checkGivenByPieces.length == 1) {
                            if (move.moveSquare === this.checkGivenByPieces[0].currentSquare.square && move.moveType === MoveType.Capture) {
                                newLegalMoves.push(move);
                            }
                        }
                        // If a move can block a checkable excluding when checked by Knight
                        // And checkable pieces is 1
                        if (this.checkGivenByPieces.length == 1 && this.checkGivenByPieces[0].pieceType != Pieces.Knight) {
                            
                        }
                    });

                    if (newLegalMoves.length > 0) {
                        piece.legalMoves = newLegalMoves;
                        pieceSquareHTML.onclick = () => {
                            this.clickableSquarePiece(piece);
                            // Clear checked by pieces list
                            //checkGivenByPieces = [];
                        }
                    }
                    /*
                    else {
                        piece.legalMoves = [];
                    }
                    */
                }
                //const pieceSquareHTML = document.getElementById(piece.currentSquare.square);
            });
        });
    }

    generatePiecesCheckingKing(kingPiece) {

        // Clear previous values
        this.checkGivenByPieces = [];

        const squareChecked = kingPiece.currentSquare;
        this.allPieces.forEach(piecesColorSet => {
            piecesColorSet.forEach(piecesSet => {
                piecesSet.forEach(piece => {
                    if (piece.pieceColor === kingPiece.pieceColor) {
                        piece.legalMoves.forEach(move => {
                            if (move.moveSquare === squareChecked.square) {
                                console.log("CHECK GIVEN BY: ", piece.pieceType, piece.color, piece.currentSquare.square);
                                console.log("SQUARE CHECKED:", move)
                                this.checkGivenByPieces.push(piece);
                            }
                        });
                    }
                });
            });
        });   
    }

    removeAllClickableSquares() {
        this.chessBoard.squares.forEach(square => {
            const squareHTML = this.chessBoard.getSquareHTML(square.square);
            squareHTML.onclick = "";
            squareHTML.style.cursor = "default";
        });
    }

    clickableSquarePiece(piece) {

        // Reset previous values
        this.restoreDefaultSquareColor();
        this.clearAllDotsOnTheBoard();

        // Set currently selected piece
        this.currentlySelectedPiece = piece;
        
        this.createMovesAsDotsOnTheBoard(piece);

        const squareHTML = this.chessBoard.getSquareHTML(piece.currentSquare.square);

        squareHTML.appendChild(this.createSelectedSquareBackground());
        
        if ((this.whiteKingChecked || this.blackKingChecked)) {

            if (this.kingCheckedOverlayRemoved) {
                const checkedOverlay = this.createCheckedOverlay();
                if (this.whiteKingChecked) {
                    const kingSquareHTML = this.chessBoard.getSquareHTML(this.whiteKing.currentSquare.square);
                    kingSquareHTML.appendChild(checkedOverlay);
                }
                else if (this.blackKingChecked) {
                    const kingSquareHTML = this.chessBoard.getSquareHTML(this.blackKing.currentSquare.square);
                    kingSquareHTML.appendChild(checkedOverlay);
                }
                this.kingCheckedOverlayRemoved = false
            }
            
            if (piece.pieceType === Pieces.King) {
                const checkedOverlay = document.getElementById("checked-overlay");
                checkedOverlay.remove();
                this.kingCheckedOverlayRemoved = true;
            }
        }
    }

    restoreDefaultSquareColor() {
        if (this.currentlySelectedPiece != null) {
            const squareHTML = this.chessBoard.getSquareHTML(this.currentlySelectedPiece.currentSquare.square);
            //const defaultSquareColor = currentlySelectedPiece.currentSquare.squareColor;
            try {
                const divSelectedSquare = squareHTML.querySelector(".currently-selected-square");
                divSelectedSquare.remove();
            } catch (error) {
                
            }
        }
    }
}
