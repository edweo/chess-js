export default class Counter {
    counterInterval;
    countHTML;
    constructor(count) {
       this.count = count;
    }

    displayCountOnHTML() {
        
        // Clear previous timer
        const counter_icon = document.createElement("img");
        counter_icon.src = "images/icons/icon_timer_orange.png";
        counter_icon.className = "timer-icon";

        const counter_element = document.createElement("label");
        counter_element.className = "timer";
        counter_element.innerHTML = this.getCurrentCounterTimeString();

        this.countHTML.append(counter_icon, counter_element);
    }
    
    refreshCounterHTML() {  
        const previous_counter_element = this.countHTML.getElementsByClassName("timer");
        for (let i = 0; i < previous_counter_element.length; i++) {
            const element = previous_counter_element[i];
            element.innerHTML = this.getCurrentCounterTimeString();
        }
    }

    getCurrentCounterTimeString() {
        let mm = parseInt(("0" + Math.floor(this.count / 60)));
        let ss = this.count % 60;
    
        let mmStr = "";
        let ssStr = "";
    
        mm < 10 ? mmStr = "0" + mm : mmStr = mm.toString();
        ss < 10 ? ssStr = "0" + ss : ssStr = ss.toString();

        return mmStr + ":" + ssStr;
    }

    countdownFunction() {
        this.count--;
        this.refreshCounterHTML();

        // FIX depending on the color
        if (this.count <= 0) {
            this.stopCounter();
        }

        return this.count;
    }

    startCounter() {
        if (this.count > 0) {
            this.counterInterval = setInterval(() => {
                this.count = this.countdownFunction();
            }, 1000)
        }
    }
    
    stopCounter() {
        clearInterval(this.counterInterval);
    }
}
