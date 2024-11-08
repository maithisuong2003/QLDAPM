class Popup {
    constructor() {
        this.content = null;
        this.element = document.querySelector(".popup");
        this.popupContent = document.querySelector(".popup>.content");
        this.callbackFun = null;
        this.interval = null;
        this.listener();
    }
    listener() {
        const btnConfirm = document.querySelector(".popup>.btn-confirm");
        btnConfirm.addEventListener("click", (event) => {
            this.callbackFun();
        });
    }
    update(content, callback) {
        this.content = content;
        this.callbackFun = callback;
    }
    render(timing, callback) {
        clearInterval(this.interval);
        this.popupContent.innerHTML = "";
        let contentArr = this.content.split("");
        let index = 0;
        this.interval = setInterval(() => {
            if (index >= contentArr.length) {
                clearInterval(this.interval);
                return callback && callback();
            }
            const newWord = document.createElement("span");
            newWord.innerHTML = contentArr[index] == "#" ? "</br>&nbsp;&nbsp;&nbsp;" : contentArr[index];
            this.popupContent.appendChild(newWord);
            index++;
        }, timing / this.content.length);
    }

    show(callback) {
        this.element.classList.add("zoom-in", "translate-middle");
        return callback && callback();
    }
    hide(className, callback) {
        this.element.classList.forEach((name) => {
            if (name != "popup") {
                this.element.classList.remove(name);
            }
        });
        return callback && callback();
    }
}
class Sound {
  constructor(fileName) {
      this.fileName = fileName;
      this.audio = new Audio(this.fileName);
  }

  isStopped() {
      return this.audio.paused;
  }

  start(shouldRepeat) {
      if (this.audio.duration > 0) {
          this.audio.currentTime = 0;
      }
      this.audio.currentTime = 0;
      this.audio.play();
      this.audio.onended = () => {
          if (shouldRepeat) this.start(true);
      };
  }
  onEnd(callback) {
      if (typeof callback == "function") {
          this.audio.onended = callback;
      }
  }
  stop() {
      this.audio.pause();
      this.audio.currentTime = 0;
  }
  update(filename) {
      this.fileName = filename;
  }
}
