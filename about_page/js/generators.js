/**
 * Created by GuoJunjun on 29.12.14. JunjunGuo.com
 *
 */

var qtextfil = './junjunguofiles/quotations.txt';


var reader = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');
var quotesArray = [];
var qconter = 0, jconter = 0;

function loadQfile(textFile) {
    reader.open('get', textFile, true);
    reader.onreadystatechange = displayQContents;
    reader.send(null);
}


function displayQContents() {
    if (reader.readyState == 4) {
        quotesArray = reader.responseText.split("\n");
        quotesArray = shuffleList(quotesArray);
        generateQuotes(qconter);
    } else {
        quotesArray = "Wonder is the beginning of wisdom.    <br>Socrates";
    }
}

/**
 * Generate a quote
 * @param n
 */
function generateQuotes(n) {
    var theQuotation = quotesArray[n].split("#");
    document.getElementById("anewquote").innerHTML = "<p>" + theQuotation[1] + "</p><h5> - " + theQuotation[0] + "</h5>";
}

/**
 * Shuffle a list
 *
 * @param list
 * @returns {Array}
 */
function shuffleList(list) {
    var copy = [], index, n = list.length;
    while (n) {
        index = Math.floor(Math.random() * (n--));
        copy.push(list[index]);
        list.splice(index, 1);
    }
    return copy;
}

// random quotations finish

// joke generator start

var imglist = [
    '2b就2b呗，还结巴.jpg',
    'Its not a bug, its a feature..jpg',
    'Todays Funny Wearing.jpg',
    'random number.png',
    '主人，你过来，我保证不咬你.jpg',
    '主人，我美么.jpg',
    '人生是什么，恩？让我想想.jpg',
    '你个骗纸！！！姿势简直太标准.gif',
    '你是怎么怀孕的.jpg',
    '你这是在自己玩么.gif',
    '健身后的效果.jpg',
    '凌云飞渡笑傲江湖.gif',
    '县级公路惊现飘移车神.gif',
    '哥们，好身手啊.gif',
    '哥们，算，算。。。算你很.gif',
    '嘿嘿，嘿喂够。电臀都起来.gif',
    '坑爹的上帝.gif',
    '妈，我心脏有点不舒服，先挂了.jpg',
    '彪悍的人生不需要解释.gif',
    '很想知道人为什么不能从水里跳这么高.gif',
    '我只想说：这样有加班费么？？.jpg',
    '我来教你怎么走路.gif',
    '挤眉弄眼神马的最开心了.gif',
    '每个人都是宇宙的中心.GIF',
    '灰太狼失败的基本原因是别的狼都吃生的.jpg',
    '熊孩子，逗姥姥玩是吧！.gif',
    '牛.gif',
    '牛叉！！.gif',
    '第一遍看时并没有觉得哪里不对.jpg',
    '苦逼的程序员！.jpg',
    '这技术，屌爆了！.gif',
    '这车是用来卖萌的吗？.gif',
    '孙悟空和苍井空的相似之处.jpg',
    '马拉个币的，只能走路回家了.gif' ]

var jtextFile = './image/fun/joke.txt';
//var images = imglist;
var jokelist = [], htmllist = [];

var readj = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');
function loadJfile(textFile) {
    readj.open('get', textFile, true);
    readj.onreadystatechange = displayJContents;
    readj.send(null);
}

function displayJContents() {
    if (readj.readyState == 4) {
        jokelist = readj.responseText.split("#");
        initialload();
        jgenerator(jconter);
    } else {
        jokelist =
            '"Wife: "How would you describe me?"<br>Husband: "ABCDEFGHIJK."<br>Wife: "What does that mean?"<br>Husband: "Adorable, beautiful, cute, delightful, elegant, fashionable, gorgeous, and hot."<br>Wife: "Aw, thank you, but what about IJK?"<br>Husband: "I m just kidding!"';
    }
}
/**
 * initial data, and load them ready for use;
 */
function initialload() {
    loadimages();
    loadjokes();
    htmllist = shuffleList(htmllist);
}
/**
 * Load images to htmllist
 */
function loadimages() {
    for (i = 0; i < imglist.length; i++) {
        var str = imglist[i].split(".");
        var title = str[0];
//        var fileType = str[1];
        htmllist.push("<img src='image/fun/" + imglist[i] + "'" + "alt='junjunguo.com'>" + "\n" + "<h1>" + title + "</h1>");
    }
}
/**
 * Load jokes to htmllist
 */
function loadjokes() {
    for (i = 0; i < jokelist.length; i++) {
        htmllist.push("<p>" + text2html(jokelist[i]) + "</p>");
    }
}

/**Generate a joke og a humor image from htmllist[n]
 *
 * @param n
 */
function jgenerator(n) {
    document.getElementById("funny").innerHTML = htmllist[n];
}
/**
 * simple text to html function
 * @param str
 * @returns {XML|string|void|*}
 */
function text2html(str) {
    if (str.charAt(0) == "\n") {
        str = str.substr(1, str.length);
    }
    var find = '\n';
    var re = new RegExp(find, 'g');
    str = str.replace(re, '<br>');
    return str;
}


// load functions:   --------------------->

// load joke generator:
loadJfile(jtextFile);

var preJoke = document.getElementById("njl");
preJoke.onclick = function () {
    document.getElementById('myHumor').scrollIntoView();
    jconter--;
    jgenerator(Math.abs(jconter % htmllist.length));
//    adjustscreensize($("myHumor"));
}
var nextJoke = document.getElementById("njr");
nextJoke.onclick = function () {
    document.getElementById('myHumor').scrollIntoView();
    jconter++;
    jgenerator(Math.abs(jconter % htmllist.length));
//    adjustscreensize($("myHumor"));
}


//load  quotations:
loadQfile(qtextfil);

var preQuotes = document.getElementById("nql");
preQuotes.onclick = function () {
    document.getElementById('myQuotes').scrollIntoView();
    qconter--;
    generateQuotes(Math.abs(qconter % quotesArray.length));
//    adjustscreensize($("myQuotes"));
}

var nextQuote = document.getElementById("nqr");
nextQuote.onclick = function () {
    document.getElementById('myQuotes').scrollIntoView();
    qconter++;
    generateQuotes(Math.abs(qconter % quotesArray.length));
//    adjustscreensize($("myQuotes"));
}


//function adjustscreensize(idTag) {
//    var $header = idTag.find('header');
//    var $window = $(window);
//    var diff = ($window.height() - $header.outerHeight(true));
//    if (diff < 0) {
//        idTag.css('padding', 5 + 'px 0 ' + 60 + 'px 0');
//        console.log(('padding <0 : '+ 5 + 'px 0 ' + 60 + 'px 0'));
//    } else {
//        idTag.css('padding', (diff / 2) + 'px 0 ' + (diff / 2) + 'px 0');
//        console.log('padding: '+ (diff / 2) + 'px 0 ' + (diff / 2) + 'px 0');
//    }
//}