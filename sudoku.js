document.addEventListener("DOMContentLoaded", function () {
    const seed = [
        [5, 3, 4, 6, 7, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9]
    ];
    let puzzle= [[],[],[],[],[],[],[],[],[]];
    let solution= [[],[],[],[],[],[],[],[],[]];
    let enableTimer = false;
    let checking = false;
    let second = 0, minute = 0, hour = 0;
    copyArray(seed,puzzle);
    const timer = document.getElementById("timer");
    const container = document.getElementById("container");
    function time(){
        second++;
        if (second === 60){
            second = 0;
            minute++;
            if (minute === 60){
                minute = 0;
                hour++;
            }
        }
        timer.innerHTML = "<h1>"+((hour<10)?"0"+hour:hour)+":"+((minute<10)?"0"+minute:minute)+":"+((second<10)?"0"+second:second)+"</h1>"; 
    }
    function copyArray(seed,newArray){
        for (let i = 0;i<9;i++){
            for (let j = 0;j<9;j++){
                newArray[i][j]=seed[i][j];
            }
        }
    }
    function swapNumber(puzzle){
        for (let i = 1; i<10;i++){
            let temp = Math.ceil(Math.random()*9);
            puzzle.forEach(row => {
                for (let j = 0; j < row.length; j++) {
                    if (row[j] == i) {
                        row[j] = temp;
                    } else if (row[j] == temp) {
                        row[j] = i;
                    }
                }
            });
        }
    }
    function swapRow(puzzle){
        for (let i = 0; i<9;i++){
            let temp1 = Math.floor(Math.random() * 3) + Math.floor(i / 3) * 3;
            for (let j = 0; j<9;j++){
                let temp2 = puzzle[i][j];
                puzzle[i][j] = puzzle[temp1][j];
                puzzle[temp1][j] = temp2;
            }
        }
    }
    function swapCol(puzzle){
        for (let i = 0; i<9;i++){
            let temp1 = Math.floor(Math.random() * 3) + Math.floor(i / 3) * 3;
            for (let j = 0; j<9;j++){
                let temp2 = puzzle[j][i];
                puzzle[j][i] = puzzle[j][temp1];
                puzzle[j][temp1] = temp2;
            }
        }
    }
    function Transpose(puzzle){
        for (let i = 0; i<9;i++){
            for (let j = i+1; j<9;j++){
                let temp = puzzle[i][j];
                puzzle[i][j] = puzzle[j][i];
                puzzle[j][i] = temp;
            }
        }
    }
    function deleteCell(puzzle){
        let max = 61;
        let min = 30;
        let emptyCellNumber=Math.floor(Math.random()*(max-min))+min;
        let count = 0;
        while (count < emptyCellNumber){
            let i = Math.floor(Math.random()*9);
            let j = Math.floor(Math.random()*9);
            if (puzzle[i][j]==0) continue;
            else {
                puzzle[i][j]=0;
                count++;
            }
        }
    }
    function ValidMove(puzzle, row, col){
        let num ="123456789";
        for (let i = 0; i < 9 ; i++){
            if (i!==col) num = num.replace(String(puzzle[row][i]),'');
            if (i!==row) num = num.replace(String(puzzle[i][col]),'');
        }
        for (let i = Math.floor(row/3)*3;i<Math.floor(row/3)*3+3;i++){
            for (let j = Math.floor(col/3)*3;j<Math.floor(col/3)*3+3;j++){
                if (!(i===row && i===col)) num = num.replace(String(puzzle[i][j]),'');
            }
        }
        return num;
    }
    function solvePuzzle(seed,puzzle,solution,row,col){
        if (row === 9) return true;
        if (col === 9) return solvePuzzle(seed,puzzle,solution,row+1,0);
        if (solution[row][col] !== 0){
            return solvePuzzle(seed,puzzle,solution,row,col+1);
        }
        else{
            let validMoves = ValidMove(solution,row,col);
            if (validMoves.length===1){
                solution[row][col] = Number(validMoves);
                if (solvePuzzle(seed, puzzle, solution, row, col + 1)) return true; ;
                solution[row][col] = 0;
            }
            else{
                for (let k = 0; k < validMoves.length; k++){
                    solution[row][col] = Number(validMoves[k]);
                    if (solvePuzzle(seed, puzzle, solution, row, col + 1)) return true; ;
                    solution[row][col] = 0;
                }
            }
        }
        return false;
    }
    function generateRandomSudokuPuzzle(puzzle){
        swapNumber(puzzle);
        swapRow(puzzle);
        swapCol(puzzle);
        Transpose(puzzle);
        deleteCell(puzzle);
        copyArray(puzzle,solution);
    }
    generateRandomSudokuPuzzle(puzzle);
    createSudokuGrid(puzzle,puzzle);
    
    // Function to create the Sudoku puzzle grid
    function createSudokuGrid(puzzle, currentSolve) {
        container.innerHTML = '';
        for (let i = 0; i<9;i++){
            let rowElement = document.createElement('div');
            rowElement.classList.add('row');
            for (let j = 0; j<9;j++) {
                let cellElement = document.createElement('input');
                cellElement.classList.add('cell');
                cellElement.maxLength = 1;
                cellElement.type ='text';
                cellElement.value = (currentSolve[i][j]!==0)?currentSolve[i][j]:'';
                cellElement.readOnly = (puzzle[i][j]!==0)?true:false;
                cellElement.id=String(i)+String(j);
                cellElement.style.backgroundColor = (puzzle[i][j]!==0)?'#ccd4d2':'#fafafa';
                if (!cellElement.readOnly) {
                    cellElement.addEventListener('input', function() {
                        this.value = this.value.replace(/[^0-9]/g, '');
                        this.value = (this.value.length()>1)?this.value.charAt(0):this.value;
                    });
                }
                rowElement.append(cellElement);
            };
            container.append(rowElement);
        }
    }
    function ValidCheck(){
        let currentSolve = [[],[],[],[],[],[],[],[],[]];
        copyArray(puzzle,currentSolve)
        for (let i = 0; i<9;i++){
            for (let j = 0; j<9;j++){
                if (puzzle[i][j]!==0) continue;
                if (document.getElementById(String(i)+String(j)).value !== ''){
                    currentSolve[i][j] = Number(document.getElementById(String(i)+String(j)).value);
                }
            }
        }
        for (let i = 0; i<9;i++){
            for (let j = 0; j<9;j++){
                if (puzzle[i][j]===0 && currentSolve[i][j]!==0){
                    let isValid = true;
                    for (let k = 0; k < 9; k++) {
                        if ((currentSolve[i][j] === currentSolve[i][k] && k !== j) ||
                            (currentSolve[i][j] === currentSolve[k][j] && k !== i)) {
                            isValid = false;
                            break;
                        }
                    }
                    if (isValid) {
                        let startRow = Math.floor(i / 3) * 3;
                        let startCol = Math.floor(j / 3) * 3;
                        for (let x = startRow; x < startRow + 3; x++) {
                            for (let y = startCol; y < startCol + 3; y++) {
                                if (currentSolve[i][j] === currentSolve[x][y] && !(x === i && y === j)) {
                                    isValid = false;
                                    break;
                                }
                            }
                            if (!isValid) {
                                break;
                            }
                        }
                    }
                    if (!isValid) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    function ValidColor(){
        let currentSolve = [[],[],[],[],[],[],[],[],[]];
        copyArray(puzzle,currentSolve)
        for (let i = 0; i<9;i++){
            for (let j = 0; j<9;j++){
                if (puzzle[i][j]!==0) continue;
                if (document.getElementById(String(i)+String(j)).value !== ''){
                    currentSolve[i][j] = Number(document.getElementById(String(i)+String(j)).value);
                }
            }
        }
        for (let i = 0; i<9;i++){
            for (let j = 0; j<9;j++){
                let cell = document.getElementById(String(i) + String(j));
                if (puzzle[i][j]==0 && currentSolve[i][j]==0) {
                    cell.style.backgroundColor = '#fafafa';
                } 
                else if (puzzle[i][j]===0 && currentSolve[i][j]!==0){
                    let isValid = true;
                    for (let k = 0; k < 9; k++) {
                        if ((currentSolve[i][j] === currentSolve[i][k] && k !== j) ||
                            (currentSolve[i][j] === currentSolve[k][j] && k !== i)) {
                            isValid = false;
                            break;
                        }
                    }
                    if (isValid) {
                        let startRow = Math.floor(i / 3) * 3;
                        let startCol = Math.floor(j / 3) * 3;
                        for (let x = startRow; x < startRow + 3; x++) {
                            for (let y = startCol; y < startCol + 3; y++) {
                                if (currentSolve[i][j] === currentSolve[x][y] && !(x === i && y === j)) {
                                    isValid = false;
                                    break;
                                }
                            }
                            if (!isValid) {
                                break;
                            }
                        }
                    }
                    if (!isValid) cell.style.backgroundColor = '#f75656'; 
                    else cell.style.backgroundColor = '#34d134'; 
                }
            }
        }
    }
    document.getElementById('generateButton').onclick = function(){
        copyArray(seed,puzzle);
        generateRandomSudokuPuzzle(puzzle)
        createSudokuGrid(puzzle,puzzle);
        timer.innerHTML = "<h1>00:00:00</h1>"; 
        document.getElementById('startButton').innerText = "Start";
        clearInterval(interval);
        enableTimer = false;
        hour = 0;
        minute = 0;
        second = 0;
    }
    document.getElementById('solveButton').onclick = function(){
        let currentSolve = [[],[],[],[],[],[],[],[],[]];
        copyArray(puzzle,currentSolve)
        for (let i = 0; i<9;i++){
            for (let j = 0; j<9;j++){
                if (puzzle[i][j]!==0) continue;
                if (document.getElementById(String(i)+String(j)).value !== ''){
                    currentSolve[i][j] = Number(document.getElementById(String(i)+String(j)).value);
                }
            }
        }
        if (ValidCheck() && solvePuzzle(seed,puzzle,currentSolve,0,0)) createSudokuGrid(puzzle,currentSolve);
        else {
            solvePuzzle(seed,puzzle,solution,0,0);
            createSudokuGrid(puzzle,solution);
            let result = document.createElement('h2');
            result = "Không tồn tại kết quả đúng theo lời giải hiện tại. Hiển thị kết quả tham khảo.";
            container.append(document.createElement('br'));
            container.append(result);
        };
        clearInterval(interval);
        enableTimer = false;
        document.getElementById('startButton').innerText = "Start";
    }
    document.getElementById('clearButton').onclick = function(){
        createSudokuGrid(puzzle,puzzle);
    }
    document.getElementById('checkButton').onclick = function(){
        let currentSolve = [[],[],[],[],[],[],[],[],[]];
        copyArray(puzzle,currentSolve)
        for (let i = 0; i<9;i++){
            for (let j = 0; j<9;j++){
                if (puzzle[i][j]!==0) continue;
                if (document.getElementById(String(i)+String(j)).value !== ''){
                    currentSolve[i][j] = Number(document.getElementById(String(i)+String(j)).value);
                }
            }
        }
        if (!checking) {
            checking = true;
            ValidColor();
        }
        else {
            checking = false;
            createSudokuGrid(puzzle,currentSolve);
        }
    }
    document.getElementById('hintButton').onclick = function(){
        let currentSolve = [[],[],[],[],[],[],[],[],[]];
        copyArray(puzzle,currentSolve)
        let copyCurrentSolve= [[],[],[],[],[],[],[],[],[]];
        for (let i = 0; i<9;i++){
            for (let j = 0; j<9;j++){
                if (puzzle[i][j]!==0) continue;
                if (document.getElementById(String(i)+String(j)).value !== ''){
                    currentSolve[i][j] = Number(document.getElementById(String(i)+String(j)).value);
                }
            }
        }
        copyArray(currentSolve,copyCurrentSolve);
        if (solvePuzzle(seed,puzzle,copyCurrentSolve,0,0)) {
            count = 0;
            while (count < 1){
                let full = true;
                for (let i = 0; i<9; i++){
                    for (let j=0; j<9; j++){
                        if (currentSolve[i][j] === 0){
                            full = false;
                            break;
                        }
                    }
                    if (!full) break;
                }
                if (full) break;
                let i = Math.floor(Math.random()*9);
                let j = Math.floor(Math.random()*9);
                if (puzzle[i][j]!==0) continue;
                else {
                    if (copyCurrentSolve[i][j]===currentSolve[i][j]) continue;
                    else {
                        currentSolve[i][j] = copyCurrentSolve[i][j];
                        count++;
                    }
                }
            }
            createSudokuGrid(puzzle,currentSolve);
        }
        else {
            solvePuzzle(seed,puzzle,solution,0,0);
            let hint = false;
            for (let i = 0; i<9; i++){
                for (let j=0; j<9; j++){
                    if (puzzle[i][j]===0 && currentSolve[i][j]!==0 && solution[i][j] !== currentSolve[i][j]){
                        currentSolve[i][j] = solution[i][j];
                        hint = true;
                        break;
                    }
                }
                if (hint) break;
            }
            createSudokuGrid(puzzle,currentSolve);
        };
    }
    document.getElementById('startButton').onclick = function(){
        if (enableTimer === false){
            enableTimer = true;
            document.getElementById('startButton').innerText = "Stop";
        }
        else {
            enableTimer = false;
            document.getElementById('startButton').innerText = "Start";
        }
        if(enableTimer) interval = setInterval(time,1000);
        else clearInterval(interval);
    }
});
