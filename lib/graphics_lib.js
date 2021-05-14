/* BASIC ON THE CANVAS                     */
/* The Graphic Library on JavaScript       */
/* Drawing on the Browser like a BASIC     */
/* Version 0.024 / Revised 2021.03.04      */
/* Original Author : K-ARAI                */
/* It will be free for Educational use !   */

/* initialize of screen */
window.onload = function() { gplib_init(); }

/* DEBUG LOGGING LEVEL */
var gplib_debug_level = 1;

/* ID&NAME SETTING OF CANVAS AND INPUTS */
var gplib_canvas_id = "canvas01";

var gplib_input_label = "input_labels";
var gplib_input_name = "input_values";
var gplib_input_button = "input_button";
var gplib_input_type = "numeric";

/* INNER SETTINGS */

/* canvas */
var gplib_ready = false;
var gplib_canvas;
var gplib_ctx;
var gplib_imageData;

/* call back */
var gplib_call_back;
var gplib_call_back_time = 100;
var gplib_call_back_counter = 0;
var gplib_call_back_counter_max = 10000;
var gplib_call_back_timer = 0;
var gplib_call_back_function;

/* call back - input */
var gplib_input_call_back;
var gplib_wait_input;

/* graphics size */
var gplib_width = 640;
var gplib_height = 480;

/* character mapping */
var gplib_div_width = 0;
var gplib_div_height = 0;

/* color setting */
var gplib_color_text;
var gplib_color_line;
var gplib_color_alpha;

/* character location */
var gplib_cursor_x;
var gplib_cursor_y;

/* graphics location */
var gplib_g_cursor_x;
var gplib_g_cursor_y;

/* font setting */
var gplib_text_font;
var gplib_text_size;

/* font mapping */
var gplib_text_height;
var gplib_text_width;

/* font additional */
var gplib_text_ascent;
var gplib_text_descent;

/* font decoration */
var gplib_text_bold;
var gplib_text_italic;

/* pen */
var gplib_pen_size = 1.0;

/* inner functions */

/* initialize */
function gplib_init() {
    if(gplib_debug_level>0) console.log("gplib - session start ");
    gplib_set_canvas();
    if(gplib_call_back_time>=10) {
        gplib_call_back = setInterval(gplib_call_back_func,gplib_call_back_time);
        gplib_call_back_function = gplib_no_operation;
        if(gplib_debug_level>0) console.log("gplib - thread call back start ");
    }
    MAIN();
    return;
}

/* set canvas */
function gplib_set_canvas() {
    if(gplib_canvas_id == null) return;
    if(gplib_canvas_id.length < 1) return;
    gplib_canvas = document.getElementById(gplib_canvas_id);
    if(gplib_canvas == null) {
        if(gplib_debug_level>0) console.warn("gplib - can't get canvas : " + gplib_canvas_id);
        return;
    }
    gplib_ctx = gplib_canvas.getContext('2d');
    if(gplib_ctx == null) {
        if(gplib_debug_level>0) console.warn("gplib - can't get context ");
        return;
    }
    gplib_ready = true;
    if(gplib_debug_level>0) console.log("gplib - init canvas : " + gplib_canvas_id);
    RESIZE(640,480);
    ALPHA(1.0);
    COLOR(7,0);
    FONT("Courier",16);
    CSIZE(16,0,0);
    PSIZE(1.0);
    LOCATE(0,0);
    MOVE_TO(0,0);
    CLS();
    return;
}

/* query canvas is ready ? */
function gplib_canvas_ready() {
    return gplib_ready;
}

/* NOP */
function gplib_no_operation() {
    return;
}

/* CALL BACK OPERATION */
function gplib_call_back_func() {
    ++gplib_call_back_counter;
    if(gplib_call_back_timer>0) {
        if(gplib_call_back_counter>=gplib_call_back_timer) {
            gplib_call_back_function();
            gplib_stack_thread();
        }
    }
    gplilb_call_back_counter_safety();
    return;
}

/* COUNTER SAFETY */
function gplilb_call_back_counter_safety() {
    if(gplib_call_back_counter < gplib_call_back_counter_max) return;
    gplib_call_back_counter -= gplib_call_back_counter_max;
    if(gplib_call_back_timer > 0) {
        gplib_call_back_timer -= gplib_call_back_counter_max;
        if(gplib_call_back_timer <= 0) gplib_call_back_timer = 1;
    }
    return;
}

function gplib_end() {
    clearInterval(gplib_call_back);
    gplib_call_back_func = gplib_no_operation;
    if(gplib_debug_level>0) console.log("gplib - thread call back stop ");
    return;
}

/* CALL STACK */

var gplib_call_stack_speed = 1;
var gplib_call_stack_size = 1000;
var gplib_call_stack_func = new Array(gplib_call_stack_size);
var gplib_call_stack_wait = new Array(gplib_call_stack_size);
var gplib_call_stack_pos = -1;

function gplib_stack_call(func) {
    if(gplib_call_stack_pos>=gplib_call_stack_size-1) return;
    ++gplib_call_stack_pos;
    if(gplib_call_stack_pos < 0) gplib_call_stack_pos = 0;
    if(gplib_call_stack_pos==0) gplib_call_back_timer = 1;
    gplib_call_stack_func[gplib_call_stack_pos] = func;
    gplib_call_stack_wait[gplib_call_stack_pos] = gplib_call_stack_speed;
}

function gplib_stack_thread() {
    if(gplib_call_stack_pos>=0) {
        if(gplib_call_stack_pos>=gplib_call_stack_size) gplib_call_stack_pos = gplib_call_stack_size -1;
        WAIT(gplib_call_stack_wait[0],gplib_call_stack_func[0]);
        for(i=0;i<gplib_call_stack_pos;i++) {
            gplib_call_stack_func[i] = gplib_call_stack_func[i+1];
            gplib_call_stack_wait[i] = gplib_call_stack_wait[i+1];
        }
        --gplib_call_stack_pos;
        return;
    }
    gplib_call_back_timer = 0;
}

/* SET COLOR */
function gplib_color_code(num) {
    num = gplib_int_value(num);
    if(num == 0 ) return gplib_rgba_code(0,0,0);
    if(num == 1 ) return gplib_rgba_code(0,0,255);
    if(num == 2 ) return gplib_rgba_code(255,0,0);
    if(num == 3 ) return gplib_rgba_code(255,0,255);
    if(num == 4 ) return gplib_rgba_code(0,255,0);
    if(num == 5 ) return gplib_rgba_code(0,255,255);
    if(num == 6 ) return gplib_rgba_code(255,255,0);
    if(num == 7 ) return gplib_rgba_code(255,255,255);
    return num; // direct code is possible !
}

function gplib_rgba_code(red,green,blue) {
    return "rgba(" + red + "," + green + "," + blue + "," + gplib_color_alpha + ")";
}

function gplib_int_value(num) {
    if(num == 0 ) return 0;
    if(Math.floor(num)>0) return Math.floor(num);
    return num;
}

/* SET FONT */
function gplib_set_font() {
    if(!gplib_canvas_ready()) return;
    var font = "";
    if(gplib_text_italic) font = font + "italic ";
    if(gplib_text_bold) font = font + "bold ";
    font = font + gplib_text_size + "px '" + gplib_text_font + "'";
    gplib_ctx.font = font;
    /* 暫定実装 */
    var ascent = Math.floor(gplib_text_size/8);
    var descent = Math.floor(gplib_text_size/6);
    gplib_text_height = gplib_text_size + ascent + descent;
    gplib_text_width = gplib_text_size;
    gplib_text_ascent = gplib_text_size + ascent;
    gplib_text_descent = 0 + descent;

    return;
}

function gplib_rev_y(y) {
    return gplib_height - y;
}

function gplib_oval(x1,y1,r,st,ed,ratio,pizza) {
    if(!gplib_canvas_ready()) return;
    var i,x,y;
    var step = 0.1;
    if(st>ed) {
        var tmp = st;
        st = ed;
        ed = tmp;
    }
    gplib_ctx.beginPath();
    if(pizza) gplib_ctx.moveTo(x1,y1);
    x = r*COS(st);
    y = -r*SIN(st)*ratio;
    if(pizza) {
        gplib_ctx.lineTo(x1+x,y1+y);
    } else {
        gplib_ctx.moveTo(x1+x,y1+y);
    }
    for(i=st+step;i<=ed-step;i = i+step) {
        x = r*COS(i);
        y = -r*SIN(i)*ratio;
        gplib_ctx.lineTo(x1+x,y1+y);
    }
    x = r*COS(ed);
    y = -r*SIN(ed)*ratio;
    gplib_ctx.lineTo(x1+x,y1+y);
    if(pizza) {
        gplib_ctx.lineTo(x1,y1);
    }
    return;
}

function gplib_poly(x1,y1,r,gap,st,ed,ratio) {
    if(!gplib_canvas_ready()) return;
    var i,x,y;
    x = r*COS(st);
    y = -r*SIN(st)*ratio;
    gplib_ctx.beginPath();
    gplib_ctx.moveTo(x1+x,y1+y);
    for(i=st+gap;i<=ed;i+=gap) {
        x = r*COS(i);
        y = -r*SIN(i)*ratio;
        gplib_ctx.lineTo(x1+x,y1+y);
    }
    return;
}

/* INPUT CONTROL */

function gplib_enable_input(enable) {
    var i,array;
    array = document.getElementsByName(gplib_input_name);
    for(i=0;i<array.length;i++) array[i].enabled = enable;
    document.getElementById(gplib_input_button).enabled = enable;
    return;
}

function gplib_input_caption(captions) {
    var i,array;
    array = document.getElementsByName(gplib_input_label);
    for(i=0;i<array.length;i++) {
         array[i].textContent = captions[i];
    }
    array = document.getElementsByName(gplib_input_name);
    for(i=0;i<array.length;i++) {
         array[i].value = "";
    }
    return;
}    

function gplib_query_input(captions) {
    gplib_wait_input = true;
    gplib_input_caption(captions);
    document.getElementById(gplib_input_button).value = "ENTER";
    document.getElementById(gplib_input_button).onclick = gplib_accept_input;
    gplib_enable_input(true);
    if(gplib_debug_level>0) console.log("gplib - wait input ");
    return;
}

function gplib_accept_input() {
    var array = document.getElementsByName(gplib_input_name);
    var values = new Array(array.length);
    for(i=0;i<array.length;i++) {
         if(gplib_input_type == "numeric") values[i] = parseFloat(array[i].value);
         if(gplib_input_type == "text") values[i] = array[i].value;
    }
    gplib_input_call_back(values);
    if(gplib_debug_level>0) console.log("gplib - accept input ");
    return;
}

function gplib_clear_input() {
    var array;
    array = document.getElementsByName(gplib_input_label);
    for(i=0;i<array.length;i++) {
         array[i].textContent = "*";
    }
    array = document.getElementsByName(gplib_input_name);
    for(i=0;i<array.length;i++) {
         array[i].value = "";
    }
    document.getElementById(gplib_input_button).value = " ---";
    document.getElementById(gplib_input_button).onclick = gplib_no_operation;
    gplib_enable_input(false);
    gplib_input_call_back = gplib_no_operation;
    gplib_wait_input = false;
    if(gplib_debug_level>0) console.log("gplib - clear input ");
    return;
}

/* GRAHIC DATA ACCESS */

function gplib_get_color(x,y,true_color) {
    if(!gplib_canvas_ready()) return;
    if(x<0||x>=gplib_width) return -1;
    if(y<0||y>=gplib_height) return -1;
    var imageData = gplib_ctx.getImageData(x,y,1,1);
    var pos = 0;
    var val_r =imageData.data[pos++];
    var val_g =imageData.data[pos++];
    var val_b =imageData.data[pos++];
    if(!true_color) {
        var max = 0;
        max = (val_r > val_g) ? val_r : val_g;
        max = (val_b > max ) ? val_b : max;
        if(max < 64) return 0;
        val_r = val_r / max;
        val_g = val_g / max;
        val_b = val_b / max;
        val_r = (val_r >= 0.8) ? 2 : 0;
        val_g = (val_g >= 0.8) ? 4 : 0;
        val_b = (val_b >= 0.8) ? 1 : 0;
        return (val_r + val_g + val_b);
    }
    return "rgb(" + val_r + "," + val_g + "," + val_b +  ")";
}

function gplib_buffer_image() {
    if(!gplib_canvas_ready()) return;
    gplib_imageData = gplib_ctx.getImageData(0,0,gplib_width,gplib_height);
    return;
}

function gplib_check_color(x,y) {
    if(x<0||x>=gplib_width) return -1;
    if(y<0||y>=gplib_height) return -1;
    var pos = 4*(gplib_width*y+x);
    var val_r = gplib_imageData.data[pos++];
    var val_g = gplib_imageData.data[pos++];
    var val_b =gplib_imageData.data[pos++];
    val_r = (val_r >= 100) ? 2 : 0;
    val_g = (val_g >= 100) ? 4 : 0;
    val_b = (val_b >= 100) ? 1 : 0;
    return (val_r + val_g + val_b);
}

/* PAINT - TRIAL CODE !!! */

function gplib_paint(x0,y0,border) {
    if(!gplib_canvas_ready()) return;

    if(gplib_get_color(x0,y0,0) == border) return;

    gplib_buffer_image();
    var buffer = new Array(gplib_width*gplib_height);
    var x,y,z;
    for(y=0;y<gplib_height;y++) {
        for(x=0;x<gplib_width;x++) {
            buffer[gplib_width*y+x] = (gplib_check_color(x,y,0) == border) ? 1 : 0;
        }
    }

    gplib_paint_vertical(buffer,x0,y0);
    for(z=0;z<1;z++) {
       var cnt = 0;
        for(y0=0;y0<gplib_height;y0++) {
            for(x0=0;x0<gplib_width;x0++) {
                if(gplib_buffer(buffer,x0,y0) != 2) continue;
                cnt += gplib_paint_vertical(buffer,x0,y0);
           }
        }
        if(cnt>0) --z;
    }
    return;
}

function gplib_paint_vertical(buffer,x0,y0) {
    var y, cnt =0;
    for(y=y0-1;y>=0;y--) {
        if(gplib_buffer(buffer,x0,y) > 0) break;
        cnt += gplib_paint_left(buffer,x0,y);
        cnt += gplib_paint_right(buffer,x0,y);
        buffer[gplib_width*y + x0] = 2;
        PSET(x0,y);
    }
    for(y=y0+1;y<gplib_height;y++) {
        if(gplib_buffer(buffer,x0,y) > 0) break;
        cnt += gplib_paint_left(buffer,x0,y);
        cnt += gplib_paint_right(buffer,x0,y);
        buffer[gplib_width*y + x0] = 2;
        PSET(x0,y);
    }
    return cnt;
}

function gplib_paint_left(buffer,x0,y0) {
    var x,c = 0;
    for(x= x0-1;x>=0;x--) {
        if(gplib_buffer(buffer,x,y0)>0) break;
        buffer[gplib_width*y0 + x] = 2;
        PSET(x,y0);
        ++c;
    }
    return c;
}

function gplib_paint_right(buffer,x0,y0) {
    var x,c = 0;
    for(x= x0+1;x<gplib_width;x++) {
        if(gplib_buffer(buffer,x,y0)>0) break;
        buffer[gplib_width*y0 + x] = 2;
        PSET(x,y0);
        ++c;
    }
    return c;
}

function gplib_buffer(buffer,x,y) {
    if(x<0||x>=gplib_width) return -1;
    if(y<0||y>=gplib_height) return -1;
    return buffer[gplib_width*y + x];
}

/* GROBAL FUNCTIONS FOR USER */
/* GROBAL FUNCTIONS FOR USER */
/* GROBAL FUNCTIONS FOR USER */
/* GROBAL FUNCTIONS FOR USER */
/* GROBAL FUNCTIONS FOR USER */

/* SET SPEED OF EXECUTION */
function SPEED(sec) {
    if(sec>=0) gplib_call_stack_speed = sec;
}

/* CALL FOR EXECUTION */
function CALL(func) {
    if(func == "") return;
    gplib_stack_call(func);
}

/* TIMER CONTROL FUNCTIONS */

function WAIT(sec,call_back_func) {
    if(call_back_func == "") return;
    var cnt = INT(sec*1000/gplib_call_back_time);
    if(cnt<=0) cnt = 1;
    gplib_call_back_timer = gplib_call_back_counter + cnt;
    gplib_call_back_function = call_back_func;
    return;
}

function MAIN() {
    CALL(main);
}

function END() {
    CALL(gplib_end);
}

/* INPUT COTROL */

function INPUT(captions,call_back_func) {
    if(!gplib_wait_input) {
        if(call_back_func == "") return;
        gplib_input_type = "numeric";
        gplib_input_call_back = call_back_func;
        gplib_query_input(captions);
    }
}

function INPUTS(captions,call_back_func) {
    if(!gplib_wait_input) {
        if(call_back_func == "") return;
        gplib_input_type = "text";
        gplib_input_call_back = call_back_func;
        gplib_query_input(captions);
    }
}

function CLEAR() {
    gplib_clear_input();
}

/* GRAPHICS */

function CANVAS(canvas_id) {
    gplib_canvas_id = canvas_id;
    gplib_set_canvas();
    return;
}

function RESIZE (x,y) {
    if(!gplib_canvas_ready()) return;
    x = INT(x);
    y = INT(y);
    if(x<1) return;
    if(y<1) return;
    gplib_width =x;
    gplib_height = y;
    gplib_canvas.width = x;
    gplib_canvas.height = y;
    return;
}

function CMAP (x,y) {
    x = INT(x);
    y = INT(y);
    if(x<1) return;
    if(y<1) return;
    gplib_div_width =x;
    gplib_div_height = y;
    return;
}

function ALPHA(val) {
    if(val<0||val>1.0) return;
    gplib_color_alpha = val;
    return;
}

function COLOR(text,line) {
    gplib_color_text = gplib_color_code(text);
    gplib_color_line = gplib_color_code(line);
    return;
}

function CURSOR(x,y) {
    gplib_cursor_x = x;
    gplib_cursor_y = y;
    return;
}

function MOVE_TO(x,y) {
    gplib_g_cursor_x = x;
    gplib_g_cursor_y = y;
    return;
}

function CSIZE(n,bold,italic) {
    if(!gplib_canvas_ready()) return;
    if(n<1) return;
    gplib_text_bold = (bold==0) ? false : true;
    gplib_text_italic = (italic==0) ? false : true;
    gplib_text_size = n;
    gplib_set_font();
    return;
}

function LOCATE(x,y) {
    var height = (gplib_div_height>0) ? (gplib_height/gplib_div_height) : gplib_text_height;
    var width = (gplib_div_width>0) ? (gplib_width/gplib_div_width) : gplib_text_width;
    gplib_cursor_x = x*width;
    gplib_cursor_y = (y+1)*height - gplib_text_descent;
    return;
}

function PSIZE(n) {
    if(!gplib_canvas_ready()) return;
    if(n<=0) return;
    gplib_pen_size = n;
    gplib_ctx.lineWidth = n;
    return;
}

function FONT(name,size) {
    if(!gplib_canvas_ready()) return;
    if(name=="") return;
    if(size < 1) return;
    gplib_text_name = name;
    gplib_text_size = size;
    gplib_set_font();
    return;
}

function CLS() {
    if(!gplib_canvas_ready()) return;
    gplib_ctx.fillStyle = gplib_color_line;
    gplib_ctx.fillRect(0,0,gplib_width,gplib_height);
    return;
}

function PRINT(text) {
    if(!gplib_canvas_ready()) return;
    text = "" + text;
    gplib_set_font();
    gplib_ctx.fillStyle = gplib_color_text;
    gplib_ctx.fillText(text,gplib_cursor_x,gplib_cursor_y);
    return;
}

function PRINTC(text) {
    if(!gplib_canvas_ready()) return;
    text = "" + text;
    var height = (gplib_div_height>0) ? (gplib_height/gplib_div_height) : gplib_text_height;
    var x1 = gplib_cursor_x;
    var y1 = gplib_cursor_y - height + gplib_text_descent;
    var x2 = gplib_cursor_x + gplib_ctx.measureText(text).width;
    var y2 = gplib_cursor_y + gplib_text_descent;
    LINE_BF(x1,y1,x2,y2);
    PRINT(text);
    return;
}

function PRINTX(x,y,text) {
    if(!gplib_canvas_ready()) return;
    text = "" + text;
    var height = (gplib_div_height>0) ? (gplib_height/gplib_div_height) : gplib_text_height;
    var width = (gplib_div_width>0) ? (gplib_width/gplib_div_width) : gplib_text_width;
    LOCATE(x,y);
    var x1 = gplib_cursor_x;
    var y1 = gplib_cursor_y - height + gplib_text_descent;
    var x2 = gplib_cursor_x + width*text.length;
    var y2 = gplib_cursor_y + gplib_text_descent;
    LINE_BF(x1,y1,x2,y2);
    for(var i=0;i<text.length;i++) {
        LOCATE(x+i,y);
        PRINT(text[i]);
    }
    return;
}

function PSET(x1,y1) {
    if(!gplib_canvas_ready()) return;
    gplib_ctx.fillStyle = gplib_color_line;
    gplib_ctx.fillRect(x1,y1,gplib_pen_size,gplib_pen_size);
    return;
}

function LINE(x1,y1,x2,y2) {
    if(!gplib_canvas_ready()) return;
    gplib_ctx.strokeStyle = gplib_color_line;
    gplib_ctx.beginPath();
    gplib_ctx.moveTo(x1,y1);
    gplib_ctx.lineTo(x2,y2);
    gplib_ctx.stroke();
    MOVE_TO(x2,y2);
    return;
}

function LINE_TO(x,y) {
    if(!gplib_canvas_ready()) return;
    gplib_ctx.strokeStyle = gplib_color_line;
    gplib_ctx.beginPath();
    gplib_ctx.moveTo(gplib_g_cursor_x,gplib_g_cursor_y);
    gplib_ctx.lineTo(x,y);
    gplib_ctx.stroke();
    MOVE_TO(x,y);
    return;
}

function LINE_B(x1,y1,x2,y2) {
    if(!gplib_canvas_ready()) return;
    gplib_ctx.strokeStyle = gplib_color_line;
    var width = (x2>=x1) ? (x2-x1) : (x1-x2);
    var height = (y2>=y1) ? (y2-y1) : (y1-y2);
    var sx = (x1<x2) ? x1 : x2;
    var sy = (y1<y2) ? y1 : y2;
    gplib_ctx.beginPath();
    gplib_ctx.rect(sx,sy,width,height);
    gplib_ctx.stroke();
    return;
}

function LINE_BF(x1,y1,x2,y2) {
    if(!gplib_canvas_ready()) return;
    LINE_B(x1,y1,x2,y2);
    gplib_ctx.fillStyle = gplib_color_line;
    gplib_ctx.fill();
    return;
}

function CIRCLE(x1,y1,r) {
    if(!gplib_canvas_ready()) return;
    if(r<=0) return;
    gplib_ctx.strokeStyle = gplib_color_line;
    gplib_ctx.beginPath();
    gplib_ctx.arc(x1,y1,r,0.0,Math.PI*2);
    gplib_ctx.stroke();
    return;
}

function CIRCLE_F(x1,y1,r) {
    if(!gplib_canvas_ready()) return;
    CIRCLE(x1,y1,r);
    gplib_ctx.fillStyle = gplib_color_line;
    gplib_ctx.fill();
    return;
}

function OVAL(x1,y1,r,st,ed,ratio) {
    if(!gplib_canvas_ready()) return;
    if(r<=0) return;
    if(isNaN(ratio)) return;
    var pizza = false;
    if(st<0|| ed<0) pizza = true;
    gplib_ctx.strokeStyle = gplib_color_line;
    gplib_oval(x1,y1,r,st,ed,ratio,pizza);
    gplib_ctx.stroke();
    return;
}

function OVAL_F(x1,y1,r,st,ed,ratio) {
    if(!gplib_canvas_ready()) return;
    if(r<=0) return;
    if(isNaN(ratio)) return;
    gplib_ctx.strokeStyle = gplib_color_line;
    gplib_ctx.fillStyle = gplib_color_line;
    gplib_oval(x1,y1,r,st,ed,ratio,true);
    gplib_ctx.stroke();
    gplib_ctx.fill();
    return;
}

function POLY(x1,y1,r,gap,st,ed,ratio) {
    if(!gplib_canvas_ready()) return;
    if(r<=0) return;
    if(isNaN(ratio)) return;
    if(st>ed) return;
    gplib_ctx.strokeStyle = gplib_color_line;
    gplib_poly(x1,y1,r,gap,st,ed,ratio);
    gplib_ctx.stroke();
    return;
}

function POLY_F(x1,y1,r,gap,st,ed,ratio) {
    if(!gplib_canvas_ready()) return;
    POLY(x1,y1,r,gap,st,ed,ratio);
    gplib_ctx.fillStyle = gplib_color_line;
    gplib_ctx.fill();
    return;
}

function GETP(x,y,true_color) {
    if(!gplib_canvas_ready()) return;
    true_color = (true_color>0) ? true : false;
    return gplib_get_color(x,y,true_color);
}

function PAINT(x,y,border) {
    if(!gplib_canvas_ready()) return;
    gplib_paint(x,y,border);
    return;
}

/* TRIGONOMETRIC FUNCTION in DEGREES */

/* GLOBAL CONSTANT */
var PI = Math.PI;
var RAD = Math.PI/180.0;

function SIN(degree) {
    return Math.sin(degree*RAD);
}

function COS(degree) {
    return Math.cos(degree*RAD);
}

function TAN(degree) {
    return Math.tan(degree*RAD);
}

/* REVERSE */

function ASIN(ratio) {
    return Math.asin(ratio)/RAD;
}

function ACOS(ratio) {
    return Math.acos(ratio)/RAD;
}

function ATAN(ratio) {
    return Math.atan(ratio)/RAD;
}

/* OTHER */

function SQRT(val) {
    return Math.sqrt(val);
}

function POW10(val) {
    return Math.pow(10,val);
}

function POW(a,b) {
    return Math.pow(a,b);
}

function EXP(val) {
    return Math.exp(val);
}

function LN(val) {
    return Math.log(val);
}

function LOG(val) {
    return Math.log10(val);
}

/* VALUES */

function RND() {
    return Math.random();
}

function INT(value) {
    return Math.floor(value);
}

function CINT(value) {
    return Math.round(value);
}

function FIX(value) {
    return Math.ceil(value);
}


function ABS(value) {
    return Math.abs(value);
}

/* STRINGS */

function FMT(sg,left,right,value) {
    var i,cnt,val,num;

    var err = false;

    var sign = "";
    var fill = " ";
    var ans = "";

    /* TO NUMBER */
    value = parseFloat(value);

    /* SIGN CHECK */
    if(value<0) {
        sign = "-";
        value = ABS(value);
    } else {
        if(sg == "+" || sg == "+0" ) sign = "+";
    }
    if(sg == "0" || sg == "+0")  fill = "0";

    /* ROUND VALUE */
    var round = 0.5;
    for(i=1;i<=right;i++) round = round / 10;
    value = value + round;
    val = Math.floor(value);

    /* big value */
    cnt = left;
    if(sign != "") --cnt;

    for(i = 1; i<=cnt; i++) {
        num = val - Math.floor(val/10)*10;
        ans = num + ans;
        val = Math.floor(val/10);
        if(val==0) break;
    }

    if(val>0) err = true;

    /* fill & sign */
    if(fill == " ") {
        ans = sign + ans;
        for(;i<=cnt;i++) ans = fill + ans;
    } else {
        for(;i<=cnt-1;i++) ans = fill + ans;
        ans = sign + ans;
    }

    /* INTEGER ? */
    if(!err && right <= 0) return ans;

    /* small value */
    ans = ans + ".";
    val = value - Math.floor(value);
    for(i=1;i<=right;i++) {
        val = val*10;
        num = Math.floor(val);
        ans = ans + num;
        val = val - num;
        if(val<0) val = 0;
    }
    if(!err) return ans;

    /*  ERROR */
    ans = "";
    for(i=1;i<=left;i++) ans = ans + "*";
    if(right<=0) return ans;
    ans = ans + ".";
    for(i=1;i<=right;i++) ans = ans + "*";
    return ans;
}

/* DIMENSION */

function DIM(a,b) {

    var c;

    if(a<1) return;

    if( typeof b == "number" ) {
        c = b;
    } else {
        c = 0;
    }
   
    if(c<0) return;

    var variant = new Array(a);

    if(c==0) return variant;

    for(var i=0;i<a;i++) variant[i] = new Array(c);

    return variant;

}

