import ChessGame from "../chess_game.js"
import { Colors, CountryFlags } from "../tools/enum.js"
import Player from "./player.js"

export default class GameMenu {

    constructor() {
        this.main_section = document.getElementById("main-section")

        const player_1 = new Player("", "", "", Colors.White)
        const player_2 = new Player("", "", "", Colors.Black)

        this.menu = this.menu_component(player_1, player_2)
        this.main_section.append(this.menu)
    }

    menu_component(player_1, player_2) {
        const section = document.createElement('div')
        section.className = "game-configure-menu"

        // Title
        const label_menu = document.createElement('label')
        label_menu.innerHTML = "Create a New Chess Game"

        // Player Configure Section
        const configure_section = this.configure_section(player_1, player_2)

        // Button Create Game
        const button_create_game = document.createElement('button')
        button_create_game.innerHTML = "Create Game"
        button_create_game.className = "button-menu-game"
        button_create_game.onclick = () => {
            this.click_create_game_button(player_1, player_2)
        }

        section.append(label_menu, configure_section, button_create_game)

        return section
    }

    configure_section(player_1, player_2) {
        const player_configure_section = document.createElement('div')
        player_configure_section.className = "configure-section"

        // Player 1 section
        const white_king_img = document.createElement('img')
        white_king_img.src = "images/pieces/White_King.png"
        white_king_img.className = "piece-img-game-configure"
        const player1_section = this.player_section(player_1, "White", white_king_img)

        // Plater 2 section
        const black_king_img = document.createElement('img')
        black_king_img.src = "images/pieces/Black_King.png"
        black_king_img.className = "piece-img-game-configure"
        const player2_section = this.player_section(player_2, "Black", black_king_img)
        
        player_configure_section.append(player1_section, player2_section)

        return player_configure_section
    }

    player_section(player, title, chess_piece) {
        const player_section = document.createElement('div')
        player_section.className = "menu-player-section"

        // Title div
        const title_section = document.createElement('div')
        title_section.className = "player-title-section"
        const player_label = document.createElement('label')
        player_label.innerHTML = title
        player_label.className = "player-label"
        title_section.append(chess_piece, player_label)

        // Name Label
        const name_component = this.name_field_component(player)

        // Rating Label
        const rating_component = this.rating_field_component(player)

        // Flag Label
        const flag_component = this.flag_select_component(player)

        // Timer
        const timer_component = this.timer_select_component(player)

        player_section.append(title_section, name_component, rating_component, flag_component, timer_component)
        return player_section 
    }

    // Template Field Component
    field_component(label_text) {
        const field_section = document.createElement('div')
        field_section.className = "field-section"

        // Name Label
        const label = document.createElement('label')
        label.innerHTML = label_text

        // Name Field
        const field = document.createElement('input')
        

        field_section.append(label, field)
        return [field_section, field]
    }

    name_field_component(player) {
        const component = this.field_component("Name")
        const field_section = component[0] 
        const field = component[1]
        field.oninput = () => {
            player.username = field.value
        }
        return field_section
    }

    rating_field_component(player) {
        const component = this.field_component("Rating")
        const field_section = component[0] 
        const field = component[1]
        field.oninput = () => {
            player.rating = field.value
        }
        return field_section
    }

    flag_select_component(player) {
        const flag_component = document.createElement('div')
        flag_component.className = "flag-selection-section"

        // Label
        const label = document.createElement('label')
        label.innerHTML = "Country"

        // Selection
        const flag_select = document.createElement('select')
        // flag_select.size = 1

        // Add options to selection
        for (const i in CountryFlags) {
            var option = document.createElement('option')
            option.value = CountryFlags[i]
            option.text = CountryFlags[i] + " " + i
            flag_select.append(option)
        }

        // Add Click Event
        flag_select.onchange = () => {
            player.country = flag_select.value
        }

        // Default First Flag
        player.country = flag_select.value

        flag_component.append(label, flag_select)
        return flag_component
    }

    timer_select_component(player) {

        const timer_component = document.createElement('div')
        timer_component.className = "timer-select"

        // Timer Logo
        const timer_img = document.createElement('img')
        timer_img.src = "images/icons/icon_timer_orange.png"
        timer_img.className = "timer-img-game-configure"

        // Div Timer Adjust
        const timer_adjust_section = document.createElement('div')
        timer_adjust_section.className = "timer-adjust"

        // Label Timer Minutes
        const timer_label = document.createElement('label')
        timer_label.innerHTML = player.timer

        // Button -
        const button_decrease = document.createElement('button')
        button_decrease.innerHTML = "-"
        button_decrease.onclick = () => {
            player.decrease_timer()
            timer_label.innerHTML = player.timer
        }
        
        // Button +
        const button_increase = document.createElement('button')
        button_increase.innerHTML = "+"
        button_increase.onclick = () => {
            player.increase_timer()
            timer_label.innerHTML = player.timer
        }
        timer_adjust_section.append(button_decrease, timer_label, button_increase)
        timer_component.append(timer_img, timer_adjust_section)

        return timer_component
    }

    click_create_game_button(player_1, player_2) {
        const p1_ready = player_1.verify_values()
        const p2_ready = player_2.verify_values()

        // Start Game
        if (p1_ready && p2_ready) {
            this.menu.remove()

            // Create Chess Game
            const chess_board_wrapper = document.createElement('div')
            chess_board_wrapper.id = "chess-board-wrapper"
            this.main_section.append(chess_board_wrapper)
            const chessGame = new ChessGame(player_1, player_2)
            console.log("Starting Game!")
        } else {
            console.log("ERROR STARTING GAME!!!!!")
            console.log(player_1)
            console.log(player_1)
        }
    }
}
