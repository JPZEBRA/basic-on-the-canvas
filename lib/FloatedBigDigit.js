/* FLOATED BIG DIGIT CLASS */
/* CREATE  2021.02.06      */
/* REVISED 2021.05.22      */
/* Ver 0.9.3               */
/* Original by K-ARAI      */


/* SETTING */
var floatedBigDigit_keta = 100;
var floatedBigDigit_K     = 5;
var floatedBigDigit_unit  = 100000;
var floatedBigDigit_order = 90000;

var floatedBigDigit_F     = 2;
var floatedBigDigit_LMT = 12000;
var floatedBigDigit_LM2 = 30000;
var floatedBigDigit_LST = 5;

var floatedBigDigitERR = -1;
var floatedBigDigitOK = 0;

var floatedBigDigitCashedE = false;
var floatedBigDigitCashE;
var floatedBigDigitCashedE_R;

var floatedBigDigitCashedPI = false;
var floatedBigDigitCashPI;
var floatedBigDigitCashedPI_R;

var floatedBigDigitCashedLB = false;
var floatedBigDigitCashLB;
var floatedBigDigitCashedLB_L = 0;


/****************************************************************************/
/****************************************************************************/

function SetFloatedBigDigitKeta(n) {

    if(!safeNumber(n)) return floatedBigDigitERR;

    var k = Math.floor(n);

    if(k<=0) return floatedBigDigitERR;

    floatedBigDigit_keta = k;

    FreeFloatedBigDigit()

    return floatedBigDigitOK;

}

/****************************************************************************/

function FreeFloatedBigDigit() {

    if(floatedBigDigitCashedE) floatedBigDigitCashE = NaN;

    floatedBigDigitCashedE = false;

    if(floatedBigDigitCashedPI) floatedBigDigitCashPI = NaN;

    floatedBigDigitCashedPI = false;

    if(floatedBigDigitCashedLB) floatedBigDigitCashLB = NaN;

    floatedBigDigitCashedLB = false;

}

/****************************************************************************/

function safeNumber(v) {
    var ret =  ( typeof v == "number");
    if(!ret) console.log("invalid value : needs number.");
    return ret;
}

/****************************************************************************/

function safeBigDigit(V) {
    var ret = ( V instanceof FloatedBigDigit);
    if(!ret) console.log("invalid value : needs big digit.");
    return ret;
}


/****************************************************************************/
/****************************************************************************/

function FloatedBigDigit() {

    this.N = Math.floor((floatedBigDigit_keta - 1)/ floatedBigDigit_K) + 1;

    this.Val = new Array(this.N + floatedBigDigit_F +1);

    this.shiftPoint = 0;

    this.small = false;

    this.minus = false;

/****************************************************************************/

    this.clear = function() {

        for(var i=0;i<=this.N+floatedBigDigit_F;i++) this.Val[i] = 0;

        this.shiftPoint = 0;

        this.small = false;

        this.minus = false;

        return floatedBigDigitOK;

    }   

/****************************************************************************/

    this.set = function(val) {

        if(!safeNumber(val)) return floatedBigDigitERR;

        this.clear();

        val = Math.floor(val);

        if(val<0) {
            this.minus = true;
            val = -val;
        }

        if(val > floatedBigDigit_unit) {
            this.overflow();
            return floatedBigDigitERR;
        }

        if(val == floatedBigDigit_unit) {
            this.Val[0] = 1;
            this.shift(+1);        
        } else {
            this.Val[0] = val;
        }

        return floatedBigDigitOK;

    }   

/****************************************************************************/

    this.Set = function (str) {

        var numstr = "0123456789";
        var readError = false;
        var valMinus = false;
        var idx = 0;
        var rdc;

        this.clear();

       //STEP 0
        if(str.length<1) return floatedBigDigitERR;
        rdc = str[idx];
        if( rdc=="+" ) { ++idx; valMinus = false; }
        if( rdc=="-" ) { ++idx; valMinus = true; }

        //STEP 1
        do {
            if(idx>=str.length) break;
            rdc = str[idx++];
            if(rdc=="." || rdc=="e" || rdc == "E" ) break;
            if(numstr.indexOf(rdc)>=0) {
                this.mul(10);
                this.add(numstr.indexOf(rdc));
            } else {
                readError = true;
            }
        } while(!readError);

        //STEP 2
        if(rdc==".") {
            var ord = 0;
            do {
                if(idx>=str.length) break;
                rdc = str[idx++];
                if(rdc=="e" || rdc == "E" ) break;
                if(numstr.indexOf(rdc)>=0) {
                    this.mul(10);
                    this.add(numstr.indexOf(rdc));
                    ++ord;
                } else {
                    readError = true;
                }
             } while(!readError);

             for(var i=0;i<ord;i++) this.div(10);
        }

        //STEP 3
        if(rdc=="e" || rdc == "E" ) {

            var odm = false;
            var odn = 0;

            if(idx<str.length) {
                rdc = str[idx];
                if(rdc== "+" ) { ++idx; odm = false; }
                if(rdc== "-" ) { ++idx; odm = true; }
            }

            do {
                if(idx>=str.length) break;
                rdc = str[idx++];
                if(numstr.indexOf(rdc)>=0) {
                    odn *= 10;
                    odn += numstr.indexOf(rdc);
                    if(odn>=floatedBigDigit_order) break;
                } else {
                    readError = true;
                }
            } while(!readError);


            if( odn >= floatedBigDigit_order ) {
                if(!odm) this.overflow();
                if( odm) this.set(0);
            } else {
                if(!odm) for(var i=0;i<odn;i++) this.mul(10);
                if( odm) for(var i=0;i<odn;i++) this.div(10);
            }

        }

        this.minus = valMinus;

        if(readError) {
            this.overflow();
            return floatedBigDigitERR;
        }

        return floatedBigDigitOK;

    }

/****************************************************************************/

    this.lastBit = function() {

        var last_bit_boost = floatedBigDigit_LST;

        if(this.isOver()) return true;

        if(this.isEmpty()) return true;

        if(!this.isSmall()) return false;

        var rf = this.minus;
        this.minus = false;

        if( floatedBigDigitCashedLB && floatedBigDigitCashedLB_L != last_bit_boost) {
            floatedBigDigitCashLB = NaN;
            floatedBigDigitCashedLB = false;
        }

        if(!floatedBigDigitCashedLB) {
            floatedBigDigitCashLB  = new FloatedBigDigit();
            floatedBigDigitCashedLB = true;
            floatedBigDigitCashedLB_L = last_bit_boost;
            floatedBigDigitCashLB.set(1);
            floatedBigDigitCashLB.shiftPoint = - ( floatedBigDigitCashLB.N + floatedBigDigit_F*last_bit_boost );
        }

        var ret = !(this.Compare(floatedBigDigitCashLB)>=0);

        this.minus = rf;

        return ret;

    }

/****************************************************************************/

    this.Copy = function(V) {

        if(!safeBigDigit(V)) return floatedBigDigitERR;

        if( this.N != V.N ) return floatedBigDigitERR;

        for(var i=0;i<=this.N+floatedBigDigit_F;i++) this.Val[i] = V.Val[i];

        this.shiftPoint = V.shiftPoint;

        this.small = V.small;
        this.minus = V.minus;

        return floatedBigDigitOK;

    }   

/****************************************************************************/

    this.size = function() {

        return this.N;

    }

/****************************************************************************/

    this.zero_pos = function() {

        if(this.isOver()) return 0;

        return this.shiftPoint;

    }

/****************************************************************************/

    this.order = function() {

        if(this.isOver()) return 0;

        return this.shiftPoint * floatedBigDigit_K;

    }

/****************************************************************************/

    this.valid_size = function() {

        if(this.isOver()) return 0;

        this.shiftMax();

        var k;

        for(k=this.N+1;k>=1;k--) if(this.Val[k-1]!=0) break;

        return k;

    }

/****************************************************************************/

    this.digit = function(idx) {

        if(!safeNumber(idx)) return 0;

        if(this.isOver()) return 0;

        idx = Math.floor(idx);

        if(idx>=0&&idx<=this.N+floatedBigDigit_F) return this.Val[idx];

        return 0;

    }

/****************************************************************************/

    this.value = function(idx) {

        if(!safeNumber(idx)) return 0;

        if(this.isOver()) return 0;

        idx = Math.floor(idx);

        if(this.isBig()) {
            return this.digit( this.shiftPoint - idx );
        } else {
            return this.digit( idx + this.shiftPoint );
        }

    }

/****************************************************************************/

    this.checkOver = function() {

        if(this.shiftPoint >=  floatedBigDigit_order / floatedBigDigit_K ) this.overflow();

        if(this.shiftPoint <  -floatedBigDigit_order / floatedBigDigit_K ) this.set(0);

        if(this.Val[0]>=floatedBigDigit_unit) this.overflow();

        return this.isOver();

    }

/****************************************************************************/

    this.overflow = function() {

        this.set(0);

        this.shiftPoint = floatedBigDigit_unit;

        return true;

    }

/****************************************************************************/

    this.isMinus = function() {

        if(this.isOver()) return false;

        return this.minus;

    }

/****************************************************************************/

    this.isSmall = function() {

        if(this.isOver()) return false;

        this.shiftMax();

        this.small = true;

        if(this.shiftPoint>=0) {
            for(var i = this.shiftPoint+1;i<=this.N+floatedBigDigit_F;i++) if(this.Val[i]!=0) return true;
            this.small = false;
            return false;
        }

        return true;

    }

/****************************************************************************/

    this.isSeed = function() {

        if(this.isOver()) return false;

        if(this.shiftPoint!=0) return false;

        return !this.isSmall();

    }

/****************************************************************************/

    this.isBig = function() {

        if(this.isOver()) return false;

        if(this.shiftPoint<=0) return false;

        return true;

    }

/****************************************************************************/


    this.isExp = function () {

    if(this.isOver()) {
        return false;
    }

    if(this.isZero()) return false;

    if(this.shiftPoint>=this.N) return true;

    if(this.valid_size()>this.shiftPoint+1) return true;

    return false;

}

/****************************************************************************/
/****************************************************************************/

    this.isOver = function() {

        if(this.shiftPoint == floatedBigDigit_unit) return true;

        return false;

    }

/****************************************************************************/

    this.isZero = function() {

        if(this.isOver()) return false;

        for(var i=0;i<=this.N;i++) if(this.Val[i]!=0) return false;

        return true;

    }

/****************************************************************************/

    this.isEmpty = function() {

        if(this.isOver()) return false;

        for(var i=0;i<=this.N+floatedBigDigit_F;i++) if(this.Val[i]!=0) return false;

        return true;

    }

/****************************************************************************/

    this.FD = function() {

        if(this.isOver()) return floatedBigDigitERR;

        if(!this.isSmall()) return floatedBigDigitOK;

        for(var i = this.N+1;i<=this.N+floatedBigDigit_F;i++) this.Val[i] = 0;

        return floatedBigDigitOK;

    }

/****************************************************************************/

    this.FR = function() {

        if(this.isOver()) return floatedBigDigitERR;

        if(!this.isSmall()) return floatedBigDigitOK;

        var CR = floatedBigDigit_unit/2;

        for(var i = this.N+1;i>=0;i--) {
            var v = this.Val[i] + CR;
            CR = Math.floor(v/floatedBigDigit_unit);
            this.Val[i] = v % floatedBigDigit_unit;
        }

        if(CR>0) {
            var C = new FloatedBigDigit();
            C.set(CR);
            C.shiftPoint = this.shiftPoint  + 1;
            if(this.isMinus()) {
                this.Sub(C);
            } else {
                this.Add(C);
            }
        }

        for(var i = this.N+1;i<=this.N+floatedBigDigit_F;i++) this.Val[i] = 0;

        return floatedBigDigitOK;

    }

/****************************************************************************/

    this.Fix = function() {

        if(this.isOver()) return floatedBigDigitERR;

        if(this.shiftPoint<0) {
            this.clear();
            return floatedBigDigitOK;
        }

        for(var i=this.shiftPoint+1; i<=this.N+floatedBigDigit_F ; i++) this.Val[i] = 0;

        this.small = false;

        return floatedBigDigitOK;

    }

/****************************************************************************/

    this.Round = function() {

        if(this.isOver()) return floatedBigDigitERR;

        if(this.shiftPoint<-1) {
            this.clear();
            return floatedBigDigitOK;
        }

        var mf = this.minus;
        this.minus = false;

        var C = new FloatedBigDigit();
        C.set(1);
        C.div(2);
        this.Add(C);        

        for(var i=this.shiftPoint+1; i<=this.N+floatedBigDigit_F ; i++) this.Val[i] = 0;

        this.small = false;
        this.minus = mf;

        return floatedBigDigitOK;

    }

/****************************************************************************/

    this.Int = function() {

        if(this.isOver()) return floatedBigDigitERR;

        if(this.shiftPoint<-1) {
            this.clear();
            return floatedBigDigitOK;
        }

        var C = new FloatedBigDigit();
        C.set(1);
        C.div(2);
        this.Sub(C);

        return this.Round();

    }

/****************************************************************************/

    this.Abs = function() {

        if(this.isOver()) return floatedBigDigitERR;

        this.minus = false;

        return floatedBigDigitOK;

    }

/****************************************************************************/

    this.Sig = function() {

        if(this.isOver()) return floatedBigDigitERR;

        this.minus = !this.minus;

        return floatedBigDigitOK;

    }

/****************************************************************************/

    this.Sqrt = function() {

        if(this.isOver()) return floatedBigDigitERR;

        if(this.isZero()) {
            this.clear();
            return floatedBigDigitOK;
        }

        if(this.isMinus()) {
            this.overflow();
            return floatedBigDigitERR;
        }

        var F = new FloatedBigDigit();

        F.set(2);
        this.PowerDiv(F);

        return floatedBigDigitOK;

    }

/****************************************************************************/

    this.shift = function(val) {

        if(this.isOver()) return floatedBigDigitERR;

        if(!safeNumber(val)) return floatedBigDigitERR;

        return this.shiftSmall(val);

    }

/****************************************************************************/

    this.shiftSmall = function(val) {

        if(this.isOver()) return floatedBigDigitERR;

        val = Math.floor(val);

        if(val==0) return floatedBigDigitOK;
        if(this.isEmpty()) return floatedBigDigitOK;
        if(this.isOver()) return floatedBigDigitERR;

        var rf = this.minus;

        if(val<0) {

            if(-val>this.N+floatedBigDigit_F) {
                this.clear();
                return floatedBigDigitOK;
            }

            var CR = (this.Val[this.N+floatedBigDigit_F+val+1]>floatedBigDigit_unit/2) ? 1: 0;

            for(var i=this.N+floatedBigDigit_F;i>=0;i--) this.Val[i] = ( (i+val>=0) ? this.Val[i+val] : 0);

            return floatedBigDigitOK;

        } else {

            if(val>this.N+floatedBigDigit_F) {
                this.overflow();
                return floatedBigDigitERR;
            }

            for(i=0;i<val;i++) {
                if(this.Val[i]>0) {
                    this.overflow();
                    return floatedBigDigitERR;
                }
            }

            for(var i=0;i<=this.N+floatedBigDigit_F;i++) {
                var v = ((i+val<=this.N+floatedBigDigit_F) ? this.Val[i+val] : 0);
                this.Val[i] = v;
            }

        }

        return floatedBigDigitOK;

    }

/****************************************************************************/

    this.shiftMax = function() {

        if(this.isOver()) return floatedBigDigitERR;

        if(this.isEmpty()) {
            this.clear();
            return 0;
        }

        var sf;

        for(sf = 0 ; sf < this.N + floatedBigDigit_F; sf++) {
            if(this.Val[sf] !=0 ) break;
        }

        this.shift(sf);

        this.shiftPoint -= sf;

        return sf;

    }

/****************************************************************************/
/****************************************************************************/

    this.mul = function(val) {

        if(!safeNumber(val)) return floatedBigDigitERR;

        if(this.isOver()) return floatedBigDigitERR;

        return this.mulSmall(val);

    }

/****************************************************************************/

    this.mulSmall = function(val) {

        val = Math.floor(val);

        if(val==0) {
            this.clear();
            return floatedBigDigitOK;
        }

        if(Math.abs(val) > floatedBigDigit_unit) {
            this.overflow();
            return floatedBigDigitERR;
        }

        var rf = this.minus;
        this.minus = false;

        if(val<0) {
            rf = !rf;
            val = - val;
        }

        if(val==1) {
            this.minus = rf;
            return floatedBigDigitOK;
        }

        var CR = 0;
        for(var i = this.N+floatedBigDigit_F;i>=0;i--) {
            var v = this.Val[i]*val + CR;
            CR = Math.floor(v/floatedBigDigit_unit);
            this.Val[i] = v - CR*floatedBigDigit_unit;
        }

        if(CR>0) {
            var B = new FloatedBigDigit();
            B.set(CR);
            B.shiftPoint = this.shiftPoint + 1;
            this.Add(B);
        }

        this.minus = rf;

        if(this.checkOver()) return floatedBigDigitERR;

        this.isSmall();

        return floatedBigDigitOK;

    }   

/****************************************************************************/
/****************************************************************************/

    this.div = function(val) {

        return this.divR(val,true);

    }

/****************************************************************************/

    this.divR = function(val,div_fast) {

        if(!safeNumber(val)) return floatedBigDigitERR;

        if(this.isOver()) return floatedBigDigitERR;

        if(div_fast) return this.divSmall(val);

        var D = new FloatedBigDigit();

        D.set(val);

        return this.DivR(D,div_fast);

    }

/****************************************************************************/

    this.divSmall = function(val) {

        val = Math.floor(val);

        if(val==0) {
            this.overflow();
            return floatedBigDigitERR;
        }

        if(Math.abs(val) > floatedBigDigit_unit) {
            this.overflow();
            return floatedBigDigitERR;
        }

        if(val<0) {
            this.minus = !this.minus;
            val = - val;
        }

        if(val==1) {
            return floatedBigDigitOK;
        }

        var CR = 0;
        for(var i = 0;i<=this.N+floatedBigDigit_F;i++) {
            var v = this.Val[i] + CR*floatedBigDigit_unit;
            this.Val[i] = Math.floor(v/val);
            CR = v - this.Val[i]*val;
        }       

        CR = (CR/val>=0.5) ? 1: 0;

        this.shiftMax();

        if(this.checkOver()) return floatedBigDigitERR;

        this.isSmall();

        return floatedBigDigitOK;

    }   

/****************************************************************************/
/****************************************************************************/

    this.add = function(val) {

        if(!safeNumber(val)) return floatedBigDigitERR;

        if(this.isOver()) return floatedBigDigitERR;

        return this.addSmall(val);

    }

/****************************************************************************/

    this.addSmall = function(val) {

        val = Math.floor(val);

        if(val==0) {
            return floatedBigDigitOK;
        }

        if(Math.abs(val) > floatedBigDigit_unit) {
            this.overflow();
            return floatedBigDigitERR;
        }

        if(val<0) {
            return this.subSmall(-val);
        }

        if(this.minus) {
            this.minus = !this.minus;
            var ret = this.subSmall(val);
            this.minus = !this.minus;
            return ret;
        }

        var B = new FloatedBigDigit();

        B.set(val);

        return this.Add(B);

    }   

/****************************************************************************/
/****************************************************************************/

    this.sub = function(val) {

        if(!safeNumber(val)) return floatedBigDigitERR;

        if(this.isOver()) return floatedBigDigitERR;

        return this.subSmall(val);

    }

/****************************************************************************/

    this.subSmall = function(val) {

        val = Math.floor(val);

        if(val==0) {
            return floatedBigDigitOK;
        }

        if(Math.abs(val) > floatedBigDigit_unit) {
            this.overflow();
            return floatedBigDigitERR;
        }

        if(val<0) {
            return this.addSmall(-val);
        }

        if(this.minus) {
            this.minus = !this.minus;
            var ret = this.addSmall(val);
            this.minus = !this.minus;
            return ret;
        }

        var B = new FloatedBigDigit();
        B.set(val);

        return this.Sub(B);

    }

/****************************************************************************/
/****************************************************************************/

    this.Add = function(V) {

        if(!safeBigDigit(V)) return floatedBigDigitERR;

        if(this.isOver()) {
            return floatedBigDigitERR;
        }

        if(V.isEmpty()) {
            return floatedBigDigitOK;
        }

        if(this.isEmpty()) {
            this.Copy(V);
            return floatedBigDigitOK;
        }

        return this.AddSmall(V);

    }

/****************************************************************************/

    this.AddSmall = function(V) {

        if(V.isMinus()) {
            V.minus = !V.minus;
            var ret = this.SubSmall(V);
            V.minus = !V.minus;
            return ret;
        }

        if(this.isMinus()) {
            this.minus = !this.minus;
            var ret = this.SubSmall(V);
            this.minus = !this.minus;
            return ret;
        }

        var A = new FloatedBigDigit();
        A.clear();

        var idx1,idx2,idx3;

        for(idx1=0;idx1<this.N+floatedBigDigit_F;idx1++) if(this.Val[idx1]!=0) break;
        for(idx2=0;idx2<V.N+floatedBigDigit_F;idx2++) if(V.Val[idx2]!=0) break;

        idx3 = (idx1<=idx2) ? idx1 : idx2;

        var sf1 = this.shiftPoint;
        var sf2 = V.shiftPoint;
        var sf3 = (sf1>=sf2) ? sf1 : sf2;

        A.shiftPoint = sf3;

        var CR = 0;

        for(var i=this.N+floatedBigDigit_F;i>=0;i--) {

            var pos1 = i + idx3 + sf1 - sf3;
            var pos2 = i + idx3 + sf2 - sf3;

            var val = CR;

            val += this.digit(pos1);
            val += V.digit(pos2);

            if ( val >= floatedBigDigit_unit) {
                CR = 1;
                val -= floatedBigDigit_unit;
            } else {
                CR = 0;
            }

            A.Val[i] = val;

        }

        this.Copy(A);

        if(CR>0) {
            A.set(CR);
            A.shiftPoint = this.shiftPoint + 1;
            this.Add(A);
        }

        if(this.checkOver()) return floatedBigDigitERR;

        this.isSmall();

        return floatedBigDigitOK;

    }

/****************************************************************************/
/****************************************************************************/

    this.Sub = function(V) {

        if(!safeBigDigit(V)) return floatedBigDigitERR;

        if(this.isOver()) {
            return floatedBigDigitERR;
        }

        if(V.isEmpty()) {
            return floatedBigDigitOK;
        }

        if(this.isEmpty()) {
            this.Copy(V);
            this.minus = !this.minus;
            return floatedBigDigitOK;
        }

        return this.SubSmall(V);

    }

/****************************************************************************/

    this.SubSmall = function(V) {

        if(V.isMinus()) {
            V.minus = !V.minus;
            var ret = this.AddSmall(V);
            V.minus = !V.minus;
            return ret;
        }

        if(this.isMinus()) {
            this.minus = !this.minus;
            var ret = this.AddSmall(V);
            this.minus = !this.minus;
            return ret;
        }

        if(this.Compare(V)<0) {
            var C = new FloatedBigDigit();
            C.Copy(this);
            this.Copy(V);
            var ret = this.SubSmall(C);
            this.minus = true;
            this.isSmall();
            return ret;
        }


        var A = new FloatedBigDigit();
        A.clear();

        var idx1,idx2,idx3;
        for(idx1=0;idx1<this.N+floatedBigDigit_F;idx1++) if(this.Val[idx1]!=0) break;
        for(idx2=0;idx2<V.N+floatedBigDigit_F;idx2++) if(V.Val[idx2]!=0) break;

        idx3 = (idx1<=idx2) ? idx1 : idx2;

        var sf1 = this.shiftPoint;
        var sf2 = V.shiftPoint;

        var sf3 = (sf1>=sf2) ? sf1 : sf2;

        A.shiftPoint = sf3;

        var CR = 0;

        for(var i=this.N+floatedBigDigit_F;i>=0;i--) {

            var pos1 = i + idx3 + sf1 - sf3;
            var pos2 = i + idx3 + sf2 - sf3;

            var val = - CR;

            val += this.digit(pos1);
            val -= V.digit(pos2);

            if ( val < 0 ) {
                CR = 1;
                val += floatedBigDigit_unit;
            } else {
                CR = 0;
            }

            A.Val[i] = val;
 
       }

        this.Copy(A);

        if(CR>0) {
            A.set(CR);
            A.shiftPoint = this.shiftPoint + 1;
            this.Add(A);
        }

        if(this.checkOver()) return floatedBigDigitERR;

        this.isSmall();

        return floatedBigDigitOK;

    }

/****************************************************************************/
/****************************************************************************/

    this.Mul = function(V) {

        if(!safeBigDigit(V)) return floatedBigDigitERR;

        if(this.isOver()) {
            return floatedBigDigitERR;
        }

        if(this.isEmpty() || V.isEmpty()) {
            this.set(0);
            return floatedBigDigitOK;
        }

        if(V.isSeed()) {
            var val = V.Val[0];
            if(V.isMinus()) val = -val;
            return this.mul(val);
        }

        return this.MulSmall(V);

    }

/****************************************************************************/

    this.MulSmall = function(V) {

        var R = new FloatedBigDigit();
        var C = new FloatedBigDigit();
        var B = new FloatedBigDigit();

        var rf = ( this.minus != V.minus );
        this.minus = false;

        this.shiftMax();

        B.Copy(V);
        B.shiftMax();

        var sf1 = this.shiftPoint;
        var sf2 = B.shiftPoint;

        R.clear();
        for(i=0;i<=this.N+floatedBigDigit_F;i++) {

            C.Copy(this);
            C.mul(B.Val[i]);
            C.shiftPoint -= i;

            if(R.isEmpty()) {
                R.Copy(C);
            } else {
                R.Add(C);
            }

        }

        R.minus = rf;

        R.shiftPoint += sf2;

        this.Copy(R);

        if(this.checkOver()) return floatedBigDigitERR;

        this.isSmall();

        return floatedBigDigitOK;

    }

/****************************************************************************/
/****************************************************************************/

    this.Div = function(V) {

        return this.DivR(V,true);

    }

/****************************************************************************/

    this.DivR = function(V,div_fast) {

        if(!safeBigDigit(V)) return floatedBigDigitERR;

        if(this.isOver()) {
            return floatedBigDigitERR;
        }

        if(V.isEmpty()) {
            this.overflow();
            return floatedBigDigitERR;
        }

        if(this.isEmpty()) {
            return floatedBigDigitOK;
        }

        if(div_fast && V.isSeed()) {
            var val = V.Val[0];
            if(V.isMinus()) val = -val;
            return this.div(val);
        }

        return this.DivSmall(V);

    }

/****************************************************************************/

    this.DivSmall = function(V) {

        var C = new FloatedBigDigit();
        var R = new FloatedBigDigit();
        var A = new FloatedBigDigit();
        var B = new FloatedBigDigit();

        var rf = !(this.minus == V.minus);
        this.minus = false;

        C.Copy(V);
        C.minus = false;

        // 桁位置調整大
        this.shiftMax();
        C.shiftMax();
        var sf1 = this.shiftPoint;
        var sf2 = C.shiftPoint;

        var sfd = sf2 - sf1;
        this.shiftPoint += sfd;

        var idx1,idx2;

        // 桁位置調整小
        for(idx1=1;idx1<10000;idx1*=10) {
            if(this.Val[0]*idx1>=10000) break;
        }
        for(idx2=1;idx2<10000;idx2*=10) {
            if(C.Val[0]*idx2>=10000) break;
        }

        this.mul(idx1);
        C.mul(idx2);

        A.set(0);
        B.set(1);

        var f,s,n;

        do {

            if(this.Compare(C)>=0) {

                this.shiftMax();

                s = this.shiftPoint - C.shiftPoint;

                if(this.Compare(C)==0) {

                    f = 1;

                } else {

                    f = this.Val[0]*floatedBigDigit_unit + this.Val[1];
                    f /= (C.Val[0]*floatedBigDigit_unit + C.Val[1]);
                    f = Math.floor(f);
                
                    if(f<=1) {
                        f = this.Val[0]*floatedBigDigit_unit + this.Val[1];
                        f /= C.Val[0];
                        f = Math.floor(f);
                        if( f > floatedBigDigit_unit ) f = floatedBigDigit_unit;
                        s -= 1;
                    }
                }

                R.Copy(C);
                R.mul(f);
                R.shiftPoint += s;
                this.Sub(R);

                while(this.isMinus()) {
                    R.Copy(this);
                    this.Copy(C);
                    this.shiftPoint += s;
                    this.Add(R);
                    --f;
                }

                R.Copy(B);
                R.mul(f);
                R.shiftPoint += s;
                A.Add(R);

            }

            this.shiftPoint += 1;
            B.shiftPoint -= 1;

        } while(!this.isEmpty() && !B.lastBit());

        A.shiftPoint -= sfd;

        A.shiftMax();
        A.mul(idx2);
        A.div(idx1);

        A.minus = rf;

        this.Copy(A);

        if(this.checkOver()) return floatedBigDigitERR;

        this.isSmall();

        return floatedBigDigitOK;

    }

/****************************************************************************/
/****************************************************************************/

    this.compare = function(val) {

        if(!safeNumber(val)) return 0;

        if(this.isOver()) 0;

        var C = new FloatedBigDigit();

        C.set(val);

        return this.Compare(C);

   }

/****************************************************************************/

    this.Compare = function(V) {

        if(!safeBigDigit(V)) return 0;

        if(this.isOver()) return 0;

        if(V.isOver()) return 0;

        var GT = +1;
        var LT =  -1;
        var EQ =  0;
        var RV =  1;

        if( this.isMinus() && !V.isMinus()) return LT;
        if(!this.isMinus() &&  V.isMinus()) return GT;
        if( this.isMinus() &&  V.isMinus()) RV = -1;

        sf = V.shiftPoint - this.shiftPoint;

        if( sf >= 0 ) {

            for(var i = 0;i<=this.N+floatedBigDigit_F;i++) {

                if(this.digit(i-sf)>V.digit(i)) return GT*RV;
                if(this.digit(i-sf)<V.digit(i)) return LT*RV;

            }

        } else {

            for(var i = 0;i<=this.N+floatedBigDigit_F;i++) {

                if(this.digit(i)>V.digit(i+sf)) return GT*RV;
                if(this.digit(i)<V.digit(i+sf)) return LT*RV;

            }

        }

        return EQ;

    }

/****************************************************************************/
/****************************************************************************/

    this.toString = function() {

        var str = " ";

        if (this.isMinus()) str = "-";

        str = str + this.unitSpStr(0) + ".";

        for(var i=1;i<=this.N;i++) str = str + " " + this.unitStr(i);

        str = str + " E " + this.order();

        return str;

    }

/****************************************************************************/

    this.toString2 = function() {

        var str = "";

        str = str + this.unitSpStr(0) + ".";

        for(var i=1;i<=this.N;i++) str = str + this.unitStr(i);

        str = str + "e" + this.order();

        var trim;

        for(trim=0;trim<str.length;trim++) if(str[trim]!=" ") break;

        str = str.substr(trim);

        if (this.isMinus()) str = "-" + str;

        return str;

    }

/****************************************************************************/

    this.footString = function() {

        var str;

            str = "[";

            for(var i=this.N+1;i<=this.N+floatedBigDigit_F;i++) str = str + " " + this.unitStr(i);

            str = str + "]";

        return str;

    }

/****************************************************************************/

    this.toValue = function () {

        var ret = 0.0;
        var width = 10;

        if(this.isOver()) {
            return Infinity;
        }

        if(width>this.N) width = this.N; 

        for(var i=0;i<=width;i++) {
            ret *= floatedBigDigit_unit;
            ret += this.Val[i];
        }

        var ord = this.order();

        ord -= width*floatedBigDigit_K;

        if(ord>0) {
            for(var j=1;j<=ord;j++) ret *= 10;
        }

        if(ord<0) {
            for(var j=-1;j>=ord;j--) ret /= 10;
        }

        if(this.isMinus()) {
            ret = - ret;
        }

        return ret;

    }

/****************************************************************************/

    this.unitStr = function (idx) {

        if(!safeNumber(idx)) return "*****";

        if(this.isOver()) return "*****";

        return this.unitVal(this.digit(idx),"0");

    } 

/****************************************************************************/

    this.unitSpStr = function (idx) {

        if(!safeNumber(idx)) return "*****";

        if(this.isOver()) return "*****";

        if(this.small) {
            if(idx==0) return this.unitVal(this.digit(idx)," ");
            return this.unitVal(this.digit(idx),"0");
        }

        var max;

        for(max=this.N-1;max>0;--max) if(this.Val[max]!=0) break;

        if(idx>max) return "     ";


        if(idx==max) return this.unitVal(this.digit(idx)," ");


        return this.unitVal(this.digit(idx),"0");

    } 

/****************************************************************************/

    this.unitVal = function (val,sp) {

        if(!safeNumber(val)) return "*****";

        if(this.isOver()) return "*****";

        var str = "";
        var d;

        for(var i=1;i<=floatedBigDigit_K; i++) {
            d = val % 10;
            if(i==1 || val>0) {
                str = d + str;
            } else {
                str = sp + str;
            }
            val = Math.floor(val/10);
        }

        return str;

    }

/****************************************************************************/
/****************************************************************************/

    this.dice1 = function (n) {

        this.clear();

        if(!safeNumber(n)) return floatedBigDigitERR;

        n = Math.floor(n);

        if(n<=0) {
            this.set(0);
            return floatedBigDigitERR;
        }

        this.SetRnd();

        this.mul(n);
        this.add(1);
        this.Fix();

        if(this.isExp()) return floatedBigDigitERR;

        return floatedBigDigitOK;

    }

/****************************************************************************/

    this.dice = function (a,b) {

        this.clear();

        var n,k;

        if(!safeNumber(a)) return floatedBigDigitERR;

        if( typeof b == "number") {
            k = a;
            n = b;
        } else {
            k = 1;
            n = a;
        }

        n = Math.floor(n);

        if(k<=0) return floatedBigDigitERR;

        var D = new FloatedBigDigit();

        for(var i=1;i<=k;i++) {
            D.dice1(n);
            this.Add(D);
        }

        if(this.isExp()) return floatedBigDigitERR;

        return floatedBigDigitOK;

    }

/****************************************************************************/

    this.Dice = function (A,B) {

        var n,k;

        var a = 0;
        var b = 0;

        if(!safeBigDigit(A)) return floatedBigDigitERR;

        if(A.isOver()) return floatedBigDigitERR;

        if(A.isSeed()&&!A.isMinus()) a = A.Val[0];

        if( B instanceof FloatedBigDigit) {
            if(B.isOver()) return floatedBigDigitERR;
            if(B.isSeed()&&!B.isMinus()) b = B.Val[0];
            k = a;
            n = b;
        } else {
            k = 1;
            n = a;
        }

        return this.dice(k,n);

    }

/****************************************************************************/

    this.mod = function (n) {

        if(!safeNumber(n)) return floatedBigDigitERR;

        n = Math.floor(n);

        if(n==0) {
            this.overflow();
            return floatedBigDigitERR;
        }

        var C = new FloatedBigDigit();

        C.set(n);

        return this.Mod(C);

    }

/****************************************************************************/

    this.Mod = function (V) {

        if(!safeBigDigit(V)) return floatedBigDigitERR;

        if(this.isOver()) return floatedBigDigitERR;

        if(V.isOver()) return floatedBigDigitERR;

        if(V.isZero()) {
            this.overflow();
            return floatedBigDigitERR;
        }

        var A = new FloatedBigDigit();

        var C = new FloatedBigDigit();

        A.Copy(this);

        C.Copy(this);

        C.Div(V);

        C.Int();

        C.Mul(V);

        A.Sub(C);

        this.Copy(A);

        A.Abs();

        C.Copy(V);

        C.Abs();

        if(A.Compare(C)>=0) this.overflow();

        if(this.isOver()) return floatedBigDigitERR;

        return floatedBigDigitOK;

    }

/****************************************************************************/

    this.power = function (n) {

        if(!safeNumber(n)) return floatedBigDigitERR;

        if(this.isOver()) return floatedBigDigitERR;

        n = Math.floor(n);

        if(n==0) {
            this.set(1);
            return floatedBigDigitOK;
        }

        var C = new FloatedBigDigit();

        C.set(n);

        return this.Power(C);

    }

/****************************************************************************/

    this.Power = function (V) {

        if(!safeBigDigit(V)) return floatedBigDigitERR;

        if(this.isOver()) return floatedBigDigitERR;

        if(V.isOver()) return floatedBigDigitERR;

        if(this.isMinus() && V.isSmall()) {
            this.overflow();
            return floatedBigDigitERR;
        } 

        var A = new FloatedBigDigit();

        var F = new FloatedBigDigit();

        F.Copy(V);

        F.Abs();

        var conv = (this.isSmall() || F.compare(1000)>0);

        F.set(1);

        if(this.isMinus()) {

            this.Sig();

            A.Copy(V);
            A.Abs();
            A.mod(2);

            if(A.compare(0)>0) F.Sig();

        }

        if(conv) {

            A.SetLog(this);

            A.Mul(V);

            this.set(10);

        } else {

            A.Copy(V);

        }

        var ret = this.Power_main(A,true);

        this.Mul(F);

        return ret;

    }

/****************************************************************************/

    this.Power_main = function (V,boost) {

        if(!safeBigDigit(V)) return floatedBigDigitERR;

        if(this.isEmpty()) {
            return floatedBigDigitOK;
        }

        if(V.isZero()) {
            this.set(1);
            return floatedBigDigitOK;
        }

        // LOGIC MINUS
        if(V.isMinus()) {

            var R = new FloatedBigDigit();
            var C = new FloatedBigDigit();

            C.Copy(V);
            C.minus = false;

            R.Copy(this);
            R.Power(C);

            if(R.isOver()) {
                this.set(0);
            } else {
                this.set(1);
                this.Div(R);
            }

            return floatedBigDigitOK;

        }

        // LOGIC REAL
        if( V.isSmall() && this.isMinus()) {
            this.overflow();
            return floatedBigDigitERR;
        }

        var RI = new FloatedBigDigit();
        var RF = new FloatedBigDigit();
        var I = new FloatedBigDigit();
        var F = new FloatedBigDigit();
        var A = new FloatedBigDigit();

        I.Copy(V);
        I.Fix();

        F.Copy(V);
        F.Sub(I);

        // INTEGER PART
        RI.Copy(this);
        RI.Power_int(I);

        if(RI.isOver()) {
             this.overflow();
             return floatedBigDigitERR;
        }

        // SMALL CHECK
        A.set(1);
        A.Div(F);
        A.FR();

        if(A.isOver()) A.set(0);
        if(A.isSmall()) A.set(0);
        if(A.compare(100)>0) A.set(0);


        if( boost && V.isSmall() && !A.isZero() ) {

            // LOGIG FOR 1/M
            RF.Copy(this);
            RF.PowerDiv(A);

        } else {

            // LOGIC FOR REAL
            A.SetLn(this);
            F.Mul(A);

            RF.SetExp(F);

        }

        // MERGE RESULT
        this.Copy(RI);
        this.Mul(RF);

        if(this.isOver()) return floatedBigDigitERR;

        return floatedBigDigitOK;

    }

/****************************************************************************/

    this.Power_int = function (V) {

        // LOGIC INTEGER

        var B = new FloatedBigDigit();
        var C = new FloatedBigDigit();

        B.Copy(this);
        C.Copy(V);
        C.minus = false;

        this.set(1);
        while(C.compare(1)>=0) {
            this.Mul(B);
            if(this.isOver()) break;
            C.sub(1);
        }

        if(V.isMinus()) {
            if(this.isOver()) {
                this.set(0);
            } else {
                B.Copy(this);
                this.set(1);
                this.Div(B);
            }
        }

        if(this.isOver()) return floatedBigDigitERR;

        return floatedBigDigitOK;

    }

/****************************************************************************/

    this.PowerDiv = function(V) {

        if(!safeBigDigit(V)) return floatedBigDigitERR;

        if(this.isOver()) return floatedBigDigitERR;

        if(V.isOver()) return floatedBigDigitERR;

        if(this.isZero()) {
            this.clear();
            return floatedBigDigitOK;
        }

        if(this.isMinus()) {
            this.overflow();
            return floatedBigDigitERR;
        }

        if(V.isSmall()) {
            this.overflow();
            return floatedBigDigitERR;
        }

        var F = new FloatedBigDigit();
        var A = new FloatedBigDigit();

        A.set(1);

        var p;

        do {

           p = this.PowerDiv_boost(V);
           if(p<=1) break;

           F.set(p);
           F.Power_main(V,false);

           this.Div(F);
           A.mul(p);

        } while (p>1);

        F.set(1);
        F.Div(V);
        this.Power_main(F,false);
        this.Mul(A);

        return floatedBigDigitOK;

    }

/****************************************************************************/

    this.PowerDiv_boost = function(V) {

        if(!safeBigDigit(V)) return -1;

        if(this.isSmall()) return -1;

        var R = new FloatedBigDigit();
        var F = new FloatedBigDigit();
        var I = new FloatedBigDigit();

        I.set(2);

        do {
            R.Copy(I);
            R.Power(V);
            if(this.Compare(R)<0) return -1;
            F.Copy(this);
            F.Div(R);
            if(!F.isSmall()) break;
            I.add(1);
        } while(I.compare(10000)<0);

        return I.Val[0];

    }

/****************************************************************************/
/****************************************************************************/

    this.setFactorial = function (n) {

        if(!safeNumber(n)) return floatedBigDigitERR;

        n = Math.floor(n);

        if(n<0) return floatedBigDigitERR;

        var C = new FloatedBigDigit();
        C.set(n);

        return this.SetFactorial(C);

    }

/****************************************************************************/

    this.SetFactorial = function (V) {

        if(!safeBigDigit(V)) return floatedBigDigitERR;

        if(V.isOver()) return floatedBigDigitERR;

        if(V.isMinus()) return floatedBigDigitERR;
        if(V.isSmall()) return floatedBigDigitERR;

        if(V.isZero()) {
            this.set(1);
            return floatedBigDigitOK;
        }

        var R = new FloatedBigDigit();
        var C = new FloatedBigDigit();

        R.set(1);
        C.Copy(V);
        while(C.compare(1)>0) {
            R.Mul(C);
            C.sub(1);
        }

        this.Copy(R);

        if(this.checkOver()) return floatedBigDigitERR;

        if(this.isExp()) return floatedBigDigitERR;

        return floatedBigDigitOK;

    }

/****************************************************************************/
/****************************************************************************/

    this.setDoubleFactorial = function (n) {

        if(!safeNumber(n)) return floatedBigDigitERR;

        n = Math.floor(n);

        if(n<0) return floatedBigDigitERR;

        var C = new FloatedBigDigit();
        C.set(n);

        if(this.checkOver()) return floatedBigDigitERR;

        return this.SetDoubleFactorial(C);

    }

/****************************************************************************/

    this.SetDoubleFactorial = function (V) {

        if(!safeBigDigit(V)) return floatedBigDigitERR;

        if(V.isOver()) return floatedBigDigitERR;

        if(V.isMinus()) return floatedBigDigitERR;
        if(V.isSmall()) return floatedBigDigitERR;

        if(V.isZero()) {
            this.set(1);
            return floatedBigDigitOK;
        }

        var R = new FloatedBigDigit();
        var C = new FloatedBigDigit();

        R.set(1);
        C.Copy(V);
        while(C.compare(1)>0) {
            R.Mul(C);
            C.sub(2);
        }

        this.Copy(R);

        if(this.checkOver()) return floatedBigDigitERR;

        if(this.isExp()) return floatedBigDigitERR;

        return floatedBigDigitOK;

    }

/****************************************************************************/
/****************************************************************************/

    this.setSequence = function (n,k) {

        if(!safeNumber(n)) return floatedBigDigitERR;
        if(!safeNumber(k)) return floatedBigDigitERR;

        n = Math.floor(n);
        k = Math.floor(k);

        if(n<0) return floatedBigDigitERR;
        if(k<0) return floatedBigDigitERR;

        var N = new FloatedBigDigit();
        N.set(n);

        var K = new FloatedBigDigit();
        K.set(k);

        return this.SetSequence(N,K);

    }

/****************************************************************************/

    this.SetSequence = function (N,K) {

        if(!safeBigDigit(N)) return floatedBigDigitERR;
        if(!safeBigDigit(K)) return floatedBigDigitERR;

        if(N.isOver()) return floatedBigDigitERR;
        if(K.isOver()) return floatedBigDigitERR;

        if(N.isMinus()) return floatedBigDigitERR;
        if(N.isSmall()) return floatedBigDigitERR;
        if(K.isMinus()) return floatedBigDigitERR;
        if(K.isSmall()) return floatedBigDigitERR;

        if(N.isZero()) {
            this.set(0);
            return floatedBigDigitOK;
        }

        if(K.isZero()) {
            this.set(1);
            return floatedBigDigitOK;
        }

        if(K.Compare(N)>0) {
            this.set(0);
            return floatedBigDigitOK;
       }

        var R = new FloatedBigDigit();
        var C = new FloatedBigDigit();
        var A = new FloatedBigDigit();

        A.Copy(N);
        A.Sub(K);

        R.set(1);
        C.Copy(N);

        while(C.Compare(A)>0) {
            R.Mul(C);
            C.sub(1);
        }

        this.Copy(R);

        if(this.checkOver()) return floatedBigDigitERR;

        if(this.isExp()) return floatedBigDigitERR;

        return floatedBigDigitOK;

    }

/****************************************************************************/
/****************************************************************************/

    this.setCombination = function (n,k) {

        if(!safeNumber(n)) return floatedBigDigitERR;
        if(!safeNumber(k)) return floatedBigDigitERR;

        n = Math.floor(n);
        k = Math.floor(k);

        if(n<0) return floatedBigDigitERR;
        if(k<0) return floatedBigDigitERR;

        var N = new FloatedBigDigit();
        N.set(n);

        var K = new FloatedBigDigit();
        K.set(k);

        return this.SetCombination(N,K);

    }

/****************************************************************************/

    this.SetCombination = function (N,K) {

        if(!safeBigDigit(N)) return floatedBigDigitERR;
        if(!safeBigDigit(K)) return floatedBigDigitERR;

        if(N.isOver()) return floatedBigDigitERR;
        if(K.isOver()) return floatedBigDigitERR;

        if(N.isMinus()) return floatedBigDigitERR;
        if(N.isSmall()) return floatedBigDigitERR;
        if(K.isMinus()) return floatedBigDigitERR;
        if(K.isSmall()) return floatedBigDigitERR;

        if(N.isZero()) {
            this.set(0);
            return floatedBigDigitOK;
        }

        if(K.isZero()) {
            this.set(1);
            return floatedBigDigitOK;
        }

        if(K.Compare(N)>0) {
            this.set(0);
            return floatedBigDigitOK;
        }

        var R = new FloatedBigDigit();
        var B = new FloatedBigDigit();
        var C = new FloatedBigDigit();

       B.Copy(N);
       B.Sub(K);
       B.add(1);
       C.set(1);

       R.set(1);

       do {
           R.Mul(B);
           R.Div(C);
           B.add(1);
           C.add(1);
       } while(C.Compare(K)<=0);

        this.Copy(R);

        if(this.checkOver()) return floatedBigDigitERR;

        if(this.isExp()) return floatedBigDigitERR;

        return floatedBigDigitOK;

    }

/****************************************************************************/
/****************************************************************************/

    this.SetE = function () {

        if(floatedBigDigitCashedE && floatedBigDigitCashE.N == this.N) {
            this.Copy(floatedBigDigitCashE);        
            return floatedBigDigitCashedE_R;
        }

        var C = new FloatedBigDigit();

        C.set(1);
        this.set(1);
        do{
            this.Div(C);
            C.add(1);
        } while(C.compare(floatedBigDigit_LM2) < 0 && !this.lastBit());

        var stop = ( C.compare(floatedBigDigit_LM2)>=0 );

        this.set(1);
        while(C.compare(1)>0) {
            this.Div(C);
            this.add(1);
            C.sub(1);
        }
        this.add(1);

        floatedBigDigitCashE =  new FloatedBigDigit();
        floatedBigDigitCashE.Copy(this);
        floatedBigDigitCashedE = true;
        floatedBigDigitCashedE_R = (stop ? floatedBigDigitERR : floatedBigDigitOK );

        if(stop) return floatedBigDigitERR;

        return floatedBigDigitOK;

    }

/****************************************************************************/

    this.SetPI = function () {

        if(floatedBigDigitCashedPI && floatedBigDigitCashPI.N == this.N) {

            this.Copy(floatedBigDigitCashPI);        

            return floatedBigDigitCashedPI_R;

        }

        var C = new FloatedBigDigit();
        var ret = C.setAtan2(1,5);
        C.mul(16);
        this.Copy(C);
        C.setAtan2(1,239);
        C.mul(4);
        this.Sub(C);

        floatedBigDigitCashPI =  new FloatedBigDigit();
        floatedBigDigitCashPI.Copy(this);
        floatedBigDigitCashedPI = true;
        floatedBigDigitCashedPI_R = ret;

        return ret;

    }

/****************************************************************************/

    this.SetRnd = function () {

        this.clear();

        this.small = true;

        for(i=1;i<=this.N;i++) this.Val[i] = Math.floor(Math.random()*floatedBigDigit_unit);

        return floatedBigDigitOK;

    }

/****************************************************************************/
/****************************************************************************/

    this.SetExp = function (V) {

        if(!safeBigDigit(V)) return floatedBigDigitERR;

        if(V.isOver()) return floatedBigDigitERR;

        var R = new FloatedBigDigit();
        var C = new FloatedBigDigit();

        if(V.isMinus()) {

            C.Copy(V);
            C.minus = false;

            R.SetExp(C);

            if(R.checkOver()) {
                return floatedBigDigitERR;
            }

            this.set(1);
            return this.Div(R);

        }

        if(V.compare(0)==0) {
            this.set(1);
            return floatedBigDigitOK;
        }

        if(V.compare(1)==0) {
            this.SetE();
            return floatedBigDigitOK;
        }

        if(V.compare(1)>0) {

            var RI = new FloatedBigDigit();
            var RF = new FloatedBigDigit();

            var I = new FloatedBigDigit();
            var F = new FloatedBigDigit();

            I.Copy(V);
            I.Fix();

            F.Copy(V);
            F.Sub(I);

            RI.SetE();
            RI.Power(I);

            RF.SetExp(F);

            this.Copy(RI);
            this.Mul(RF);
           
            return floatedBigDigitOK;

        }


        C.set(1);
        this.set(1);
        do{
            this.Div(C);
            C.add(1);
        } while(C.compare(floatedBigDigit_LMT) < 0 && !this.lastBit());

        var stop = ( C.compare(floatedBigDigit_LMT)>=0 );

        this.set(1);
        while(C.compare(1)>0) {
            this.Mul(V);
            this.Div(C);
            this.add(1);
            C.sub(1);
        }
        this.Mul(V);
        this.add(1);

        if(this.checkOver()) return floatedBigDigitERR;

        if(stop) return floatedBigDigitERR;

        return floatedBigDigitOK;

    }

/****************************************************************************/
/****************************************************************************/

    this.SetLn = function (V) {

        if(!safeBigDigit(V)) return floatedBigDigitERR;

        if(V.isOver()) return floatedBigDigitERR;

        if(V.compare(0) <= 0) {
            return floatedBigDigitERR;
        }

        if(V.compare(1) == 0) {
            this.set(0);
            return floatedBigDigitOK;
        }

        if( V.compare(0) > 0 && V.compare(1) < 0 ) {
            var C = new FloatedBigDigit();
            C.set(1);
            C.Div(V);

            var ret = this.SetLn(C);
            if(!this.isOver()) this.minus = true;
            return ret;
        }

        var F = new FloatedBigDigit();

        F.Copy(V);
        F.mul(100);

        if( F.compare(1000) > 0 ) {
            F.set(2);
        } else if ( F.compare(185)>0) {
            F.set(125);
            F.div(100);
        } else {
            F.Copy(V);
        }

        if( V.Compare(F) > 0 ) {

            var B = new FloatedBigDigit();
            B.SetLn(F);

            var C = new FloatedBigDigit();
            C.Copy(V);

            this.set(0);
            while(C.Compare(F) > 0) {
                C.Div(F);
                this.Add(B);
            }
            var ret = B.SetLn(C);
            this.Add(B);

            return ret;

        }

        F.Copy(V);
        F.sub(1);

        var C = new FloatedBigDigit();
        C.set(1);

        this.set(1);
        do{
            C.add(1);
            this.Mul(F);
        } while(C.compare(floatedBigDigit_LM2) < 0 && !this.lastBit());

        var stop = ( C.compare(floatedBigDigit_LM2)>=0 );

        this.set(1);
        while(C.compare(1)>0) {
            this.Mul(F);
            C.sub(1);
            this.Mul(C);
            C.add(1);
            this.Div(C);
            C.sub(1);
            this.sub(1);
            this.minus = false;
        }

        this.Mul(F);

        if(stop) return floatedBigDigitERR;

        return floatedBigDigitOK;

    }

/****************************************************************************/

    this.SetLog = function (V) {

        if(!safeBigDigit(V)) return floatedBigDigitERR;

        if(V.isOver()) return floatedBigDigitERR;

        if(V.compare(0) <= 0) {
            return floatedBigDigitERR;
        }

        if(V.compare(1) == 0) {
            this.set(0);
            return floatedBigDigitOK;
        }

        var ret = this.SetLn(V);

        var T = new FloatedBigDigit();
        var F = new FloatedBigDigit();

        T.set(10);
        F.SetLn(T);

        this.Div(F);

        return ret;

    }

/****************************************************************************/

    this.SetLog2 = function (V) {

        if(!safeBigDigit(V)) return floatedBigDigitERR;

        if(V.isOver()) return floatedBigDigitERR;

        if(V.compare(0) <= 0) {
            return floatedBigDigitERR;
        }

        if(V.compare(1) == 0) {
            this.set(0);
            return floatedBigDigitOK;
        }

        var ret = this.SetLn(V);

        var T = new FloatedBigDigit();
        var F = new FloatedBigDigit();

        T.set(2);
        F.SetLn(T);

        this.Div(F);

        return ret;

    }

/****************************************************************************/
/****************************************************************************/

    this.SetSin = function (V) {

        if(!safeBigDigit(V)) return floatedBigDigitERR;

        if(V.isOver()) return floatedBigDigitERR;

        var P = new FloatedBigDigit();
        P.SetPI();

        var P2 = new FloatedBigDigit();
        P2.SetPI();
        P2.mul(2);

        var F = new FloatedBigDigit();
        F.Copy(V);
        var rf = F.isMinus();
        F.minus = false;

        if(F.Compare(P2)>=0) {
            F.Mod(P2);
        }

        if(F.Compare(P)>=0) {
            F.Sub(P);
            F.Sub(P);
        }
        if(F.isMinus()) rf = !rf;
        F.minus = false;

        P.div(2);
        if(F.Compare(P)>=0) {
            F.Sub(P);
            F.Sub(P);
            F.minus = false;
        }
        P.div(2);
        if(F.Compare(P)>0) {
            F.Sub(P);
            F.Sub(P);
            F.minus = false;
            this.SetCos(F);
            this.minus = rf;
            return floatedBigDigitOK;
        }

        if(F.isEmpty()) {
            this.set(0);
            return floatedBigDigitOK;
        }

        var C = new FloatedBigDigit();
        C.set(1);
        this.set(1);

        do{
            this.Mul(F);
            this.Mul(F);
            C.add(1);
            this.Div(C);
            C.add(1);
            this.Div(C);
        } while(C.compare(floatedBigDigit_LM2) < 0 && !this.lastBit());

        var stop = ( C.compare(floatedBigDigit_LM2)>=0 );

        this.set(1);
        while(C.compare(1)>0) {
            this.Mul(F);
            this.Mul(F);
            this.Div(C);
            C.sub(1);
            this.Div(C);
            C.sub(1);
            this.sub(1);
            this.minus = false;
        }
        this.Mul(F);

        this.minus = rf;

        if(stop) return floatedBigDigitERR;

        return floatedBigDigitOK;

    }

/****************************************************************************/

    this.SetCos = function (V) {

        if(!safeBigDigit(V)) return floatedBigDigitERR;

        if(V.isOver()) return floatedBigDigitERR;

        var P = new FloatedBigDigit();
        P.SetPI();

        var P2 = new FloatedBigDigit();
        P2.SetPI();
        P2.mul(2);

        var F = new FloatedBigDigit();
        F.Copy(V);
        var rf = false;
        F.minus = false;


        if(F.Compare(P2)>=0) {
            F.Mod(P2);
        }
        if(F.Compare(P)>=0) {
            F.Sub(P);
            F.Sub(P);
        }
        F.minus = false;

        P.div(2);
        if(F.Compare(P)>=0) {
            rf = true;
            F.Sub(P);
            F.Sub(P);
            F.minus = false;
        }
        P.div(2);
        if(F.Compare(P)>0) {
            F.Sub(P);
            F.Sub(P);
            F.minus = false;
            var ret = this.SetSin(F);
            this.minus = rf;
            return ret;
        }

        if(F.isEmpty()) {
            this.set(1);
            return floatedBigDigitOK;
        }

        var C = new FloatedBigDigit();

        this.set(1);
        C.set(2);
        this.Div(C);
        do{
            this.Mul(F);
            this.Mul(F);
            C.add(1);
            this.Div(C);
            C.add(1);
            this.Div(C);
        } while(C.compare(floatedBigDigit_LM2) < 0 && !this.lastBit());

        var stop = ( C.compare(floatedBigDigit_LM2)>=0 );

        this.set(1);
        while(C.compare(2)>=0) {
            this.Mul(F);
            this.Mul(F);
            this.Div(C);
            C.sub(1);
            this.Div(C);
            C.sub(1);
            this.sub(1);
            this.minus = false;
        }

        this.minus = rf;

        if(stop) return floatedBigDigitERR;

        return floatedBigDigitOK;

    }

/****************************************************************************/

    this.SetTan = function (V) {

        if(!safeBigDigit(V)) return floatedBigDigitERR;

        if(V.isOver()) return floatedBigDigitERR;

        var C = new FloatedBigDigit();

        this.SetSin(V);

        C.SetCos(V);

        this.Div(C);

        if(this.checkOver()) return floatedBigDigitERR;

        return floatedBigDigitOK;

    }

/****************************************************************************/
/****************************************************************************/

    this.SetAsin = function (V) {

        if(!safeBigDigit(V)) return floatedBigDigitERR;

        if(V.isOver()) return floatedBigDigitERR;

        var F = new FloatedBigDigit();
        F.Copy(V);

        var rf = F.minus;
        F.minus = false;

        if(F.compare(1)>0) {
            this.overflow();
            return floatedBigDigitERR;
        }

        if(F.compare(1)==0) {
            this.SetPI();
            this.div(2);
            this.minus = rf;
            return floatedBigDigitOK;
        }

        var C = new FloatedBigDigit();

        C.set(1);

        this.Copy(F);
        while(C.compare(floatedBigDigit_LM2) < 0 && !this.lastBit()) {
            this.Mul(F);
            this.Mul(F);
            C.add(1);
            C.add(1);
        }

        var stop = ( C.compare(floatedBigDigit_LM2)>=0 );

        if(stop) return this.SetAsin_boost(V);

        this.set(1);
        while(C.compare(1)>=0) {

            this.Mul(F);

            this.Mul(C);
            C.add(1);
            this.Div(C);
            C.sub(1);

            this.Mul(F);
            this.Mul(C);
            C.add(2);
            this.Div(C);
            C.sub(4);

            this.add(1);

        }

        this.Mul(F);

        this.minus = rf;

        return floatedBigDigitOK;

    }


/****************************************************************************/

    this.SetAsin_boost = function (V) {

        var F = new FloatedBigDigit();
        var A = new FloatedBigDigit();
        var B = new FloatedBigDigit();

        F.Copy(V);

        A.Copy(V);
        A.Mul(V);
        A.sub(1);
        A.Sig();

        B.set(2);
        A.PowerDiv(B);
        A.add(1);

        F.Div(A);

        var ret = this.SetAtan(F);
        this.mul(2);

        return ret;

    }

/****************************************************************************/

    this.SetAcos = function (V) {

        if(!safeBigDigit(V)) return floatedBigDigitERR;

        if(V.isOver()) return floatedBigDigitERR;

        var F = new FloatedBigDigit();
        F.Copy(V);

        var rf = F.minus;
        F.minus = false;

        if(F.compare(1)>0) {
            this.overflow();
            return floatedBigDigitERR;
        }

        if(F.compare(1)==0) {
            if(rf) {
                this.SetPI();
            } else {
                this.set(0);
            }
            return floatedBigDigitOK;
        }

        var ret = this.SetAsin(F);

        F.SetPI();
        F.div(2);

        this.Sub(F);
        this.minus = false;

        if(rf) {
            F.SetPI();
            F.Sub(this);
            this.Copy(F);
        }

        if(ret == floatedBigDigitERR) return floatedBigDigitERR;

        return floatedBigDigitOK;

    }

/****************************************************************************/
/****************************************************************************/

    this.SetSinh = function (V) {

        if(!safeBigDigit(V)) return floatedBigDigitERR;

        if(V.isOver()) return floatedBigDigitERR;

        if(V.isEmpty()) {
            this.set(0);
            return floatedBigDigitOK;
        }

        var F = new FloatedBigDigit();
        var C = new FloatedBigDigit();

        F.Copy(V);
        var rf = F.minus;
        F.minus = false;

        this.Copy(F);

        C.set(1);
        do{
            this.Mul(F);
            C.add(1);
            this.Div(C);
            this.Mul(F);
            C.add(1);
            this.Div(C);
        } while(C.compare(floatedBigDigit_LM2) < 0 && !this.lastBit());

        if(this.isOver() || this.compare(1)>0) {
            return this.SetSinhB(V);
        }

        var stop = ( C.compare(floatedBigDigit_LM2)>=0 );


        this.set(1);
        while(C.compare(1)>0) {

            this.Mul(F);
            this.Div(C);
            C.sub(1);
            this.Mul(F);
            this.Div(C);
            C.sub(1);

            this.add(1);

        }

        this.Mul(F);

        this.minus = rf;

        if(this.checkOver()) return floatedBigDigitERR;

        if(stop) return floatedBigDigitERR;

        return floatedBigDigitOK;

    }

/****************************************************************************/

    this.SetSinhB = function (V) {

        if(V.isOver()) {
            this.overflow();
            return floatedBigDigitERR;
        }

        var F = new FloatedBigDigit();

        F.Copy(V);

        var rf = F.minus;
        F.minus = false;

        var A = new FloatedBigDigit();
        var B = new FloatedBigDigit();

        A.SetExp(F);

        B.set(1);
        B.Div(A);

        this.Copy(A);
        this.Sub(B);
        this.div(2);

        if(!this.isOver()) this.minus = rf;

        if(this.isOver())return floatedBigDigitERR;

        return floatedBigDigitOK;

    }

/****************************************************************************/

    this.SetCosh = function (V) {

        if(!safeBigDigit(V)) return floatedBigDigitERR;

        if(V.isOver()) return floatedBigDigitERR;

        if(V.isEmpty()) {
            this.set(1);
            return floatedBigDigitOK;
        }

        var C = new FloatedBigDigit();

        this.Copy(V);
        this.minus = false;

        C.set(0);

        do{
            this.Mul(V);
            C.add(1);
            this.Div(C);
            this.Mul(V);
            C.add(1);
            this.Div(C);
        } while(C.compare(floatedBigDigit_LM2) < 0 && !this.lastBit());

        if(this.isOver() || this.compare(1)>0) {
            return this.SetCoshB(V);
        }

        var stop = ( C.compare(floatedBigDigit_LM2)>=0 );

        this.set(1);
        while(C.compare(1)>0) {

            this.Mul(V);
            this.Div(C);
            C.sub(1);
            this.Mul(V);
            this.Div(C);
            C.sub(1);

            this.add(1);

        }

        if(this.isOver()) return floatedBigDigitERR;

        if(this.checkOver()) return floatedBigDigitERR;

        if(stop) return floatedBigDigitERR;

        return floatedBigDigitOK;

    }

/****************************************************************************/

    this.SetCoshB = function (V) {

        if(V.isOver()) {
            this.overflow();
            return floatedBigDigitERR;
        }

        var F = new FloatedBigDigit();

        F.Copy(V);

        F.minus = false;

        var A = new FloatedBigDigit();
        var B = new FloatedBigDigit();

        A.SetExp(F);

        B.set(1);
        B.Div(A);

        this.Copy(A);
        this.Add(B);
        this.div(2);

        if(this.isOver())return floatedBigDigitERR;

        return floatedBigDigitOK;

    }

/****************************************************************************/

    this.SetTanh = function (V) {

        if(!safeBigDigit(V)) return floatedBigDigitERR;

        if(V.isOver()) return floatedBigDigitERR;

        var C = new FloatedBigDigit();

        this.SetSinh(V);

        C.SetCosh(V);

        this.Div(C);

        return floatedBigDigitOK;

    }

/****************************************************************************/
/****************************************************************************/

    this.SetAsinh = function (V) {

        if(!safeBigDigit(V)) return floatedBigDigitERR;

        if(V.isOver()) return floatedBigDigitERR;

        var C = new FloatedBigDigit();
        C.set(1);
        this.Copy(V);
        this.minus = false;

        if(this.compare(1)>=0) {
            return this.SetAsinhR(V);
        }

        do{
            this.Mul(V);
            this.Mul(V);
            C.add(2);
        } while(C.compare(floatedBigDigit_LM2) < 0 && !this.lastBit());

        var stop = ( C.compare(floatedBigDigit_LM2)>=0 );

        if(stop) return this.SetAsinhB(V);

        this.set(1);
        while(C.compare(1)>=0) {

            this.Mul(C);
            C.add(1);
            this.Mul(V);
            this.Div(C);
            C.sub(1);
            this.Mul(C);
            C.add(2);
            this.Mul(V);
            this.Div(C);
            C.sub(4);

            this.sub(1);
            this.minus = false;

        }

        this.Mul(V);

        if(this.checkOver()) return floatedBigDigitERR;

        return floatedBigDigitOK;

    }

/****************************************************************************/

    this.SetAsinhR = function (V) {


        if(!safeBigDigit(V)) return floatedBigDigitERR;

        if(V.isOver()) return floatedBigDigitERR;

        var F = new FloatedBigDigit();
        F.set(1);
        F.Div(V);
        F.Abs();

        var rf = V.isMinus();

        if(F.compare(1)>0) {
            this.overflow();
            return floatedBigDigitERR;
        }

        var C = new FloatedBigDigit();
        C.set(0);
        this.set(1);

        do{
            this.Mul(F);
            this.Mul(F);
            C.add(2);
        } while(C.compare(floatedBigDigit_LM2) < 0 && !this.lastBit());

        var stop = ( C.compare(floatedBigDigit_LM2)>=0 );

        if(stop) return this.SetAsinhB(V);

        this.set(1);
        while(C.compare(4)>=0) {

            this.Mul(F);

            C.sub(1);
            this.Mul(C);
            C.add(1);
            this.Div(C);

            this.Mul(F);
          
            C.sub(2);
            this.Mul(C);
            C.add(2);
            this.Div(C);

            C.sub(2);

            this.sub(1);

            this.minus = false;

        }

        this.Mul(F);
        this.Mul(F);
        this.div(4);

        var B = new FloatedBigDigit();

        B.Copy(V);
        B.Abs();
        C.SetLn(B);
        this.Add(C);

        B.set(2);
        C.SetLn(B);
        this.Add(C);

        this.minus = rf;

        if(this.checkOver()) return floatedBigDigitERR;

        return floatedBigDigitOK;

    }

/****************************************************************************/

    this.SetAsinhB = function (V) {

        if(V.isOver()) {
            this.overflow();
            return floatedBigDigitERR;
        }

        var F = new FloatedBigDigit();
        var A = new FloatedBigDigit();
        var B = new FloatedBigDigit();

        F.Copy(V);
        F.Mul(V);

        A.Copy(F);
        A.add(1);

        B.set(2);

        A.PowerDiv(B);
        A.add(1);

        F.Div(A);

        B.Copy(V);
        B.minus = false;

        if(F.isOver()) F.Copy(B);

        F.add(1);
        F.Add(B);

        this.SetLn(F);

        if(this.isOver()) return floatedBigDigitERR;

        if(V.isMinus()) this.minus = true;

        return floatedBigDigitOK;

    }

/****************************************************************************/

    this.SetAcosh = function (V) {

        if(!safeBigDigit(V)) return floatedBigDigitERR;

        if(V.isOver()) return floatedBigDigitERR;

        if(V.isMinus()) {
            this.overflow();
            return floatedBigDigitERR;
        }

        if(V.compare(1)==0) {
            this.set(0);
            return floatedBigDigitOK;
        }

        var F = new FloatedBigDigit();
        F.set(1);
        F.Div(V);
        F.Abs();

        if(F.compare(1)>=0) {
            this.overflow();
            return floatedBigDigitERR;
        }

        var C = new FloatedBigDigit();
        C.set(0);
        this.set(1);

        do{
            this.Mul(F);
            this.Mul(F);
            C.add(2);
        } while(C.compare(floatedBigDigit_LM2) < 0 && !this.lastBit());

        var stop = ( C.compare(floatedBigDigit_LM2)>=0 );

        if(stop) return this.SetAcoshB(V);

        this.set(1);
        while(C.compare(4)>=0) {

            this.Mul(F);

            C.sub(1);
            this.Mul(C);
            C.add(1);
            this.Div(C);

            this.Mul(F);
          
            C.sub(2);
            this.Mul(C);
            C.add(2);
            this.Div(C);

            C.sub(2);

            this.add(1);

        }

        this.Mul(F);
        this.Mul(F);
        this.div(4);

        var B = new FloatedBigDigit();

        B.Copy(V);
        C.SetLn(B);

        B.set(2);
        F.SetLn(B);
        C.Add(F);

        C.Sub(this);

        this.Copy(C);

        if(this.checkOver()) return floatedBigDigitERR;

        return floatedBigDigitOK;

    }

/****************************************************************************/

    this.SetAcoshB = function (V) {

        if(V.isOver()) {
            this.overflow();
            return floatedBigDigitERR;
        }

        if(V.isMinus()) {
            this.overflow();
            return floatedBigDigitERR;
        }

        if(V.compare(1)==0) {
            this.set(0);
            return floatedBigDigitOK;
        }

        var A = new FloatedBigDigit();
        var B = new FloatedBigDigit();

        A.Copy(V);
        A.Mul(V);
        A.sub(1);

        B.set(2);
        A.PowerDiv(B);

        if(A.isOver()) A.Copy(V);

        A.Add(V);

        this.SetLn(A);

        if(this.isOver()) return floatedBigDigitERR;

        return floatedBigDigitOK;

    }

/****************************************************************************/

    this.SetAtanh = function (V) {

        if(!safeBigDigit(V)) return floatedBigDigitERR;

        if(V.isOver()) return floatedBigDigitERR;

        var C = new FloatedBigDigit();
        C.set(1);
        this.Copy(V);
        this.minus = false;

        if(this.compare(1)>=0) {
            this.overflow();
            return floatedBigDigitERR;
        }


        do{
            this.Mul(V);
            this.Mul(V);
            C.add(2);
        } while(C.compare(floatedBigDigit_LM2) < 0 && !this.lastBit());

        var stop = ( C.compare(floatedBigDigit_LM2)>=0 );

        if(stop) return this.SetAtanhB(V);

        this.set(1);
        while(C.compare(1)>=0) {

            this.Mul(V);
            this.Mul(V);

            this.Mul(C);
            C.add(2);
            this.Div(C);
            C.sub(4);

            this.add(1);

        }

        this.Mul(V);

        if(this.checkOver()) return floatedBigDigitERR;

        return floatedBigDigitOK;

    }

/****************************************************************************/

    this.SetAtanhB = function (V) {

        if(!safeBigDigit(V)) return floatedBigDigitERR;


        if(V.isOver()) {
            this.overflow();
            return floatedBigDigitERR;
        }


        var F = new FloatedBigDigit();

        F.Copy(V);

        var rf = F.minus;
        F.minus = false;

        if(F.compare(1)>=0) {
            this.overflow();
            return floatedBigDigitERR;
        }

        var A = new FloatedBigDigit();
        var B = new FloatedBigDigit();

        A.set(1);
        A.Add(F);
        B.set(1);
        B.Sub(F);

        A.Div(B);

        this.SetLn(A);
        this.div(2);

        if(!this.isOver()) this.minus = rf;

        if(this.isOver())return floatedBigDigitERR;

        return floatedBigDigitOK;

    }

/****************************************************************************/
/****************************************************************************/

    this.setAtan2 = function (y,x) {

        if(!safeNumber(y)) return floatedBigDigitERR;
        if(!safeNumber(x)) return floatedBigDigitERR;

        if(y == 0) {
            if(x>=0) {
                this.set(0);
            } else {
                this.SetPI();
            }
            return floatedBigDigitOK;
        }

        if(x == 0) {
            this.SetPI();
            if(y>=0) {
                this.div( 2);
            } else {
                this.div(-2);
            }
            return floatedBigDigitOK;
        }

        if(Math.floor(y) == y && x % y == 0) {
             var d = x/y;
             return this.setAtanDiv(d);
        }

        var C = new FloatedBigDigit();
        C.set(y);
        C.div(x);

        var ret = this.SetAtan(C);

        if(x>0) return ret;

        var P = new FloatedBigDigit();
        P.SetPI();

        if(y>0) this.Add(P);
        if(y<0) this.Sub(P); 

        return ret;

    }

/****************************************************************************/

    this.SetAtan2 = function (Y,X) {

        if(!safeBigDigit(Y)) return floatedBigDigitERR;
        if(!safeBigDigit(X)) return floatedBigDigitERR;

        if(Y.isOver()) return floatedBigDigitERR;
        if(X.isOver()) return floatedBigDigitERR;

        if(Y.isEmpty()) {
            if(X.compare(0)>=0) {
                this.set(0);
            } else {
                this.SetPI();
            }
            return floatedBigDigitOK;
        }

        if(X.isEmpty()) {
            this.SetPI();
            if(Y.compare(0)>=0) {
                this.div( 2);
            } else {
                this.div(-2);
            }
            return floatedBigDigitOK;
        }

        if(!Y.isSmall()) {
            var C = new FloatedBigDigit();
            C.Copy(X);
            C.Div(Y);
            if(!C.isSmall() && C.isSeed()) return this.setAtanDiv(C.digit(0));
        }

        var C = new FloatedBigDigit();
        C.Copy(Y);
        C.Div(X);

        var ret = this.SetAtan(C);

        if(X.compare(0)>0) return ret;

        var P = new FloatedBigDigit();
        P.SetPI();

        if(Y.compare(0)>0) this.Add(P);
        if(Y.compare(0)<0) this.Sub(P); 

        return ret;


    }

/****************************************************************************/

    this.SetAtan = function (V) {

        if(!safeBigDigit(V)) return floatedBigDigitERR;

        if(V.isOver()) return floatedBigDigitERR;

        if(V.compare(0)==0) {
            this.set(0);
            return floatedBigDigitOK;
        }

        var C = new FloatedBigDigit();

        if(V.isMinus()) {
            C.Copy(V);
            C.minus = false;
            var ret = this.SetAtan(C);
            this.minus = true;
            return ret;
        }

        var P = new FloatedBigDigit();
        P.SetPI();
        P.div(2);

        if(V.compare(1)==0) {
            P.div(2);
            this.Copy(P);
            return floatedBigDigitOK;
        }

        if(V.compare(1)>0) {
            C.set(1);
            C.Div(V);
            var ret = this.SetAtan(C);
            this.Sub(P);
            this.minus = false;
            return ret;
        }

        var rf = V.isMinus();
        V.minus = false;

        P.set(0);
        C.Copy(V);
        do {
            C.Mul(V);        
            C.Mul(V);
            P.add(1);
        } while(P.compare(floatedBigDigit_LMT) < 0 && !C.lastBit());

        var stop = ( P.compare(floatedBigDigit_LMT)>=0 );

        if(stop) {
            V.minus = rf;
            return this.SetAtan_boost(V);
        }

        this.set(1);
        while(P.compare(1)>=0) {

            C.Copy(P);
            C.mul(2);
            C.sub(1);
            this.Mul(C);

            this.Mul(V);
            this.Mul(V);

            C.Copy(P);
            C.mul(2);
            C.add(1);
            this.Div(C);

            this.sub(1);
            this.minus = false;

            P.sub(1);
        }
        this.Mul(V);
        this.minus = rf;
        V.minus = rf;

        return floatedBigDigitOK;

    }

/****************************************************************************/

    this.SetAtan_boost = function (V) {

        var F = new FloatedBigDigit();
        var A = new FloatedBigDigit();
        var B = new FloatedBigDigit();

        F.Copy(V);

        A.Copy(V);
        A.Mul(V);
        A.add(1);

        B.set(2);
        A.PowerDiv(B);
        A.add(1);

        F.Div(A);

        var ret = this.SetAtan(F);
        this.mul(2);

        return ret;

    }

/****************************************************************************/

    this.setAtanDiv = function (d) {

        if(!safeNumber(d)) return floatedBigDigitERR;

        d = Math.floor(d);

        if(d == 0) {

            this.overflow();

            return floatedBigDigitERR;

        }

        var rf = (d<0);
        if(d<0) d = -d;

        if(d == 1) {

            this.SetPI();
            this.div(4);
            this.minus = rf;

            return floatedBigDigitOK;

        }

        var C = new FloatedBigDigit();
        var P = new FloatedBigDigit();

        P.set(1);
        this.set(1);
        do {
            P.add(1);
            this.div(d);
            this.div(d);
        } while(P.compare(floatedBigDigit_LM2) < 0 && !this.lastBit());

        var stop = ( P.compare(floatedBigDigit_LM2)>=0 );

        this.set(1);
        while(P.compare(1)>=0) {
            C.Copy(P);
            C.mul(2);
            C.sub(1);
            this.Mul(C);

            C.Copy(P);
            C.mul(2);
            C.add(1);
            this.Div(C);

            this.div(d);
            this.div(d);

            this.sub(1);
            this.minus = false;

            P.sub(1);
        }

        this.div(d);
        this.minus = rf;

        if(stop) return floatedBigDigitERR;

        return floatedBigDigitOK;

    }

/****************************************************************************/

}

