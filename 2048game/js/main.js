var board = new Array();
var hasConflicted = new Array();
var score = 0;

$(function () {
    newgame();
});

function newgame() {
	if($('#gameover')){
		$('#gameover p').remove();
	    $('#gameover span').remove();
	    $('#gameover a').remove();
	    $('#gameover').remove();
	};
    //初始化棋盘格
    init();
    //在随机两个格子生成数字
    generateOneNumber();
    generateOneNumber();
}

function restartgame() {
    $('#gameover p').remove();
    $('#gameover span').remove();
    $('#gameover a').remove();
    $('#gameover').remove();
    newgame();
}

function init() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var gridCell = $("#grid-cell-" + i + "-" + j);
            gridCell.css("top", getPosTop(i, j));
            gridCell.css("left", getPosLeft(i, j));
        }
    }

    for (var i = 0; i < 4; i++) {
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for (var j = 0; j < 4; j++) {
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }

    updateBoardView();
    score = 0;
    $('#score').text(0);
}

function updateBoardView() {
    $(".number-cell").remove();
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            $("#grid-container").append("<div class='number-cell' id='number-cell-" + i + "-" + j + "'></div>");
            var numberCell = $("#number-cell-" + i + "-" + j);

            if (board[i][j] == 0) {
                numberCell.css("width", "0px");
                numberCell.css("height", "0px");
                numberCell.css("top", getPosTop(i, j) + 50);
                numberCell.css("left", getPosLeft(i, j) + 50);
            } else {
                numberCell.css("width", "220px");
                numberCell.css("height", "220px");
                numberCell.css("top", getPosTop(i, j));
                numberCell.css("left", getPosLeft(i, j));
                numberCell.css("background-color", getNumberBackgroundColor(board[i][j]));
                numberCell.css("color", getNumberColor(board[i][j]));
                numberCell.text(sda(board[i][j]));
            }

            hasConflicted[i][j] = false;
        }
    }

    $(".number-cell").css("line-height", "220px");
    $(".number-cell").css("font-size", "130px");
}
function  sda(i) {
    if(i==2){
        return "李"
    }
    if(i==4){
        return "张"
    }
    if(i==8){
        return "畅"
    }
    if(i==16){
        return "晶"
    }
    if(i==32){
        return "遇"
    }
    if(i==64){
        return "友"
    }
    if(i==128){
        return "心"
    }
    if(i==256){
        return "爱"
    }
    if(i==512){
        return "恋"
    }
    if(i==1024){
        return "思"
    }
    if(i==2048){
        return "婚"
    }
    if(i==4096){
        return "家"
    }
}
function generateOneNumber() {
    if (nospace(board)) {
        return false;
    }
    //随机一个位置
    var randx = parseInt(Math.floor(Math.random() * 4));
    var randy = parseInt(Math.floor(Math.random() * 4));
    while (true) {
        if (board[randx][randy] == 0) {
            break;
        }
        var randx = parseInt(Math.floor(Math.random() * 4));
        var randy = parseInt(Math.floor(Math.random() * 4));
    }

    //随机一个数字
    var randNumber = Math.random() < 0.5 ? 2 : 4;

    //在随机位置显示随机数字
    board[randx][randy] = randNumber;
    ShowNumberWithAnimation(randx, randy, sda(randNumber));

    return true;
}
