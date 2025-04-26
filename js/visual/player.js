export default class Player {

    constructor(username, rating, country, piecesColor) {
        this.username = username;
        this.rating = rating;
        this.country = country;
        this.piecesColor = piecesColor;
        this.timer = 5 // Default
        this.max_timer_amount = 30
    }

    increase_timer() {
        if (this.timer < this.max_timer_amount) {
            this.timer++;
        }
    }

    decrease_timer() {
        if (this.timer != 1) {
            this.timer--;
        }
    }

    verify_values() {
        const isRatingNumber = this.check_rating_numeric()
        if (this.username != "" && 
            isRatingNumber &&
            this.country != null &&
            this.timer >= 1 && this.timer <= this.max_timer_amount) {
                return true
            }
        return false
    }

    check_rating_numeric() {
        const rating = parseInt(this.rating)
        if (Number.isInteger(rating)) {
            this.rating = rating
            return true
        }
        return false
    }

    convert_min_to_sec() {
        this.timer *= 60
    }
}