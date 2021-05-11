function main () {

    RESIZE (640,400);
    CSIZE(32,0,0);

    COLOR (7,0);
    CLS();
    CURSOR(100,50);
    PRINT("PLEASE INPUT VALUES...");
    CURSOR(50,90);
    PRINT("OVAL(X,Y,R+f,a+f,b-f,0.7)");
    CURSOR(70,130);
    PRINT("f = c to d ... ( loop )");

    user_input();

}

function user_input() {

    var captions = ["a =","b =","c =","d =","X =","Y =","R ="];

    INPUT(captions,user_drawing);

}

function user_drawing (values) {

    var a = values[0];
    var b = values[1];
    var c = values[2];
    var d = values[3];
    var x = values[4];
    var y = values[5];
    var r = values[6];

    for( var f=c;f<=d;f++) {
        COLOR(0,INT(RND()*7)+1);
        OVAL(x,y,r+f,a+f,b-f,0.7);
    }

}

