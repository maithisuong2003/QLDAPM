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
class Dot {
    constructor(loader, ctx, angle, radius, size, color, opacity) {
        this.ctx = ctx;
        this.angle = angle;
        this.radius = radius;
        this.color = color;
        this.size = size;
        this.opacity = opacity;
        this.loader = loader;
    }
    draw() {
        const x = canvas.width / 2 + Math.cos(this.angle) * this.radius;
        const y = canvas.height / 2 + Math.sin(this.angle) * this.radius;
        const blurAmount = 5;
        this.ctx.shadowColor = "blue";
        this.ctx.shadowBlur = blurAmount;
        // this.ctx.strokeStyle = "black";
        // this.ctx.lineWidth = 2;
        this.ctx.globalAlpha = this.opacity;
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.size, 0, Math.PI * 2, false);
        this.ctx.fill();
        // this.ctx.stroke();
        this.ctx.closePath();
    }
    updateOpacity() {
        this.opacity = this.opacity - 1 / this.loader.numberOfDots;
        if (this.opacity <= 0) this.opacity = 1;
    }
    updatePosition() {
        this.angle += 0.02;
    }
    updateColor() {
         this.opacity = this.opacity - 1 / this.loader.numberOfDots;
         if (this.opacity <= 0) this.opacity = 1;
    }

    updateSizeRadius(size, radius) {
        console.log("new Size" + size, radius);
        this.size = size;
        this.radius = radius;
    }
}
class Timer {
    constructor(game) {
        this.game = game;
        this.currentTime = TIME;
        this.timerElement = document.querySelector(".timer");
        this.timerInterval = null;
    }
    updateTime() {
        this.timerInterval = setInterval(() => {
            if (this.currentTime == 0) {
                this.stopUpdateTime();
                this.game.questionBgSound.stop();
                this.game.timeUpSound.start();
                this.game.timeUpSound.onEnd(() => this.game.stopGame());
                return;
            }
            this.reset(this.currentTime - 1);
        }, 1000);
    }
    reset(time) {
        this.currentTime = time;
        this.timerElement.innerHTML = this.currentTime;
    }
    stopUpdateTime() {
        clearInterval(this.timerInterval);
    }
}
class Loader {
    constructor(game) {
        this.game = game;
        this.ctx = null;
        this.dots = [];
        this.numberOfDots = 20;
        this.img = new Image();
        this.img.src = "./Image/logo1.png";
        this.imgLoaded = false;
        this.img.onload = () => {
            this.imgLoaded = true;
            this.draw();
        };
        this.animationInterval = null;
        this.rotateAnimation = null;
        this.init();
    }
    init() {
        const canvas = document.querySelector("#canvas");
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        this.ctx = canvas.getContext("2d");
    }

    updateDots() {
        this.dots.forEach((dot) => {
            const dotSize = canvas.offsetWidth * 0.025;
            const radius = (canvas.offsetWidth - canvas.offsetWidth * 0.1) / 2;
            dot.updateSizeRadius(dotSize, radius);
        });
    }

    createDots(effect) {
        this.dots = [];
        const dotSize = canvas.width * 0.025;
        const radius = (canvas.width - canvas.width * 0.1) / 2;
        const color = "#fff";
        for (let i = 0; i < this.numberOfDots; i++) {
            const angle = (i / this.numberOfDots) * 2 * Math.PI;
            const opacity = effect ? i / this.numberOfDots : 1;
            const dot = new Dot(this, this.ctx, angle, radius, dotSize, color, opacity);
            this.dots.push(dot);
        }
    }
    draw() {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.drawImage();
        this.dots.forEach((dot) => {
            dot.draw();
        });
    }
    drawImage() {
        if (this.imgLoaded) {
            const imgWidth = canvas.width - canvas.width * 0.15;
            const imgHeight = canvas.width - canvas.width * 0.15;
            this.ctx.globalAlpha = 1;
            this.ctx.drawImage(
                this.img,
                (canvas.width - imgWidth) / 2,
                (canvas.width - imgWidth) / 2,
                imgWidth,
                imgHeight
            );
        }
    }
    showWithFlickerEffect() {
        clearInterval(this.animationInterval);
        this.createDots(false);
        this.flickerEffect();
    }
    flickerEffect() {
        this.animationInterval = setInterval(() => {
            this.dots.forEach((dot) => {
                dot.updateColor();
            });
            this.draw();
        }, 100);
    }

    showWithRotateEffect() {
        clearInterval(this.animationInterval);
        this.createDots(false);
        this.rotateEffect();
    }
    rotateEffect() {
        this.dots.forEach((dot) => {
            dot.updatePosition();
        });
        this.draw();
        this.rotateAnimation = requestAnimationFrame(() => this.rotateEffect());
    }

    showWithLoadingEffect() {
        cancelAnimationFrame(this.rotateAnimation);
        this.createDots(true);
        this.loadingEffect();
    }
    loadingEffect() {
        this.animationInterval = setInterval(() => {
            this.dots.forEach((dot) => {
                dot.updateOpacity();
            });
            this.draw();
        }, 100);
    }
}
const TIME = 30;
class Game {
    constructor() {
        this.questionNumber = 1;
        this.screen = new Screen(this);
        this.isSelectedAnswer = false;
        this.questionSound = null;
        this.correctSound = null;
        this.timer = new Timer(this);
        this.answers = [];
        this.isPlayAgain = false;
        this.popup = new Popup("");
        this.helpers = null;
        this.question = null;
        this.finalAnswerSound = new Sound("Sound/final-answer.mp3");
        this.startSound = new Sound("Sound/start-sound.mp3");
        this.gameOverSound = new Sound("Sound/game-over.mp3");
        this.startGameSound = new Sound("Sound/start-game.mp3");
        this.wrongAnswerSound = new Sound(`Sound/wrong-sound.mp3`);
        this.timeUpSound = new Sound(`Sound/time-up.mp3`);
        this.waitSelectAdvisoryGroupSound = new Sound("./Sound/ask-advisory-group-bg-sound.mp3");
        this.selectAdvisoryGroupDoneSound = new Sound("./Sound/ask-advisory-group-done.mp3");
        this.waitViewerAnswerSound = new Sound("Sound/wait-viewer-answer.mp3");
        this.advisoryGroupHelper = new AdvisoryGroup(this);
        this.isUsingAnotherHelper = false;
        this.listener();
        this.ctx = null;
    }
    init() {
        this.questionBgSound = new Sound("Sound/first5BgSound.mp3");
        this.questionNumber = 1;
        this.question = Questions[this.questionNumber][0];
        this.questionSound = new Sound(this.question.sound);
        this.helpers = {
            isRemoveWrongUsed: false,
            isAskAudienceUsed: false,
            isCallUsed: false,
            isAdvisoryUsed: false,
        };
        this.screen.renderPrizeMoney();
        this.isSelectedAnswer = false;
        this.startSound.start();
        this.startSound.onEnd(() => {
            this.screen.hideLights();
            this.screen.hideStartBtn();
            this.handleStartGame();
        });
        this.screen.showLights(10000000, "2s");
        this.delay(() => this.screen.updateLightsEffectTiming("4s"), 12000);
        this.screen.showStartBtn();
    }

    delay(func, timing) {
        setTimeout(() => {
            func();
        }, timing);
    }

    handleUserSelectAnswer(answerId, index) {
        this.isSelectedAnswer = true;
        this.startSound.stop(); // need remove
        this.timer.stopUpdateTime();
        this.questionSound.stop();
        const process = () => {
            if (this.questionNumber == 5) {
                this.questionBgSound.stop();
                this.questionBgSound = new Sound("Sound/next5BgSound.mp3");
                const display = document.querySelectorAll(".game>div.display");
                display.forEach((element) => {
                    element.classList.add("hidden");
                });
                this.screen.hideAnswerTable();
                this.advisoryGroupHelper.hideHelperList();
                const prizeMoney = document.querySelector(".current-prize-money");
                document.querySelector(".current-prize-money span").innerText = PrizeMoney[this.questionNumber];
                prizeMoney.classList.remove("hidden");
                const winFirst5Sound = new Sound("Sound/win-5.mp3");
                const introducePart2 = new Sound("Sound/introduce-part2.mp3");
                winFirst5Sound.start();
                this.screen.showLights(8000, "2s");
                winFirst5Sound.onEnd(() => {
                    prizeMoney.classList.add("hidden");
                    this.popup.show();
                    introducePart2.start();
                    this.popup.update(_script.introducePart2, () => {
                        introducePart2.stop();
                        this.updateQuestion();
                        this.startGame();
                    });
                    this.popup.render(15000);
                });
                return;
            }
            this.updateQuestion();
            this.showQuestion();
            this.readQuestion();
        };
        if (this.questionNumber <= 5) {
            const correctAnswerProcess = () => {
                const sound = new Sound(`Sound/first5-correct-sound/${index}.mp3`);
                const bgSound = new Sound(`Sound/first5-correct-sound/correct-sound.mp3`);
                sound.start();
                this.delay(() => {
                    this.showCorrectAnswer();
                    bgSound.start();
                    bgSound.onEnd(() => process());
                }, 2000);
            };
            this.delay(() => {
                this.checkAnswer(answerId, correctAnswerProcess);
            }, 500);
            return;
        }
        if (this.questionNumber > 5) {
            this.finalAnswerSound.start();
            const correctAnswerProcess = () => {
                this.showCorrectAnswer();
                this.questionBgSound.stop();
                const sound = new Sound(`Sound/second5-correct-sound/${index}.mp3`);
                this.delay(() => this.screen.showLights(2000, "2s"), 5500);
                sound.start();
                sound.onEnd(() => process());
            };
            this.delay(() => {
                this.finalAnswerSound.stop();
                this.checkAnswer(answerId, correctAnswerProcess);
            }, 4000);
        }
    }
    checkAnswer(answerId, correctAnswerProcess) {
        if (answerId == this.question.correctId) {
            correctAnswerProcess();
        } else {
            this.showCorrectAnswer();
            this.questionBgSound.stop();
            this.wrongAnswerSound.start();
            this.wrongAnswerSound.onEnd(() => this.stopGame());
        }
    }

    updateQuestion() {
        this.questionNumber += 1;
        this.question = Questions[this.questionNumber][0];
        this.screen.hideAnswerTable();
        this.advisoryGroupHelper.hideHelperList();
        this.isSelectedAnswer = false;
        this.timer.reset(TIME);
    }

    showCorrectAnswer() {
        this.answers.forEach((answer) => {
            if (answer.id == this.question.correctId) {
                answer.showCorrectAnswer();
            }
        });
    }
    isCanUsed(helper) {
        if (this.isSelectedAnswer) return false;
        if (this.helpers[helper]) return false;
        if (this.isUsingAnotherHelper) return false;
        return true;
    }

    createAnswer() {
        this.answers = [];
        const answers = this.question.answers;
        answers.forEach((answer, index) => {
            this.answers.push(new Answer(this, answer, index));
        });
    }

    showQuestion() {
        this.createAnswer();
        this.screen.updatePrizeMoney();
        const questionElement = document.querySelector(".question > span");
        questionElement.innerHTML = this.question.question;
        this.answers.forEach((answer) => {
            answer.reset();
            answer.render();
            answer.onBtnAnswerClick((id, index) => {
                this.handleUserSelectAnswer(id, index);
            });
        });
    }

    readQuestion() {
        this.questionSound = new Sound(this.question.sound);
        this.questionSound.start();
        this.questionSound.onEnd(() => {
            this.timer.updateTime();
        });
        this.questionBgSound.isStopped() && this.questionBgSound.start(true);
    }
    handleBtnRemoveAnswerClick() {
        let deletedCount = 0;
        let deletedIndex = Infinity;
        while (deletedCount < 2) {
            const deleteIndex = Math.floor(Math.random() * this.answers.length);
            if (this.question.correctId == this.answers[deleteIndex].id || deletedIndex == deleteIndex) continue;
            this.answers[deleteIndex].remove();
            this.answers[deleteIndex].isRemoved = true;
            deletedIndex = deleteIndex;
            deletedCount++;
        }
        this.isUsingAnotherHelper = false;
    }

    updateAudienceAnswer(percents) {
        const answerCol = document.querySelectorAll(".result");
        const answerNumber = document.querySelectorAll(".result-text");
        percents.forEach((percent, index) => {
            const maxHeight = document.querySelector(".table-col").offsetHeight * (90 / 100);
            const height = (maxHeight * percent) / 100 < 15 ? 15 : (maxHeight * percent) / 100 + 15;
            answerCol[index].style.height = `${height}px`;
            answerNumber[index].innerHTML = percent + "%";
        });
    }

    handleBtnAskViewerClick() {
        let sumPercent = 70;
        const percents = [0, 0, 0, 0];
        for (let i = 0; i < 4; i++) {
            if (this.answers[i].isRemoved) {
                continue;
            }
            if (this.answers[i].id == this.question.correctId) {
                percents[i] = 30;
            }
            if (i == 3) {
                percents[3] += sumPercent;
                sumPercent = 0;
                continue;
            }
            const randomPercent = Math.round(Math.random() * sumPercent);
            percents[i] += randomPercent;
            sumPercent -= randomPercent;
        }
        if (sumPercent != 0) {
            let foundOne = false;
            for (let i = 0; i < 4; i++) {
                if (this.answers[i].isRemoved) continue;
                if (foundOne) {
                    percents[i] += Math.ceil(sumPercent / 2);
                    continue;
                }
                percents[i] += Math.floor(sumPercent / 2);
                foundOne = true;
            }
        }
        this.updateAudienceAnswer(percents);
        this.isUsingAnotherHelper = false;
    }
    startGame() {
        this.popup.hide();
        const display = document.querySelectorAll(".game>div.display");
        display.forEach((element) => {
            element.classList.remove("hidden");
        });
        this.showQuestion();
        this.readQuestion();
        this.questionBgSound.start(true);
    }

    stopGame() {
        const display = document.querySelectorAll(".game>div.display");
        display.forEach((element) => {
            element.classList.add("hidden");
        });
        this.screen.hideAnswerTable();
        this.advisoryGroupHelper.hideHelperList();
        this.gameOverSound.start();
        this.screen.showLights(1000000000, "4s");
        this.popup.update(_script.stopGame(this.questionNumber), () => {
            this.popup.update(_script.playAgain, () => {
                this.popup.hide();
                this.gameOverSound.stop();
                this.delay(() => {
                    this.resetGame();
                }, 300);
            });
            this.popup.render();
        });
        this.delay(() => {
            this.popup.show();
            this.popup.render(5000);
        }, 300);
    }
    resetGame() {
        this.isPlayAgain = true;
        this.init();
        this.screen.reset();
        this.timer.reset(TIME);
        this.advisoryGroupHelper.reset();
        this.updateAudienceAnswer([0, 0, 0, 0]);
    }

    showGuidePopup() {
        this.popup.show();
        this.delay(() => {
            this.explainRuleSound = new Sound("Sound/explain-rule.mp3");
            this.explainRuleBgSound = new Sound("Sound/explain-rule-bg-sound.mp3");
            this.explainRuleSound.start();
            this.explainRuleBgSound.start(true);
            this.popup.update(_script.introducePart1, () => {
                this.explainRuleSound.stop();
                this.explainRuleBgSound.stop();
                this.startGameSound.start();
                this.popup.update(_script.userAlready, () => {
                    this.startGameSound.stop();
                    this.startGame();
                    this.screen.hideLights();
                });
                this.popup.render(3000);
                this.startGameSound.onEnd(() => this.startGame());
            });
            this.popup.render(14000);
        }, 500);
        // update sự kiện tiếp theo
    }

    handleStartGame() {
        this.startSound.stop();
        if (!this.isPlayAgain) {
            this.showGuidePopup();
            return;
        }
        this.startGame();
    }
    handleBtnAskAdvisoryClick() {
        this.advisoryGroupHelper.updateAnswerData(this.question.correctId);
        this.screen.hideAnswerTable();
        this.popup.update(_script.advisoryGroupHelper, () => {
            this.popup.hide();
            this.advisoryGroupHelper.showHelperList();
            this.questionBgSound.stop();
            this.waitSelectAdvisoryGroupSound.start(true);
        });
        this.popup.show();
        this.popup.render(6000);
    }
    listener() {
        this.screen.onBtnRemoveAnswerClick(() => {
            this.handleBtnRemoveAnswerClick();
        });
        this.screen.onBtnAskAudienceClick(() => {
            this.handleBtnAskViewerClick();
        });
        this.screen.onBtnAskAdvisoryGroupClick(() => {
            this.handleBtnAskAdvisoryClick();
        });
        this.screen.onBtnStartGameClick(() => {
            this.handleStartGame();
        });
    }
}
class Responsive {
    constructor() {
        this.maintainAspectRatio();
        this.init();
    }

    init() {
        window.addEventListener("resize", this.maintainAspectRatio);
        window.addEventListener("orientationchange", this.maintainAspectRatio);
    }

    listener(callbackFunc) {
        window.addEventListener("resize", () => {
            callbackFunc();
        });
        window.addEventListener("orientationchange", () => {
            callbackFunc();
        });
    }

    maintainAspectRatio() {
        const container = document.querySelector("#game");
        const aspectRatio = 1920 / 1080;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        if (windowWidth / windowHeight > aspectRatio) {
            // Màn hình rộng hơn tỷ lệ 16:9
            container.style.height = `100%`;
            container.style.width = `${windowHeight * aspectRatio}px`;
        } else {
            // Màn hình cao hơn tỷ lệ 16:9
            container.style.width = `100%`;
            container.style.height = `${windowWidth / aspectRatio}px`;
        }
        container.style.fontSize = `${container.offsetWidth / 106}px`;
    }
}
    class LoadingChecker {
    constructor(gameHelper) {
        this.gameHelper = gameHelper;
        this.images = resource.images;
        this.audios = resource.audios;
        this.loadedCount = 0;
    }
    updateProcess() {
        this.loadedCount += 1;
        // let sum = this.images.length + this.audios.length;
        // const percent = (this.loadedCount / sum) * 100;
        // const processBar = document.querySelector(".process-bar");
        // processBar.style.width = `${percent}%`;
    }

    isAllResourceLoaded() {
        if (this.loadedCount == this.images.length + this.audios.length) {
            return true;
        }
        return false;
    }
    checkAllResourcesLoaded(handleLoaded) {
        let loadingTime = 0;
        const timeInterval = setInterval(() => {
            loadingTime += 1;
        }, 1000);
        const showAlert = () => {
            this.gameHelper.loader.showWithFlickerEffect();
            document.querySelector(".alert").classList.remove("hidden");
            document.querySelector("#alert-btn").addEventListener("click", () => handleLoaded());
        };
        const _handleLoaded = () => {
            clearInterval(timeInterval);
            if (loadingTime >= 3) {
                return showAlert();
            }
            setTimeout(() => showAlert(), 3000);
        };
        this.images.forEach((imageSrc) => {
            const image = new Image();
            image.src = imageSrc;
            image.onload = () => {
                this.updateProcess();
                if (this.isAllResourceLoaded()) {
                    _handleLoaded();
                }
            };
            image.onerror = () => {
                alert("Có lỗi xảy ra trong quá trình tải hình ảnh");
            };
        });
        this.audios.forEach((audioSrc) => {
            const audio = new Audio(audioSrc);
            audio.preload = "auto";
            audio.addEventListener("canplaythrough", () => {
                this.updateProcess();
                if (this.isAllResourceLoaded()) {
                    _handleLoaded();
                }
            });
            audio.onerror = () => {
                alert("Có lỗi xảy ra trong quá trình tải âm thanh");
            };
        });

        class LoadingChecker {
            constructor(gameHelper) {
                this.gameHelper = gameHelper;
                this.images = resource.images;
                this.audios = resource.audios;
                this.loadedCount = 0;
            }

            updateProcess() {
                this.loadedCount += 1;
                // let sum = this.images.length + this.audios.length;
                // const percent = (this.loadedCount / sum) * 100;
                // const processBar = document.querySelector(".process-bar");
                // processBar.style.width = `${percent}%`;
            }

            isAllResourceLoaded() {
                if (this.loadedCount == this.images.length + this.audios.length) {
                    return true;
                }
                return false;
            }

            checkAllResourcesLoaded(handleLoaded) {
                let loadingTime = 0;
                const timeInterval = setInterval(() => {
                    loadingTime += 1;
                }, 1000);
                const showAlert = () => {
                    this.gameHelper.loader.showWithFlickerEffect();
                    document.querySelector(".alert").classList.remove("hidden");
                    document.querySelector("#alert-btn").addEventListener("click", () => handleLoaded());
                };
                const _handleLoaded = () => {
                    clearInterval(timeInterval);
                    if (loadingTime >= 3) {
                        return showAlert();
                    }
                    setTimeout(() => showAlert(), 3000);
                };
                this.images.forEach((imageSrc) => {
                    const image = new Image();
                    image.src = imageSrc;
                    image.onload = () => {
                        this.updateProcess();
                        if (this.isAllResourceLoaded()) {
                            _handleLoaded();
                        }
                    };
                    image.onerror = () => {
                        alert("Có lỗi xảy ra trong quá trình tải hình ảnh");
                    };
                });
                this.audios.forEach((audioSrc) => {
                    const audio = new Audio(audioSrc);
                    audio.preload = "auto";
                    audio.addEventListener("canplaythrough", () => {
                        this.updateProcess();
                        if (this.isAllResourceLoaded()) {
                            _handleLoaded();
                        }
                    });
                    audio.onerror = () => {
                        alert("Có lỗi xảy ra trong quá trình tải âm thanh");
                    };
                });
            }
        }

        class GameHelper {
            constructor() {
                this.viewPort = new Responsive();
                this.loadingChecker = new LoadingChecker(this);
                this.loader = new Loader();
                this.init();
            }

            init() {
                this.enableLandscapeFullscreen();
                document.addEventListener("click", () => {
                    this.enableLandscapeFullscreen();
                });
                this.viewPort.listener(() => {
                    this.loader.init();
                    this.loader.updateDots();
                });
            }

            initGame() {
                this.loader.showWithLoadingEffect();
                this.loadingChecker.checkAllResourcesLoaded(() => {
                    document.querySelector(".loading").classList.add("hidden");
                    document.querySelector("#canvas").classList.remove("topView");
                    let game = new Game();
                    game.init();
                    this.loader.showWithRotateEffect();
                });
            }

            enableLandscapeFullscreen() {
                if (this.isMobileDevice()) {
                    this.rotateToLandscape();
                    this.openFullscreen();
                }
            }

            isMobileDevice() {
                return /Mobi|Android/i.test(window.navigator.userAgent);
            }

            // Xoay màn hình ngang (landscape mode)
            rotateToLandscape() {
                if (screen.orientation && screen.orientation.lock) {
                    screen.orientation.lock("landscape").catch(function (error) {
                        console.error("Không thể xoay màn hình:", error);
                    });
                } else if (screen.orientation && screen.orientation.type.includes("portrait")) {
                    screen.orientation.lock("landscape-primary").catch(function (error) {
                        console.error("Không thể xoay màn hình:", error);
                    });
                }
            }

            // Mở chế độ toàn màn hình
            openFullscreen() {
                const docElm = document.documentElement;
                if (docElm.requestFullscreen) {
                    docElm.requestFullscreen();
                } else if (docElm.mozRequestFullScreen) {
                    // Firefox
                    docElm.mozRequestFullScreen();
                } else if (docElm.webkitRequestFullscreen) {
                    // Chrome, Safari and Opera
                    docElm.webkitRequestFullscreen();
                } else if (docElm.msRequestFullscreen) {
                    // IE/Edge
                    docElm.msRequestFullscreen();
                }
            }
        }
    }

    }
document.addEventListener("DOMContentLoaded", function () {
    const gameHelper = new GameHelper();
    gameHelper.initGame();
});