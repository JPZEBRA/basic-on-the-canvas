function main () {

    SPEED(3);

    CALL(welcome);

    CALL(user_box_f);
    CALL(user_box);

    CALL(user_circle_f);
    CALL(user_circle);

    CALL(user_oval_f);
    CALL(user_oval);

    CALL(user_poly);
    CALL(user_plot);

    SPEED(0.1);

    user_line_art_1();

    SPEED(3);

    CALL(user_paint_draw);
    CALL(user_paint_paint);

    CALL(user_line_art_2);
    CALL(user_line_art_3);
    CALL(user_line_art_4);
    CALL(user_text_art);

    END();

}

function welcome () {

    RESIZE (800,600);

    COLOR (7,0);
    CLS();
    CURSOR(0,32);
    CSIZE(32,1,0);
    PRINT("WELCOME !!!");

}


function user_box_f () {

    var i,color;

    COLOR(0,0);
    CLS();

    color = 0;
    for(i=0;i<300;i+=10) {
        color = (++color%8);
        COLOR(0,color);
        LINE_BF(i,i,800-i,600-i);

    }

}

function user_box () {

    var i,color;

    COLOR(0,0);
    PSIZE(3);
    CLS();

    color = 0;
    for(i=0;i<300;i+=10) {
        color = (++color%8);
        COLOR(0,color);
        LINE_B(i,i,800-i,600-i);

    }

}

function user_circle_f () {

    var i,color;

    COLOR(0,0);
    CLS();

    color = 0;
    for(i=0;i<590;i+=10) {
        color = (++color%8);
        COLOR(0,color);
        CIRCLE_F(400,300,300-i);

    }

}

function user_circle () {

    var i,color;

    COLOR(0,0);
    PSIZE(2);
    CLS();

    color = 0;
    for(i=0;i<590;i+=10) {
        color = (++color%8);
        COLOR(0,color);
        CIRCLE(400,300,300-i);

    }

}

function user_oval_f () {

    var i,color,sum;

    COLOR(0,0);
    CLS();

    sum = 0;
    color = 0;
    for(i=10;sum+i<=360;i+=10) {
        color = (++color%8);
        COLOR(0,color);
        OVAL_F(400,300,300,sum,sum+i,0.3);
        sum += i;
    }

}

function user_oval () {

    var r,d,color;

    COLOR(0,0);
    PSIZE(1);
    CLS();

    for(r=5;r<=200;r+=5) {
        for(d=0;d<=360;d+=36) {
            COLOR(0,d/36+1);
            OVAL(400,400-r,r,d,d+36,0.4);
        }
    }

}

function user_poly () {

    COLOR(0,0);
    CLS();

    COLOR(0,6);
    PSIZE(1);
    POLY(400,300,280,144,90,810,1.0);

}

function user_plot () {

    PSIZE(1);
    for(i=1;i<700;i++) {
        x  = INT(RND()*800);
        y  = INT(RND()*600);
        c  = INT(RND()*7) + 1;
        COLOR(0,c);
        PSET(x,y);
    }
}

function user_line_art_1 () {

    COLOR(0,0);
    PSIZE(5);
    CLS();

    for(i=0;i<100;i++) CALL(user_line_art_1_sub);

}


function user_line_art_1_sub () {

    var x,y,c;

    x  = INT(RND()*800);
    y  = INT(RND()*600);
    c  = INT(RND()*7) + 1;
    COLOR(0,c);
    LINE(400,300,x,y);

}

function user_paint_draw () {

    CSIZE(32,0,1);

    COLOR (1,0);
    CLS();

    CURSOR(30,30);
    PRINT("PAINT IT !!!");

    COLOR(7,1);
    PSIZE(1);
    POLY(320,240,100,170,0,6120,1.0);
    POLY(120,140,50,170,0,6120,1.0);
    POLY(520,440,50,170,0,6120,1.0);

}

function user_paint_paint() {

    COLOR (7,5);
    PAINT(320,240,1);

    COLOR (7,4);
    PAINT(120,140,1);
    PAINT(520,440,1);

    COLOR (7,6);
    PAINT(1,1,1);

}

function user_line_art_2 () {

    var i,color;

    COLOR(0,0);
    PSIZE(3);
    CLS();


    color = 0;
    for(i=0;i<600;i+=5) {
        color = (++color%8);
        COLOR(0,color);
        LINE(0,i,i,600);
    }

}

function user_line_art_3 () {

    var i,x,y;

    COLOR(0,4);
    PSIZE(1);

    for(i=0;i<360;i+=3) {
        x = 440 - 200*COS(i); 
        y = 300 - 200*SIN(i)*COS(i); 
        LINE(x,y,640-x,400-y);
    }

}


function user_line_art_4 () {

    var i,x,y;

    COLOR(0,6);
    PSIZE(1);

    for(i=0;i<800;i++) {
        x = i;
        y = 300 + 100*TAN(i); 
        LINE(x,300,x,y);
    }

}

function user_text_art () {

    var i,color;

    color = 0;
    for(i=1;i<16;i++) {
        color = (++color%8);

        COLOR(color,0);
        CSIZE(4*i,1,1);
        CURSOR(i*16,i*16);
        PRINT("HELLO BASIC !!!");

    }

}
