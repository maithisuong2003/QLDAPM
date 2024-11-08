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

class AdvisoryGroup {
    constructor(game) {
        this.game = game;
        this.selectedCount = 0;
        this.dataAnswers = null;
        this.persons = document.querySelectorAll(".advisory-group > .person");
        this.listener();
    }
    listener() {
        if (!this.persons) return;
        this.persons.forEach((person, index) => {
            person.addEventListener("click", () => {
                this.onBtnPersonClick(index);
            });
        });
    }
    updateAnswerData(answerId) {
        if (!answerId) return;
        const dataAnswers = {
            1: {
                _data: ["A", "A", "A"],
                _remain: ["B", "C", "D"],
            },
            2: {
                _data: ["B", "B", "B"],
                _remain: ["A", "C", "D"],
            },
            3: {
                _data: ["C", "C", "C"],
                _remain: ["A", "B", "D"],
            },
            4: {
                _data: ["D", "D", "D"],
                _remain: ["A", "B", "C"],
            },
        };
        const _dataAnswers = dataAnswers[answerId]._data;
        const dataRemain = dataAnswers[answerId]._remain;
        const isSomeAnswerRemoved = this.game.answers.some((answer) => answer.isRemoved === true);
        let onlyWrongAnswer = null;
        if (isSomeAnswerRemoved) {
            this.game.answers.forEach((answer, index) => {
                if (answer.id != answerId && !answer.isRemoved) {
                    onlyWrongAnswer = ["A", "B", "C", "D"][index];
                }
            });
        }
        while (_dataAnswers.length < 5) {
            const insertIndex = Math.round(Math.random() * 3);
            const insertAnswer = isSomeAnswerRemoved ? onlyWrongAnswer : dataRemain[Math.round(Math.random() * 2)];
            _dataAnswers.splice(insertIndex, 0, insertAnswer);
        }
        this.dataAnswers = _dataAnswers;
        console.log(this.dataAnswers);
    }

    onBtnPersonClick(index) {
        if (!this.persons) return;
        const person = this.persons[index];
        if (person.classList.contains("show")) return;
        if (this.selectedCount == 3) {
            alert("Ban đã chọn đủ 3 người trong tổ tư vấn!");
            return;
        }
        if (this.selectedCount == 2) {
            this.game.isUsingAnotherHelper = false;
            this.game.waitSelectAdvisoryGroupSound.stop();
            this.game.selectAdvisoryGroupDoneSound.start();
            this.game.selectAdvisoryGroupDoneSound.onEnd(() => {
                this.game.questionBgSound.start(true);
                this.game.timer.updateTime();
            });
        }
        this.showAnswer(index);
        person.classList.add("show");
        this.selectedCount++;
    }

    showAnswer(index) {
        if (!this.dataAnswers) return;
        if (this.persons.length < 1) return;
        const element = this.persons[index].querySelector(".person-answer");
        element.innerText = this.dataAnswers[index];
    }
    showHelperList() {
        document.querySelector(".advisory-group").classList.add("show");
    }
    hideHelperList() {
        document.querySelector(".advisory-group").classList.remove("show");
    }

    reset() {
        this.persons.forEach((person) => {
            person.classList.remove("show");
        });
        this.selectedCount = 0;
        this.dataAnswers = [];
    }
}
class Answer {
    constructor(game, answer, index) {
        this.game = game;
        this.isSelected = false;
        this.index = index;
        this.answer = answer.text;
        this.id = answer.id;
        this.isRemoved = false;
        this.element = document.querySelectorAll(".answer")[this.index];
    }
    onBtnAnswerClick(handleUserSelectAnswer) {
        this.element.addEventListener("click", () => {
            if (this.game.isSelectedAnswer || this.game.isUsingAnotherHelper) return;
            this.showSelectedAnswer();
            handleUserSelectAnswer(this.id, this.index);
        });
    }
    showSelectedAnswer() {
        this.element.classList.add("selected");
        this.element.querySelector("img").src = this.index % 2 == 0 ? "./Image/selected.png" : "./Image/selected-r.png";
    }
    showCorrectAnswer() {
        this.element.classList.add("correctAnswer");
        this.element.querySelector("img").src = this.index % 2 == 0 ? "./Image/correct.png" : "./Image/correct-r.png";
    }
    reset() {
        this.element.classList.forEach((name) => {
            if (name !== "answer") {
                this.element.classList.remove(name);
            }
        });
        this.element.classList.remove("correctAnswer");
        this.element.querySelector("img").src = this.index % 2 == 0 ? "./Image/normal-l.png" : "./Image/normal-r.png";
    }
    remove() {
        this.element.classList.add("hidden");
    }

    render() {
        this.element.querySelector("span").innerHTML = this.answer;
    }
}
class Screen {
    constructor(game) {
        this.game = game;
        this.answerTable = document.querySelector(".table-viewer-answer");
        this.startBtn = document.querySelector(".btn-start");
    }

    showStartBtn() {
        this.startBtn.classList.remove("hidden");
    }
    hideStartBtn() {
        this.startBtn.classList.add("hidden");
    }
    showLights(timing, speed) {
        this.updateLightsEffectTiming(speed);
        const lights = document.querySelector(".lights");
        lights.classList.add("rotate");
        lights.classList.remove("hidden", "blur");
        setTimeout(() => {
            this.hideLights();
        }, timing - 2000);
    }
    hideLights() {
        const lights = document.querySelector(".lights");
        lights.classList.add("blur");
        setTimeout(() => {
            lights.classList.remove("rotate");
        }, 3000);
    }
    renderPrizeMoney() {
        const table = document.querySelector(".table");
        const render = () => {
            let data = "";
            for (let i = 15; i > 0; i--) {
                const item = ` <div class="point-item">
             <div class="lever">${i}</div>
             <div class="money">${PrizeMoney[i]}</div>
            </div>`;
                data += item;
            }
            return data;
        };
        table.innerHTML = render();
    }
    updateLightsEffectTiming(timing) {
        document.documentElement.style.setProperty("--animation-timing", timing);
    }
    onBtnStartGameClick(callback) {
        this.startBtn.addEventListener("click", () => {
            this.hideStartBtn();
            this.hideLights();
            callback();
        });
    }

    onBtnRemoveAnswerClick(callback) {
        const handleClick = () => {
            if (!this.game.isCanUsed("isRemoveWrongUsed")) return;
            this.game.isUsingAnotherHelper = true;
            this.game.helpers.isRemoveWrongUsed = true;
            this.game.questionSound.stop();
            element.innerHTML = ` <img src='Image/50-50-used.webp' alt=''>`;
            const removeSound = new Sound("Sound/remove-wrong.mp3");
            removeSound.start();
            setTimeout(() => {
                callback();
            }, 3000);
        };
        const element = document.querySelector("#btn-remove-half");
        element.addEventListener("click", handleClick);
    }

    onBtnAskAudienceClick(callback) {
        const handleClick = () => {
            if (!this.game.isCanUsed("isAskAudienceUsed")) return;
            this.game.isUsingAnotherHelper = true;
            this.game.helpers.isAskAudienceUsed = true;
            this.game.questionSound.stop();
            this.game.timer.stopUpdateTime();
            element.innerHTML = ` <img src='Image/ask-viewer-used.webp' alt=''>`;
            const askViewSound = new Sound("Sound/ask-viewer-sound.mp3");
            askViewSound.start();
            this.showAnswerTable();
            this.game.advisoryGroupHelper.hideHelperList();
            askViewSound.onEnd(() => {
                this.game.waitViewerAnswerSound.start();
                this.game.questionBgSound.stop();
                const answerCol = document.querySelectorAll(".result");
                setTimeout(() => {
                    answerCol.forEach((col) => {
                        col.classList.add("result-animation");
                    });
                }, 1300);
                this.game.waitViewerAnswerSound.onEnd(() => {
                    this.game.questionBgSound.start(true);

                    this.game.timer.updateTime();
                });
                this.game.delay(() => {
                    answerCol.forEach((col) => {
                        col.classList.remove("result-animation");
                    });
                    callback();
                }, 13500);
            });
        };
        const element = document.querySelector("#btn-audience-help");
        element.addEventListener("click", handleClick);
    }

    onBtnAskAdvisoryGroupClick(callback) {
        const handleClick = () => {
            if (!this.game.isCanUsed("isAdvisoryUsed")) return;
            element.innerHTML = ` <img src='Image/advisory-group-used.webp' alt=''>`;
            this.game.isUsingAnotherHelper = true;
            this.game.helpers.isAdvisoryUsed = true;
            this.game.questionSound.stop();
            this.game.timer.stopUpdateTime();
            const sound = new Sound("./Sound/ask-advisory-group.mp3");
            sound.start();
            callback();
        };
        const element = document.querySelector("#btn-advisory-help");
        element.addEventListener("click", handleClick);
    }

    hideAnswerTable() {
        this.answerTable.classList.add("hidden");
    }
    showAnswerTable() {
        this.answerTable.classList.remove("hidden");
    }
    updatePrizeMoney() {
        const currentQuestion = this.game.questionNumber;
        const items = document.querySelectorAll(".point-item");
        items.forEach((item) => {
            item.classList.remove("current-lever");
        });
        items[items.length - currentQuestion].classList.add("current-lever");
    }
    reset() {
        this.hideAnswerTable();
        //button remove-half-answer
        const btnRemoveHalf = document.querySelector("#btn-remove-half");
        btnRemoveHalf.innerHTML = ` <img src='Image/50-50.webp' alt=''>`;
        //button ask-audience-help
        const btnAskAudience = document.querySelector("#btn-audience-help");
        btnAskAudience.innerHTML = ` <img src='Image/ask-viewer.webp' alt=''>`;
        //button advisory-group-help
        const btnAdvisoryGroup = document.querySelector("#btn-advisory-help");
        btnAdvisoryGroup.innerHTML = ` <img src='Image/advisory-group.webp' alt=''>`;
    }
}