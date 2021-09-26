/*
 *画布类
 *@param {String} canvas canvas画布元素
 */
class myCanvas {

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")
    }

    //初始化画布
    init(arr) {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        arr.forEach(element => {
            if (element.obj) {
                element.obj.draw();
            }
        });
    }
    showCurrent(arr, id) {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        arr.forEach(element => {
            if (element.obj) {
                if (element.id == id) {
                    element.obj.draw("#1E9FFF");
                } else {
                    element.obj.draw();
                }
            }
        });
    }
}



/*
 *圆形文字类
 *@param {String} str 文本文字
 *@param {String|Number} radius 半径
 *@param {String|Number} start 文字开始弧长
 *@param {String|Number} end 文字结束弧长
 *@param {String|Number} fontSize 文本文字字体大小
 *@param {String} fontFamily 文本文字字体
 *@param {String} fontWeigth 文本文字粗细
 *@param {String} fontStyle 文本文字倾斜
 */
class roundText {
    constructor(obj) {
        obj = obj || {};
        this.str = obj.str || '样本';
        this.radius = obj.radius || 110;
        this.start = obj.start || 0;
        this.end = obj.end || 50;
        this.fontSize = obj.fontSize || 18;
        this.fontFamily = obj.fontFamily || 'arial';
        this.fontWeigth = obj.fontWeigth || 'normal';
        this.fontStyle = obj.fontStyle || 'normal';
    }


    draw(color) {
        const txt = this.str
        const r = this.radius;
        const start = ((1 / 2) - ((this.start / 100) * 2)) * Math.PI;
        const end = start - ((this.end / 100) * 2) * Math.PI
        const circle = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            radius: r
        }

        var radius = circle.radius - (this.fontSize > 32 ? (this.fontSize * 3 / 4) : (this.fontSize * 1 / 3)); //圆的半径
        var angleDecrement = (start - end) / (txt.length - 1) //每个字母占的弧度
        var angle = parseFloat(start) //转一下数字
        var index = 0;
        var character;
        ctx.save();
        ctx.fillStyle = color || "#000";
        ctx.textAlign = "center";
        ctx.textBaseLine = "hanging";
        ctx.font = this.fontStyle + " normal " + " " + this.fontWeigth + " " + this.fontSize + "px " + this.fontFamily;
        while (index < txt.length) {
            character = txt.charAt(index)
            ctx.save()
            ctx.beginPath()
            ctx.translate(circle.x + Math.cos(angle) * radius, circle.y - Math.sin(angle) * radius)
            ctx.rotate(Math.PI / 2 - angle) //Math.PI/2为旋转90度  Math.PI/180*X为旋转多少度
            ctx.fillText(character, 0, 0)
            angle -= angleDecrement
            index++
            ctx.restore()

        }
        ctx.restore()

    }

    setStr(str) {
        this.str = str;
    }
    setRadius(radius) {
        this.radius = radius;
    }
    setStart(start) {
        this.start = start;
    }
    setEnd(end) {
        this.end = end;
    }
    setFontSize(fontSize) {
        this.fontSize = fontSize;
    }
    setFontFamily(fontFamily) {
        this.fontFamily = fontFamily;
    }
    setFontWeight(fontWeigth) {
        this.fontWeigth = fontWeigth;
    }
    setFontStyle(fontStyle) {
        this.fontStyle = fontStyle;
    }
}

/*
 *圆形框类
 *@param {String|Number} radius 半径
 *@param {String} thickness 粗细
 */
class roundShape {
    constructor(obj) {
        obj = obj || {};
        this.radius = obj.radius || 120;
        this.thickness = obj.thickness || 1;

    }
    draw(color) {
        ctx.save()
            //创建路径
        ctx.beginPath();
        ctx.strokeStyle = color || "#000";
        ctx.lineWidth = this.thickness;
        //添加子路径
        ctx.arc(canvas.width / 2, canvas.height / 2, this.radius, 0, 2 * Math.PI);

        //显示路径
        ctx.stroke();
        ctx.restore()
    }
    setRadius(radius) {
        this.radius = radius + 20;
    }
    setThickness(thickness) {
        this.thickness = thickness;
    }
}

/*
 *普通文字类
 *@param {String} str 文本文字
 *@param {Number} x 文字X坐标
 *@param {Number} y 文字Y坐标
 *@param {String|Number} fontSize 文本文字字体大小
 *@param {String} fontFamily 文本文字字体
 *@param {String} fontWeigth 文本文字粗细
 *@param {String} fontStyle 文本文字倾斜
 */
class normalText {
    constructor(obj) {
        obj = obj || {};
        this.str = obj.str || '样本'
        this.x = obj.x || 125;
        this.y = obj.y || 125;
        this.fontSize = obj.fontSize || 18;
        this.rotation = obj.rotation || 50;
        this.fontFamily = obj.fontFamily || 'arial';
        this.fontWeigth = obj.fontWeigth || 'normal';
        this.fontStyle = obj.fontStyle || 'normal';
    }
    draw(color) {
        ctx.save();
        ctx.fillStyle = color || "#000";
        ctx.textAlign = "center";
        ctx.textBaseLine = "middle";
        ctx.font = this.fontStyle + " normal " + "" + this.fontWeigth + " " + this.fontSize + "px " + this.fontFamily;
        ctx.translate(this.x, this.y)
        ctx.rotate((((this.rotation * 1 / 50) + 1)) * Math.PI) //Math.PI/2为旋转90度  Math.PI/180*X为旋转多少度
        ctx.fillText(this.str, 0, 0);
        ctx.restore()
    }

    setStr(str) {
        this.str = str;
    }

    setX(x) {
        this.x = x * 125 / 50;
    }
    setY(y) {
        this.y = y * 125 / 50;
    }
    setFontSize(fontSize) {
        this.fontSize = fontSize;
    }
    setFontFamily(fontFamily) {
        this.fontFamily = fontFamily;
    }
    setFontWeight(fontWeigth) {
        this.fontWeigth = fontWeigth;
    }
    setFontStyle(fontStyle) {
        this.fontStyle = fontStyle;
    }
    SetRotation(rotation) {
        this.rotation = rotation;
    }
}



/*
 *图像类
 *@param {element} img 图片元素
 *@param {String|Number} x 图片X坐标
 *@param {String|Number} y 图片Y坐标
 *@param {String|Number} imgSize 图片大小
 *@param {String|Number} rotation 图片旋转
 */
class imgShape {
    constructor(obj) {
        obj = obj || {};
        this.img = obj.img || null;
        this.x = obj.x || 125;
        this.y = obj.y || 125;
        this.imgSize = obj.imgSize || 200;
        this.rotation = obj.rotation || 50;
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y)
        ctx.rotate(Math.PI * ((50 + this.rotation) / 50))
        ctx.drawImage(this.img, -this.imgSize / 2, -this.imgSize / 2, this.imgSize, this.imgSize);
        ctx.restore()
    }
    setX(x) {
        this.x = x * 125 / 50;
    }
    setY(y) {
        this.y = y * 125 / 50;
    }
    setImg(img) {
        this.img = img;
    }

    setSize(imgSize) {
        this.imgSize = imgSize;
    }
    setRotation(rotation) {
        this.rotation = rotation;
    }
}





/*
 *矩形类
 *@param {element} img 图片元素
 *@param {String|Number} x 图片X坐标
 *@param {String|Number} y 图片Y坐标
 *@param {String|Number} width 宽度
 *@param {String|Number} heigth 高度
 */

class rectFrame {
    constructor(obj) {
        obj = obj || {};
        this.width = obj.width || 240;
        this.height = obj.height || 240;
        this.x = obj.x || 5;
        this.y = obj.y || 5;
    }
    draw() {
        ctx.save();
        ctx.strokeRect(this.x, this.y, this.width, this.height)

        ctx.restore()
    }
    setWidth(width) {
        this.width = width > 240 ? 240 : width;

    }
    setHeight(height) {
        this.height = height > 240 ? 250 : height;
    }
    setX(x) {
        this.x = x * 250 / 100;
    }
    setY(y) {
        this.y = y * 250 / 100;
    }
}