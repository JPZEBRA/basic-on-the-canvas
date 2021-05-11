/* HUGE NUMBER CALCULATOR 2 */
/* by K-ARAI Version 0.1.3  */

/* EXPAND */
var EX = 1;

/* BIG DIGIT VAR */
var M;
var R;

var I;
var F;

var K;

/* BIG DIGIT PI */
var PI;

/* RESULT CHECK */
var F_ERR;

/* COMMAND */
var C;
var FC;
var FM;

/* OPERATION */
var OPE;

/* INPUT */
var line;

/* EFECT */
var sound = true;

/* DISP */
var bANS = false;
var bKAN = false;

/************************************************************************/

function main () {

    RESIZE (1280,400*EX+20);
    CSIZE(24,0,0);
    CMAP(73,5*EX+7);

    SOUND_INIT();

    COLOR (7,0);
    CLS();
    CURSOR(100,50);
    PRINT("PLEASE INPUT EXPRESSION");

    init();

    SPEED(0.8);

    user_input();

}

function init() {

    SetFloatedBigDigitKeta(250*EX);

    M = new FloatedBigDigit();
    R = new FloatedBigDigit();

    I = new FloatedBigDigit();
    F = new FloatedBigDigit();

    K = new FloatedBigDigit();
    K.set(10);
    K.power(72);

    PI = new FloatedBigDigit();

    PI.SetPI();

    R.clear();
    M.clear();

}

function user_input() {

    var captions = ["CALC : "];

    INPUTS(captions,parse_input);

}

/************************************************************************/

function parse_input (values) {

    bANS = false;
    bKAN = false;

    line = values[0];

    F_ERR = false;

    C = "R";
    OPE = "";

    CALL(step_1m);

}

function step_1m() {

    I.Copy(R);

    line = trim(line);

    if(line==""|| line=="=") {
        CALL(step_2);
    } else if(to_next(line)) {
        CALL(step_2);
    } else {

        FM = "";
        line = parse_memory(line);

        if(FM!="") {
            if(calc_memory(FM)) {
                R.Copy(I);
                if(sound) SOUND_PLAY(3);
                CALL(step_1m);
            } else {
                disp(R);
                if(sound) SOUND_PLAY(3);
                CALL(step_1m);
            }
        } else {
            CALL(step_1f);
        }
    }

}

function step_1f() {

    line = trim(line);

    FC = "";
    line = parse_func(line);

    if(FC!="") {
        calc_func(FC);
        COLOR (5,0);
        disp(R);
        if(sound) SOUND_PLAY(2);
        CALL(step_1f);
    } else {
        CALL(step_1m);
    }
}

function step_2() {

    line = trim(line);

    line = parse_numeric(line);
    set_ope(C);

    COLOR (4,0);
    disp(I);

    CALL(step_3);

}

function step_3() {

    calc(C);

    set_ope("");

    COLOR (1,0);
    disp(R);

    if(sound) {
        if(C=="R") {
            if(sound) SOUND_PLAY(4);
        } else {
            if(sound) SOUND_PLAY(2);
        }
    }

    CALL(step_4m);

}

function step_4m() {

    line = trim(line);

    if(to_next(line)) {
        CALL(step_5);
    } else {
        FM = "";
        line = parse_memory(line);

        if(FM!="") {
            if(calc_memory(FM)) {
                R.Copy(I);
                disp(R);
                if(sound) SOUND_PLAY(3);
                CALL(step_4m);
            } else {
                disp(R);
                if(sound) SOUND_PLAY(3);
                CALL(step_4m);
            }
        } else {
            CALL(step_4f);
        }
    }

}

function step_4f() {

    line = trim(line);

    FC = "";
    line = parse_func(line);

    if(FC!="") {
        calc_func(FC);
        COLOR (5,0);
        disp(R);
        if(sound) SOUND_PLAY(2);
        CALL(step_4f);
    } else {
        CALL(step_4m);
    }
}

function step_5() {

    line = trim(line);

    C = "";
    line = parse_command(line);

    if(line=="" || C=="=") {
        OPE = "ANS";
        CALL(result);
        if(sound) SOUND_PLAY(1);
    } else {
        if(C=="") C = "R";
        CALL(step_1m);
    }

}

function result() {

    bANS = true;

    COLOR (7,0);

    disp(R);

}

/************************************************************************/

function disp(V) {

    CLS();

    if( V.isBig()) disp_big(V,"RESULT",1);
    if(!V.isBig()) disp_small(V,"RESULT",1);

    COLOR(3,0);
    PRINTX(60,3,OPE);

}

/************************************************************************/

function disp_kanji() {

    if(!bANS) return;

    COLOR(7,0);

    bKAN = !bKAN;

    if(!bKAN) {
        disp(R);
        return;
    }

    CLS();

    disp_kan(R," 結果 ",1);

    COLOR(3,0);
    PRINTX(60,3,OPE);

}

/************************************************************************/

function calc(C) {

    if(C=="R") R.Copy(I);

    if(C=="+") R.Add(I);
    if(C=="-") R.Sub(I);
    if(C=="*") R.Mul(I);
    if(C=="/") R.Div(I);
    if(C=="%") R.Mod(I);
    if(C=="^") R.Power(I);

    if(C=="D") R.Dice(R,I);
    if(C=="P") R.SetSequence(R,I);
    if(C=="C") R.SetCombination(R,I);

}

function set_ope(C) {

    OPE = "";

    if(C=="R") OPE = "SET";
    if(C=="+") OPE = "ADD";
    if(C=="-") OPE = "SUB";
    if(C=="*") OPE = "MUL";
    if(C=="/") OPE = "DIV";
    if(C=="%") OPE = "MOD";
    if(C=="^") OPE = "POW";

    if(C=="D") OPE = "DICE";
    if(C=="P") OPE = "SEQ";
    if(C=="C") OPE = "COM";

}

/************************************************************************/

function calc_func(FC) {

    var CMD = FC;

    I.Copy(R);

    var ret = 0;

    if(CMD=="FS") { to_rad(I); ret = R.SetSin(I); }
    if(CMD=="FC") { to_rad(I); ret = R.SetCos(I); }
    if(CMD=="FT") { to_rad(I); ret = R.SetTan(I); }

    if(CMD=="FAS") { ret = R.SetAsin(I); to_deg(R); }
    if(CMD=="FAC") { ret = R.SetAcos(I); to_deg(R); }
    if(CMD=="FAT") { ret = R.SetAtan(I); to_deg(R); }

    if(CMD=="FSH") { ret = R.SetSinh(I); }
    if(CMD=="FCH") { ret = R.SetCosh(I); } 
    if(CMD=="FTH") { ret = R.SetTanh(I); }

    if(CMD=="FASH") { ret = R.SetAsinh(I); }
    if(CMD=="FACH") { ret = R.SetAcosh(I); }
    if(CMD=="FATH") { ret = R.SetAtanh(I); }

    if(CMD=="FEX") ret = R.SetExp(I);
    if(CMD=="FLG") ret = R.SetLog(I);
    if(CMD=="FLN") ret = R.SetLn(I);
    if(CMD=="FL2") ret = R.SetLog2(I);

    if(CMD=="FSQR") ret = R.Sqrt();
    if(CMD=="F2R") { I.set(2); ret = R.PowerDiv(I); }
    if(CMD=="F3R") { I.set(3); ret = R.PowerDiv(I); }
    if(CMD=="F4R") { I.set(4); ret = R.PowerDiv(I); }
    if(CMD=="F5R") { I.set(5); ret = R.PowerDiv(I); }
    if(CMD=="F6R") { I.set(6); ret = R.PowerDiv(I); }
    if(CMD=="F7R") { I.set(7); ret = R.PowerDiv(I); }
    if(CMD=="F8R") { I.set(8); ret = R.PowerDiv(I); }
    if(CMD=="F9R") { I.set(9); ret = R.PowerDiv(I); }

    if(CMD=="F!") ret = R.SetFactorial(I);
    if(CMD=="F!!") ret = R.SetDoubleFactorial(I);

    if(CMD=="FREV") {
        I.set(1);
        I.Div(R);
        R.Copy(I);
    }

    if(CMD=="FABS") ret = R.Abs();
    if(CMD=="FSIG") ret = R.Sig();

    if(CMD=="FI") ret = R.Round();
    if(CMD=="FF") ret = R.Fix();

    if(CMD=="FD") ret = R.FD();
    if(CMD=="FR") ret = R.FR();

    if(ret == floatedBigDigitERR) {
        F_ERR = true;
        if(sound) SOUND_PLAY(5);
    }

    OPE = CMD;

}

/************************************************************************/

function calc_memory(FM) {

    COLOR (6,0);

    OPE = FM;

    if(FM=="MR") {
        I.Copy(M);
        return true;
    }

    if(FM=="MC") M.clear();

    if(FM=="M+") M.Add(R);
    if(FM=="M-") M.Sub(R);
    if(FM=="M*") M.Mul(R);
    if(FM=="M/") M.Div(R);
    if(FM=="M%") M.Mod(R);
    if(FM=="M^") M.Power(R);

    return false;

}

/************************************************************************/

function to_rad(V) {
    V.Mul(PI);
    V.div(180);
}

function to_deg(V) {
    V.mul(180);
    V.Div(PI);
}

function trim(str) {

    var idx;

    for(idx=0;idx<str.length;idx++) {
        if(str[idx] == " ") continue;
        break;
    }

    str = str.substr(idx);

    return str;

}

/************************************************************************/

function to_next(str) {

    if(str.indexOf("M")==0) return false;
    if(str.indexOf("F")==0) return false;

    return true;

}

/************************************************************************/

function parse_numeric(str) {

    var valid = "1234567890";
    var next = " +-*/%^=DPCFM";
    var idx = 0;
    var ns = "";
    var pc = 0;
    var dm = 0;

    var ret;

    if(str.indexOf("PI")==0) {

        ret = I.SetPI();

        if(ret!=0) {
            F_ERR = true;
            if(sound) SOUND_PLAY(5);
        }

        return str.substr(2);

    }

    if(str.indexOf("E")==0) {

        ret = I.SetE();

        if(ret!=0) {
            F_ERR = true;
            if(sound) SOUND_PLAY(5);
        }

        return str.substr(1);

    }

    if(str.indexOf("RND")==0) {

        I.SetRnd();

        return str.substr(3);

    }

    while(idx<str.length) {
        var a = str[idx];
        if(valid.indexOf(a)>=0) {
            ns = ns + a;
        } else if(a==".") {
            ns = ns + a;
            ++pc;
        } else if(next.indexOf(a)>=0){
            --idx;
             break;
        } else {
            ++dm;
             break;
        }
        ++idx; 
    }

    if(dm>0)alert("right ???");

    if(ns!="") {
        if( pc == 0 ) setInt(ns);
        if( pc == 1 ) setSmall(ns);
        if( pc > 1   ) {
            alert("right ???");
            setInt(ns.substr(0,ns.indexOf(".")));
        }
    }

    return str.substr(idx+1);

}

/************************************************************************/

function setInt(str) {

    var valid = "0123456789";

    I.set(0);

    for(i=0;i<str.length;i++) {
        I.mul(10);
        var a = str[i];
        I.add(valid.indexOf(a));
    }

    return;

}

function setSmall(str) {

    var valid = "0123456789";

    I.set(0);
    F.set(0);

    for(i=0;i<str.length;i++) {
        var a = str[i];
        if(a==".") break;
        I.mul(10);
        I.add(valid.indexOf(a));
    }

    str = str.substr(i+1);
    for(i=str.length-1;i>=0;i--) {
        var a = str[i];
        F.div(10);
        F.add(valid.indexOf(a));
    }
    F.div(10);

    I.Add(F);

    return;

}

/************************************************************************/

function parse_command(str) {

    if(str.indexOf("PI")==0) return str;
    if(str.indexOf("E")==0) return str;

    var valid = "+-*/%^=DPC";

    var a = str[0];

    if(valid.indexOf(a)>=0) {
        C = a;
        return str.substr(1);
    }

    return str;

}

/************************************************************************/

function parse_func(str) {

    var func = "FABCDEFGHIJKLMNOPQRSTUVWXTZ!0123456789";
    var com = "+-*/%=^";

    var idx = 0;

    FC = "";

    if(str[0]!=func[0]) return str;

    while(idx<str.length) {
        var a = str[idx];
        if(com.indexOf(a)>=0) {
            --idx;
            break;
        }
        if(func.indexOf(a)>=0) {
            FC = FC + a;
        } else {
            --idx;
            break;
        }
        ++idx;
    }

    return str.substr(idx+1);

}

/************************************************************************/

function parse_memory(str) {

    var func = "M";
    var com = "+-*/%^CR";

    var idx =0;

    if(str[0]!=func[0]) return str;

    FM = "M";

    ++idx;

    while(idx<str.length) {
        var a = str[idx];
        if(com.indexOf(a)>=0) {
            FM = FM + a;
        } else {
            break;
        }
        ++idx;
    }

    return str.substr(idx+1);

}

/************************************************************************/

function copy_result() {

    document.getElementById("line").value = R.toString2();

}

/************************************************************************/

function sound_switch() {

    sound = !sound;

}

/************************************************************************/

function disp_big(V,CAP,TOP) {

    PRINTX(10,TOP+1,"***** BIG DIGIT : " + CAP + " ****");

    if(V.isMinus()) PRINTX(3,TOP+2," MINUS ");

    if(!M.isZero()) PRINTX(20,TOP+2," MEMORY ");

    if(F_ERR) PRINTX(30,TOP+2," F-ERROR !!! ");

    if(V.isOver()) {
        PRINTX(3,TOP+3,"OVER FLOW !");
        return;
    }

    var over = (V.zero_pos() >= V.size());

    if(over) return disp_exp(V,CAP,TOP);

    var small = V.valid_size() - V.zero_pos() - 1;

    if(small<0) small = 0;

    var line = Math.floor( ( V.size() + 9 )/ 10 ) - Math.floor( ( small + 9 ) / 10 ) +1 ;

    for(i=0; i<line*10; i++) {
        var n = line*10 - i -1;
        var x = n % 10;
        var y = floor(n/10);
        var v = V.value(i);
        var str = pad(v,i<V.zero_pos());
        if(i>V.zero_pos() && v == 0) str = "     ";
        str = str + ((i == 0) ? "." : "");
        PRINTX(3 + x*6,TOP+3+y, str);
    }

    if(!V.isSmall()) return;

    for(i=1; i<=small; i++) {
        var n = line*10 + i -1;
        var x = n % 10;
        var y = floor(n/10);
        var str = pad(V.value(-i),true);
        PRINTX(3 + x*6, TOP+3+y, str);
    }

}

/************************************************************************/

function disp_small(V,CAP,TOP) {
 
    PRINTX(10,TOP+1,"***** BIG DIGIT : " + CAP + " ****");

    if(V.isMinus()) PRINTX(3,TOP+2," MINUS ");

    if(!M.isZero()) PRINTX(20,TOP+2," MEMORY ");

    if(F_ERR) PRINTX(30,TOP+2," F-ERROR !!! ");

    if(V.isBig()) {
        PRINTX(3,TOP+3,"OVER FLOW !");
        return;
    }

    var over = (　V.valid_size() - V.zero_pos() > V.size() + 1);

    if(over) return disp_exp(V,CAP,TOP);

    PRINTX(3,TOP+3,pad(V.value(0),false)+ ".");

    for(i=1;i<=V.size();i++) {
        var n = i - 1;
        var x = n % 10;
        var y = floor(n/10);
　       PRINTX(10 + x*6,TOP+3+y,pad(V.value(i),true));
    }

}

/************************************************************************/

function disp_exp(V,CAP,TOP) {
 
    PRINTX(10,TOP+1,"***** BIG DIGIT : " + CAP + " ****");

    if(V.isMinus()) PRINTX(3,TOP+2," MINUS ");

    if(!M.isZero()) PRINTX(20,TOP+2," MEMORY ");

    if(F_ERR) PRINTX(30,TOP+2," F-ERROR !!! ");

    var A = new FloatedBigDigit();

    A.Copy(V);

    var order = A.order();

    if( order> 9999 || order < -9999 ) {
        PRINTX(3,TOP+3,"OVER FLOW !");
        return;
    }


    while(A.digit(0)>=10) {
        A.div(10);
        ++ order;
    }

    PRINTX(3,TOP+3,pad(A.digit(0),false)+ ".");

    PRINTX(3,TOP+4,"E" + order);

    for(i=1;i<=A.size();i++) {
        var n = i - 1;
        var x = n % 10;
        var y = floor(n/10);
       PRINTX(10 + x*6,TOP+3+y,pad(A.digit(i),true));
    }

}

/************************************************************************/

function disp_kan(V,CAP,TOP) {

    PRINTX(10,TOP+1,"***** BIG DIGIT : " + CAP + " ****");

    if(V.isMinus()) PRINTX(3,TOP+2,"－ 負 －");

    if(!M.isZero()) PRINTX(20,TOP+2," 記 憶 ");

    if(F_ERR) PRINTX(30,TOP+2," 計 算 手 違 ");

    if(V.isOver()) {
        PRINTX(3,TOP+3," 計 算 不 可 ");
        return;
    }

    D = new FloatedBigDigit();

    D.Copy(V);

    D.Abs();

    if(D.Compare(K)>=0) {
        PRINTX(3,TOP+3," 超 過 表 示 ");
        return;
    }

    var x = 28;
    var y = 5;

    var t = 0;
    var k = 0;

    do {

        var i = D.value(0) % 10;

        var ch = ["〇","一","二","三","四","五","六","七","八","九"];

        var ta = ["","万","億","兆","京","垓","秭","穣","溝","澗","正","載","極","恒","阿","那","不","無","？"];


        COLOR(4,0);
        if(k>12) COLOR(3,0);
        if(k>17) COLOR(2,0);


        if(t==0) PRINTX(3 + (x+1)*2,TOP+3+y, ta[k]);

        COLOR(7,0);

        PRINTX(3 + x*2,TOP+3+y, ch[i]);

        x -= 1;
        t += 1;

        if(t==4) {
            t = 0;
            k += 1;
            x -= 1;
            if(k>18) k =18;
        }

        if(x<0) {
            x = 28;
            y -= 1;
        }

        D.div(10);

    } while(D.compare(1)>=0);

}


/************************************************************************/

function floor(val) {
    var ret = INT(val);
    if(ret>val) --ret;
    return ret;
}

function pad(val,zero) {
    var str = "";
    for(var i= 0; i<5; i++) {
        if(val>0 || i==0 || zero) {
            str = "" + val % 10 + str;
            val = Math.floor(val / 10);
        } else {
            str = " " + str;
        }
    }
    return str;
}
