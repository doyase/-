// ✅ 変数の初期化
let time = 0;
let score = 0;
let currentword = "";
let isPaused = false;
let timer;

// ✅ 難易度ごとの単語リスト
const Pythonwords = ["print", "len", "input", "str", "int", "float", "list", "dict", "set", "tuple",
    "open", "range", "enumerate", "zip", "map", "filter", "sorted", "sum", "min", "max",
    "abs", "round", "math.sqrt", "math.pow", "math.floor", "math.ceil", "time.sleep",
    "os.getcwd", "sys.exit", "random.randint", "re.match", "json.loads", "asyncio.run"];

const Cwords = [
    "printf", "scanf", "puts", "gets", "putchar", "getchar", "fopen", "fclose", "fread", "fwrite",
    "strlen", "strcpy", "malloc", "calloc", "realloc", "free", "atoi", "qsort", "bsearch", "rand"
];

const JavaScriptwords = [
    "console.log", "console.error", "console.warn", "console.info",
    "math.random", "math.floor", "math.ceil", "math.round", "math.sqrt",
    "settimeout", "setinterval", "promise", "async", "await", "json.parse", "json.stringify"
];

// ✅ HTML要素の取得
const timeElement = document.getElementById("time");
const wordElement = document.getElementById("word");
const inputElement = document.getElementById("input");
const scoreElement = document.getElementById("score");
const restartButton = document.getElementById("restartButton");

// ✅ スコアの保存
const highscoreElement = document.createElement("div");
highscoreElement.id = "highscore";
highscoreElement.textContent = `ハイスコア: ${localStorage.getItem("highscore") || 0}`;
document.body.appendChild(highscoreElement);

// ✅ 難易度変更
function updateDifficulty(score) {
    const difficultyElement = document.getElementById("difficulty");
    if (difficultyElement) {
        if (score < 10) {
            difficultyElement.textContent = "難易度: 簡単 (Python)";
        } else if (score < 20) {
            difficultyElement.textContent = "難易度: 普通 (C)";
        } else {
            difficultyElement.textContent = "難易度: 難しい (JavaScript)";
        }
    }
}

// ✅ 単語取得
function getWord(score) {
    if (score < 10) {
        return Pythonwords[Math.floor(Math.random() * Pythonwords.length)];
    } else if (score < 20) {
        return Cwords[Math.floor(Math.random() * Cwords.length)];
    } else {
        return JavaScriptwords[Math.floor(Math.random() * JavaScriptwords.length)];
    }
}

// ✅ ゲーム開始
function startGame() {
    if (time > 0 && !inputElement.disabled) return;
    isPaused = false;
    time = 50;
    resetUI();
    showWord();
    updateDifficulty(score);
    countdown();
}

// ✅ ゲーム終了
function endGame() {
    clearInterval(timer);
    alert(`ゲーム終了！\nスコア: ${score}`);
}

// ✅ カウントダウン
function countdown() {
    timer = setInterval(() => {
        if (!isPaused) {
            time--;
            timeElement.textContent = `制限時間: ${time}`;
            if (time === 0) {
                endGame();
            }
        }
    }, 1000);
}

// ✅ ボタンのイベントリスナー
document.getElementById("startButton").addEventListener("click", startGame);

