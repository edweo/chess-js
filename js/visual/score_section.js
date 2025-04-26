import { Colors } from "../tools/enum.js";

export default class ScoreSection {

    scoreSectionCreated = false;

    scoreSectionHTML;
    usernameLabelHTML;
    userFlagHTML;
    userRatingHTML;
    materialSectionHTML;
    constructor(player, counter, capturedPieces) {
        this.player = player;
        this.counter = counter;
        this.capturedPieces = capturedPieces;
    }

    createScoreSectionHTML(id) {

        // Allows only one section to be created per class
        if (!this.scoreSectionCreated) {
            const classes = {
                // White
                white: {
                    userSection: "user-white-section",
                    scoreSection: "white-section-score",
                    timerSection: "white-timer"
                },
                // Black
                black: {
                    userSection: "user-black-section",
                    scoreSection: "black-section-score",
                    timerSection: "black-timer"
                }
            };
            
            const userColor = (this.player.piecesColor === Colors.White)
            ? classes.white
            : classes.black
            
            // Section
            const sectionDIV = document.createElement("div");
            sectionDIV.className = "section-scoreboard"
            sectionDIV.id = id;
            
            // Username Material Container
            const usernameMaterial = document.createElement("div");
            usernameMaterial.className = "username-material-container";
            
            // User Scoreboard
            const userScoreboard = document.createElement("div");
            userScoreboard.className = `user-section-scoreboard ${userColor.userSection}`
            
            // Counter section
            const counterSection = document.createElement("div");
            counterSection.className = `section-timer ${userColor.timerSection}`;
            
            // Username Label
            const usernameLabel = document.createElement("label");
            usernameLabel.className = "label-username";
            usernameLabel.innerHTML = this.player.username;
            this.usernameLabelHTML = usernameLabel;
            
            // User flag Label
            const userFlag = document.createElement("label");
            userFlag.className = "user-flag";
            userFlag.innerHTML = this.player.country;
            this.userFlagHTML = userFlag;
            
            // User rating Label
            const userRating = document.createElement("label");
            userRating.className = "label-rating"
            userRating.innerHTML = this.player.rating;
            this.userRatingHTML = userRating;
            
            // Material score section
            const materialSection = document.createElement("div");
            materialSection.className = `section-material-captured ${userColor.scoreSection}`;
            this.materialSectionHTML = materialSection;
            
            this.counter.countHTML = counterSection;
            this.counter.displayCountOnHTML();
            
            counterSection.append();
            userScoreboard.append(usernameLabel, userFlag, userRating);
            usernameMaterial.append(userScoreboard, materialSection);
            
            sectionDIV.append(usernameMaterial, counterSection);
            
            this.scoreSectionHTML = sectionDIV;
            this.scoreSectionCreated = true;

            return sectionDIV;
        }
    }

    refreshAll() {
        this.refreshUsername();
        this.refreshRating();
        this.refreshFlag();
        this.refreshMaterialCaptured();
        this.refreshTimer();
    }

    refreshUsername() {
        this.usernameLabelHTML.innerHTML = this.player.username;
    }

    refreshRating() {
        this.userRatingHTML.innerHTML = this.player.rating;
    }

    refreshFlag() {
        this.userFlagHTML.innerHTML = this.player.country;
    }

    refreshMaterialCaptured() {

    }

    refreshTimer() {

    }
}