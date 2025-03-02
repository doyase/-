console.log("script.js 読み込み完了！");

        //Pythonの標準ライブラリ(難易度:簡単)
        const Pythonwords = ["print", "len", "input", "str", "int", "float", "list", "dict", "set", "tuple",
    "open", "range", "enumerate", "zip", "map", "filter", "sorted", "sum", "min", "max",
            "abs", "round", "math.sqrt", "math.pow", "math.floor", "math.ceil", "time.sleep",
            "os.getcwd", "sys.exit", "random.randint", "re.match", "json.loads", "asyncio.run"]


        //Cの標準ライブラリ(難易度:普通)
        const Cwords = [
            "printf", "scanf", "puts", "gets", "putchar", "getchar", "fopen", "fclose", "fread", "fwrite",
            "strlen", "strcpy", "strncpy", "strcat", "strncat", "strcmp", "strncmp", "strchr", "strrchr", "strstr",
            "malloc", "calloc", "realloc", "free", "atoi", "atof", "strtod", "qsort", "bsearch", "rand",
            "sqrt", "pow", "abs", "ceil", "floor", "sin", "cos", "tan", "log", "exp",
            "time", "clock", "difftime", "strftime", "localtime", "gmtime",
            "assert", "perror", "exit", "system", "stdio.h", "string.h", "stdlib.h", "math.h", "time.h"];

        //JavaScriptの標準ライブラリ(難易度:難しい)
        const JavaScriptwords = [
            "console.log", "console.error", "console.warn", "console.info",
            "math.random", "math.floor", "math.ceil", "math.round", "math.sqrt",
            "math.pow", "math.abs", "math.sin", "math.cos", "math.tan",
            "string.prototype.length", "string.prototype.slice", "string.prototype.substr",
            "string.prototype.replace", "string.prototype.tolowercase",
            "string.prototype.touppercase", "string.prototype.split",
            "string.prototype.trim", "array.prototype.push", "array.prototype.pop",
            "array.prototype.shift", "array.prototype.unshift", "array.prototype.map",
            "array.prototype.filter", "array.prototype.reduce", "array.prototype.foreach",
            "array.prototype.find", "array.prototype.includes", "document.getelementbyid",
            "document.queryselector", "document.createelement", "document.appendchild", "document.removechild",
            "date.now", "new date()", "date.prototype.getfullyear", "date.prototype.getmonth",
            "date.prototype.getdate", "date.prototype.gethours", "date.prototype.getminutes",
            "settimeout", "setinterval", "promise", "async", "await",
            "json.parse", "json.stringify"];


        let time = 0;
        let score = 0;
        let currentword = "";
        let isPaused = false;
        let timer;

        //タグのID取得(画面に描画させる文字)
        const timeElement = document.getElementById("time");
        const wordElement = document.getElementById("word");
        const inputElement = document.getElementById("input");
        const scoreElement = document.getElementById("score");
        const restartButton = document.getElementById("restartButton");
        //保存されたスコアの取得
        const highscoreElement = document.createElement("div");
        highscoreElement.id = "highscore";
        highscoreElement.textContent = `ハイスコア: ${localStorage.getItem("highscore") || 0}`;
        document.body.appendChild(highscoreElement);

        //一時停止ボタンの処理
        document.getElementById("pauseButton").addEventListener("click", function () {
            if (!isPaused) {
                clearInterval(timer);//タイマーを停止
                inputElement.disabled = true;//入力欄を無効化
                this.textContent = "さいかい";//ボタンの表示を変更
            } else {
                countdown();//タイマーを再開
                inputElement.disabled = false;//入力欄を有効か
                this.textContent = "いちじて～し";//ボタン表示を戻す
                inputElement.focus();
            }
            isPaused = !isPaused;
        });

        //スコアにより出題難易度を変える
        function getWord(score) {
            // 0-9点: Python, 10-19点: C, 20点以上: JavaScript
            if (score < 10) {
                return Pythonwords[Math.floor(Math.random() * Pythonwords.length)];
            }
            else if (score < 20) {
                return Cwords[Math.floor(Math.random() * Cwords.length)]
            }
            else {
                return JavaScriptwords[Math.floor(Math.random() * JavaScriptwords.length)];
            }
        }

        //ランダムに単語を表示
        function showWord() {
            currentword = getWord(score);
            if (currentword) {
                wordElement.textContent = currentword;
            }
            else {
                console.error("出題単語が見つかません");
            }
        }        

        //主題と入力の正解か不正解かをチェック
        inputElement.addEventListener("input", function () {
            if (inputElement.value === currentword) {
                //正解なら入力欄を緑に
                inputElement.classList.add("correct");
                setTimeout(() => inputElement.classList.remove("correct"), 200);  //0.2秒後に元に戻す
                score++;
                scoreElement.textContent = `スコア: ${score}`;
                updateDifficulty(score);
                inputElement.value = "";  //入力欄をクリア
                showWord();  //次の単語の表示
            }
            else {
                //間違えたら赤くする
                inputElement.classList.add("wrong");
                setTimeout(() =>inputElement.classList.remove("wrong"), 200);  //0.2秒後に元に戻す
            }
        });


        //現在の難易度を表示させる
        function updateDifficulty(score) {
            const difficultyElement = document.getElementById("difficulty");
            if (difficultyElement) {
                if (score < 10) {
                    difficultyElement.textContent = "難易度: 簡単(Python)";
                }
                else if (score < 20) {
                    difficultyElement.textContent = "難易度: 普通(C)";
                }
                else {
                    difficultyElement.textContent = "難易度: 難しい(javascript)";
                }
            } else {
                console.error("難易度要素が見つかりません");
            }
        }

        //制限時間設定(入力に不備があった場合デフォルトの設定60を返す)
        function setTimeLimit(){
            let limit = parseInt(prompt("ゲームの制限時間を30～120秒の間で半角数字で設定してください", 60));
            if (isNaN(limit) || limit < 30 || limit > 120) {
                alert("正しく数字が入力されなかったため、デフォルト設定の60秒に設定しゲームを開始します");
                return 60;
            }
            return limit;
        }

        //スコアの再初期化
        function resetUI() {
            score = 0;
            timeElement.textContent = `制限時間: --秒`;
            scoreElement.textContent = `スコア: 0`;
            inputElement.value = "";
            inputElement.disabled = false;
            isPaused = false;//一時停止状態をリセット
        }

        //タイマー
        function countdown() {
            timer = setInterval(() => {
                if (!isPaused) {
                time--;
                timeElement.textContent = `制限時間: ${time}`;
                //timeが0ならゲームを終了させる
                    if (time === 0) {
                        endGame(timer, score);
                    }
                }
            }, 1000);
        }

        //ゲーム開始(メイン部分)
        function startGame() {
            if (time > 0 && !inputElement.disabled) return; // すでにゲームが動いていたら何もしない

            isPaused = false;//一時停止状態をリセット
            time = setTimeLimit();
            resetUI();           
            scoreElement.textContent = `スコア: ${score}`;
            timeElement.textContent = `制限時間: ${time}`;
            inputElement.focus();
            showWord();
            updateDifficulty(score);
            countdown();
            
        }

        //ゲーム終了
        function endGame(timer) {
            clearInterval(timer);
            alert(`ゲーム終了！\nスコア: ${score}`);
            //スコアを保存
            const currentHighscore = parseInt(localStorage.getItem("highscore")) || 0;
            


            //新しいスコアがハイスコアを超えた場合更新
            if (score > currentHighscore) {
                localStorage.setItem("highscore", score);
                highscoreElement.textContent = `ハイスコア ${score}`;
            }

            inputElement.disabled = true;
            restartButton.style.display = "inline-block";//ボタンを表示
            
        }
        //もう一度プレイボタンを押したら再スタート
        restartButton.addEventListener("click", function () {
            restartButton.style.display = "none";//再スタート時にボタンを隠す
            startGame();//ゲーム再開
        });

        //イベントリスナーでゲーム開始を制御
        document.getElementById("startButton").addEventListener("click", startGame);
