 /**
  * 一些通用方法
  */
 (function(exports) {



     /**
      * 将string字符串转为html对象,默认创一个div填充
      * 因为很常用，所以单独提取出来了
      * @param {String} strHtml 目标字符串
      * @return {HTMLElement} 返回处理好后的html对象,如果字符串非法,返回null
      */
     exports.parseHtml = function(strHtml) {
         if (typeof strHtml !== 'string') {
             return strHtml;
         }
         // 创一个灵活的div
         var i,
             a = document.createElement('div');
         var b = document.createDocumentFragment();

         a.innerHTML = strHtml;

         while ((i = a.firstChild)) {
             b.appendChild(i);
         }

         return b;
     };


     /**
      * 将js渲染到元素
      * @param {String} dom 对应的目标
      * @param {String} code 渲染后的模板
      */
     //创建一个script标签
     exports.loadScriptString = function(dom, code) {
         if (typeof dom === 'string') {
             dom = document.querySelector(dom);
         }
         var script = document.createElement("script"); //创建一个script标签
         script.type = "text/javascript";
         try {
             //IE浏览器认为script是特殊元素,不能再访问子节点;报错;
             script.appendChild(document.createTextNode(code));
         } catch (ex) {
             script.text = code;
         }
         dom.appendChild(script);
     };



     /**
      * 将对象渲染到模板
      * @param {String} template 对应的目标
      * @param {Object} obj 目标对象
      * @return {String} 渲染后的模板
      */
     exports.renderTemplate = function(template, obj) {
         return template.replace(/[{]{2}([^}]+)[}]{2}/g, function($0, $1) {
             return obj[$1] || '0';
         });
     };

     /**
      * 定义一个计数器
      */
     var counterArr = [0];

     /**
      * 添加测试数据
      * @param {String} dom 目标dom
      * @param {Number} count 需要添加的数量
      * @param {Boolean} isReset 是否需要重置，下拉刷新的时候需要
      * @param {Number} index 属于哪一个刷新
      */
     exports.appendTestData = function(dom, count, isReset, page, index) {
         // 数据存储器
         var dataList = [];

         if (typeof dom === 'string') {
             dom = document.querySelector(dom);
         }




         // var prevTitle = typeof index !== 'undefined' ? ('Tab' + index) : '';

         var counterIndex = index || 0;

         counterArr[counterIndex] = counterArr[counterIndex] || 0;

         if (isReset) {
             dom.innerHTML = '';
             counterArr[counterIndex] = 0;
         }
         var template = ` <div class="result-box">
        <a href="#">
            <div class="txt">
                <h3>{{title}}</h3>
                <p><b>地址：</b> <span>{{address}}</span></p>
                <p><b>电话：</b> <span>{{phone}}</span></p>

            </div>

        </a>
    </div>`;


         var html = '',
             dateStr = (new Date()).toLocaleString();



         for (var i = 0; i < count; i++) {
             if (dataList.length > i) {
                 html += exports.renderTemplate(template, {
                     title: dataList[i].title,
                     address: dataList[i].address,
                     phone: dataList[i].phone,

                 });

             }


             counterArr[counterIndex]++;
         }

         var child = exports.parseHtml(html);
         dom.appendChild(child);
         return dataList;
     };



     /**
      * 添加测试数据
      * @param {String} dom 目标dom
      * @param {Number} countList 需要添加的数据数组
      * @param {Boolean} isReset 是否需要重置，下拉刷新的时候需要
      * @param {Number} id 属于哪一个
      */
     exports.appendMenuData = function(dom, countList, isReset) {

         if (typeof dom === 'string') {
             dom = document.querySelector(dom);
         }






         if (isReset) {
             dom.innerHTML = '';
         }
         var template = `<li class="cnt-item" data-id="{{id}}">
         <a href="javascript:;">{{type}}#{{id}}</a>
         <div class="cls"></div>
     </li>`;


         var html = '';



         for (var i = 0; i < countList.length; i++) {

             if (countList[i].obj) {
                 let type = '';
                 switch (countList[i].type) {
                     case 'textShape':
                         type = '圆形文本';
                         html += exports.renderTemplate(template, {
                             id: countList[i].id,
                             type: type

                         });
                         break;
                     case 'roundShape':
                         type = '圆形形状';
                         html += exports.renderTemplate(template, {
                             id: countList[i].id,
                             type: type

                         });
                         break;
                     case 'normalText':
                         type = '文本';
                         html += exports.renderTemplate(template, {
                             id: countList[i].id,
                             type: type

                         });
                         break;
                     case 'imgShape':
                         type = '图形';
                         html += exports.renderTemplate(template, {
                             id: countList[i].id,
                             type: type

                         });
                         break;
                     case 'rectFrame':
                         type = '矩形框';
                         html += exports.renderTemplate(template, {
                             id: countList[i].id,
                             type: type

                         });
                         break;
                 }

             } else {
                 if (countList[i].type == 'imgShape') {
                     html += exports.renderTemplate(template, {
                         id: countList[i].id,
                         type: '图形'

                     });
                 }
             }




         }

         var child = exports.parseHtml(html);

         dom.appendChild(child);
         //突出当前显示对象事件
         exports.bindEvent('.cnt-item', function() {
             $(this).siblings().removeClass('active');
             $(this).addClass('active');
             appendEditMenu("#edit_menu", contentList, true, $(this).attr('data-id'));
         });
         exports.bindEvent('.cnt-item', function() {
             $(this).siblings().removeClass('active-bg');
             $(this).addClass('active-bg');
             myCanvasOne.showCurrent(contentList, $(this).attr('data-id'));
         }, "mouseenter");
         exports.bindEvent('.cnt-item', function() {
             $(this).removeClass('active-bg');
             myCanvasOne.init(contentList);
         }, "mouseleave");
         exports.bindEvent('.cls', function() {
             $(this).parent().remove();
             contentList[$(this).parent().attr('data-id')].obj = null;
             myCanvasOne.init(contentList);

         });
     };

     /**
      * 添加测试数据
      * @param {String} dom 目标dom
      * @param {Number} countList 需要添加的数据数组
      * @param {Boolean} isReset 是否需要重置，下拉刷新的时候需要
      * @param {Number} index 属于哪一个刷新
      */
     exports.appendEditMenu = function(dom, countList, isReset, id) {

         if (typeof dom === 'string') {
             dom = document.querySelector(dom);
         }






         if (isReset) {
             dom.innerHTML = '';
         }



         var html = '';

         //编辑框对应html代码
         if (countList[id].type == 'textShape') {
             var template = `<div class="item text-normal" data-id="{{id}}">
            <div class="text-style">
                <div class="selectBox" id="select_ff">
                    <div class="inputCase">
                        <input class="imitationSelect" type="text" oulname="" oulid="" value="{{fontFamliy}}" readonly="">
                        <i class="fa fa-caret-down"><img src="./images/arrow_drop_down.png" alt=""></i>
                    </div>
                    <ul class="selectUl" id="select_ff_ul">
                        <li oliname="Arial" class="actived_li">Arial</li>
                        <li oliname="Helvetica">Helvetica</li>
                        <li oliname="sans-serif">sans-serif</li>
                    </ul>
                </div>
                <div class="selectBox selectSize">
                    <div class="inputCase">
                        <input class="imitationSelect imitationSelectSize" type="text" oulname="" oulid="" value="{{fontSize}}" readonly="">
                        <i class="fa fa-caret-down"><img src="./images/arrow_drop_down.png" alt=""></i>
                    </div>
                    <ul class="selectUl selectUlSize">
                        <li oliname="6" class="actived_li">6</li>
                        <li oliname="7">7</li>
                        <li oliname="8">8</li>
                        <li oliname="9">9</li>
                        <li oliname="10">10</li>
                        <li oliname="11">11</li>
                        <li oliname="12">12</li>
                        <li oliname="14">14</li>
                        <li oliname="16">16</li>
                        <li oliname="18">18</li>
                        <li oliname="20">20</li>
                        <li oliname="22">22</li>
                        <li oliname="24">24</li>
                        <li oliname="26">26</li>
                        <li oliname="28">28</li>
                        <li oliname="30">30</li>
                        <li oliname="32">32</li>
                        <li oliname="34">34</li>
                        <li oliname="36">36</li>
                        <li oliname="38">38</li>
                        <li oliname="40">40</li>
                        <li oliname="42">42</li>
                        <li oliname="44">44</li>
                        <li oliname="46">46</li>
                        <li oliname="48">48</li>
                        <li oliname="50">50</li>
                        <li oliname="52">52</li>
                        <li oliname="54">54</li>
                        <li oliname="56">56</li>
                        <li oliname="58">58</li>
                        <li oliname="60">60</li>
                        <li oliname="64">64</li>
                        <li oliname="72">72</li>
                        <li oliname="80">80</li>
                    </ul>
                </div>
                <div class="font-b"></div>
                <div class="font-i"></div>
            </div>
            <div class="text">
                <input type="text" placeholder="样本" class='str' value='{{str}}'>
            </div>
            <div class="text-zui text-radius">
                <p>文字半径 [<span class="num">{{radius}}</span>]</p>
        
        
                <div class="tr-box" id="tr_ts">
        
                </div>
        
        
            </div>
            <div class="text-zui text-arc">
                <p>文字弧长 [<span class="num">{{end}}</span>]</p>
                <div class="tr-box" id="tarc_ts">
        
                </div>
            </div>
            <div class="text-zui text-sp">
                <p>文字起始点 [<span class="num">{{start}}</span>]</p>
                <div class="tr-box" id="tsp_ts">
        
                </div>
            </div>
            
        </div>`;
         } else if (countList[id].type == 'normalText') {
             var template = `<div class="item text-shape" data-id="1">
            <div class="text-style">
                <div class="selectBox" id="select_ff">
                    <div class="inputCase">
                        <input class="imitationSelect" type="text" oulname="" oulid="" value="{{fontFamily}}" readonly="">
                        <i class="fa fa-caret-down"><img src="./images/arrow_drop_down.png" alt=""></i>
                    </div>
                    <ul class="selectUl" id="select_ff_ul">
                        <li oliname="Arial" class="actived_li">Arial</li>
                        <li oliname="Helvetica">Helvetica</li>
                        <li oliname="sans-serif">sans-serif</li>
                    </ul>
                </div>
                <div class="selectBox selectSize">
                    <div class="inputCase">
                        <input class="imitationSelect imitationSelectSize" type="text" oulname="" oulid="" value="{{fontSize}}" readonly="">
                        <i class="fa fa-caret-down"><img src="./images/arrow_drop_down.png" alt=""></i>
                    </div>
                    <ul class="selectUl selectUlSize">
                        <li oliname="6" class="actived_li">6</li>
                        <li oliname="7">7</li>
                        <li oliname="8">8</li>
                        <li oliname="9">9</li>
                        <li oliname="10">10</li>
                        <li oliname="11">11</li>
                        <li oliname="12">12</li>
                        <li oliname="14">14</li>
                        <li oliname="16">16</li>
                        <li oliname="18">18</li>
                        <li oliname="20">20</li>
                        <li oliname="22">22</li>
                        <li oliname="24">24</li>
                        <li oliname="26">26</li>
                        <li oliname="28">28</li>
                        <li oliname="30">30</li>
                        <li oliname="32">32</li>
                        <li oliname="34">34</li>
                        <li oliname="36">36</li>
                        <li oliname="38">38</li>
                        <li oliname="40">40</li>
                        <li oliname="42">42</li>
                        <li oliname="44">44</li>
                        <li oliname="46">46</li>
                        <li oliname="48">48</li>
                        <li oliname="50">50</li>
                        <li oliname="52">52</li>
                        <li oliname="54">54</li>
                        <li oliname="56">56</li>
                        <li oliname="58">58</li>
                        <li oliname="60">60</li>
                        <li oliname="64">64</li>
                        <li oliname="72">72</li>
                        <li oliname="80">80</li>
                    </ul>
                </div>
                <div class="font-b"></div>
                <div class="font-i"></div>
            </div>
            <div class="text">
                <input type="text" placeholder="样本" class="str" value="{{str}}">
            </div>
            <div class="text-zui text-radius">
                <p>相当于X的位置 [<span class="num">{{x}}</span>]</p>
                <div class="tr-box" id="tr_tn">

                </div>
            </div>
            <div class="text-zui text-arc">
                <p>相当于Y的位置 [<span class="num">{{y}}</span>]</p>
                <div class="tr-box" id="tarc_tn">

                </div>
            </div>
            <div class="text-zui text-sp">
                <p>Rotation [<span class="num">{{rotation}}</span>]</p>
                <div class="tr-box" id="tsp_tn">

                </div>
            </div>

        </div>`

         } else if (countList[id].type == 'roundShape') {
             var template = ` <div class="item shape" data-id="{{id}}">

            <div class="text-zui text-radius">
                <p>半径 [<span class="num">{{sRadius}}</span>]</p>
                <div class="tr-box" id="tr_s">

                </div>
            </div>
            <div class="text-zui text-arc">
                <p>厚度 [<span class="num">{{thickness}}</span>]</p>
                <div class="tr-box" id="tarc_s">

                </div>
            </div>
            <!-- <div class="text-zui text-sp">
                <p>line break [<span class="num">0</span>]</p>
                <div class="tr-box" id="tsp">

                </div>
            </div> -->

        </div>`
         } else if (countList[id].type == 'imgShape') {
             var imgBox = `<div class="img-box" data-id="{{id}}">
            <div class="img-item" data-id="0">
                <img src="./images/Image1.png" alt="">
            </div>
            <div class="img-item" data-id="1">
                <img src="./images/Image2.png" alt="">
            </div>
            <div class="img-item" data-id="2">
                <img src="./images/Image3.png" alt="">
            </div>
            <div class="img-item" data-id="3">
                <img src="./images/Image4.png" alt="">
            </div>
            <div class="img-item" data-id="4">
                <img src="./images/Image5.png" alt="">
            </div>
            <div class="img-item" data-id="5">
                <img src="./images/Image6.png" alt="">
            </div>
            <div class="img-item" data-id="6">
                <img src="./images/Image7.png" alt="">
            </div>
        </div>`;
             var template = ` 
         <div class="item item-img" data-id="{{id}}">

         <div class="text-zui text-radius">
             <p>半径 [<span class="num">{{imgSize}}</span>]</p>
             <div class="tr-box" id="tr_img">

             </div>
         </div>
         <div class="text-zui text-radius">
                <p>相当于X的位置 [<span class="num">{{x}}</span>]</p>
                <div class="tr-box" id="trx_img">

                </div>
            </div>
            <div class="text-zui text-arc">
                <p>相当于Y的位置 [<span class="num">{{y}}</span>]</p>
                <div class="tr-box" id="tarc_img">

                </div>
            </div>
            <div class="text-zui text-sp">
                <p>Rotation [<span class="num">{{rotation}}</span>]</p>
                <div class="tr-box" id="tsp_img">

                </div>
            </div>
            <!-- <button id="chImg">选择图片</button>-->

     </div>`;
         } else if (countList[id].type == 'rectFrame') {
             var template = `<div class="item shape" data-id="{{id}}">

             <div class="text-zui text-size">
                <p>宽 [<span class="num">{{rWidth}}</span>]</p>
                <div class="tr-box" id="tr_w">

                </div>
                 
             </div>
             <div class="text-zui text-size">
             <p>高 [<span class="num">{{rHeight}}</span>]</p>
             <div class="tr-box" id="tr_h">

             </div>
              
          </div>

             <div class="text-zui text-radius">
                <p>相当于X的位置 [<span class="num">{{rX}}</span>]</p>
                <div class="tr-box" id="tr_x">

                </div>
            </div>
            <div class="text-zui text-arc">
                <p>相当于Y的位置 [<span class="num">{{rY}}</span>]</p>
                <div class="tr-box" id="tr_y">

                </div>
            </div>
 
         </div>`;
         } else {
             var template = ``;
         }

         //编辑框对应js代码
         if (countList[id].type == 'textShape') {
             var jsTemplate = ` //字体
             $("#select_ff .imitationSelect").on("click", function() {
                 $(this).parent().next().toggle(); //ul弹窗展开
                 $(this).next().toggleClass("fa-caret-up") //点击input选择适合，小图标动态切换
                 if (event.stopPropagation) {
                     // 针对 Mozilla 和 Opera   
                     event.stopPropagation();
                 } else if (window.event) {
                     // 针对 IE   
                     window.event.cancelBubble = true;
                 }
                 /*阻止事件传播，事件从点击的元素出发，向外（window）传播，
                              如果不写个阻止事件，会导致下面的document点击函数一起执行，导致显示失败*/
     
             });
             $("#select_ff_ul li").click(function(event) {
                 $(this).addClass("actived_li").siblings().removeClass("actived_li"); //点击当前的添加。actived_li这个类；其他的移除这个类名
                 var oliName = $(this).attr("oliName"); //定义一个name属性，获取点击的元素属性赋值到当前，方便动态化传值
                 // var oliId = $(this).attr("oliId"); //定义一个id属性，获取点击的元素属性赋值到当前，方便动态化传值
                 $(this).parent().prev().children('.imitationSelect').val(oliName); //把当前点击的name赋值到显示的input的val里面
                 $(this).parent().prev().children().attr("oliName", oliName); //把当前点击的oliName赋值到显示的input的oliName里面
     
                 //设置字体
                 const elemId = $('.selectBox').parent().parent().attr("data-id");
                 contentList[elemId].obj.setFontFamily($(this).attr("oliName"))
                 myCanvasOne.init(contentList);
             });
             $(document).click(function(event) {
                 $(".inputCase .fa").removeClass("fa-caret-up").addClass("fa-caret-down") //当点隐藏ul弹窗时候，把小图标恢复原状
                 $("#select_ff_ul").hide(); //当点击空白处，隐藏ul弹窗
             });
     
             //字体大小
             $(".selectSize .imitationSelect").on("click", function() {
                 $(this).parent().next().toggle(); //ul弹窗展开
                 $(this).next().toggleClass("fa-caret-up") //点击input选择适合，小图标动态切换
                 if (event.stopPropagation) {
                     // 针对 Mozilla 和 Opera   
                     event.stopPropagation();
                 } else if (window.event) {
                     // 针对 IE   
                     window.event.cancelBubble = true;
                 }
                 /*阻止事件传播，事件从点击的元素出发，向外（window）传播，
                              如果不写个阻止事件，会导致下面的document点击函数一起执行，导致显示失败*/
     
             });
             $(".selectUlSize li").click(function(event) {
                 $(this).addClass("actived_li").siblings().removeClass("actived_li"); //点击当前的添加。actived_li这个类；其他的移除这个类名
                 var oliName = $(this).attr("oliName"); //定义一个name属性，获取点击的元素属性赋值到当前，方便动态化传值
                 var oliId = $(this).attr("oliId"); //定义一个id属性，获取点击的元素属性赋值到当前，方便动态化传值
                 $(this).parent().prev().children().val(oliName); //把当前点击的name赋值到显示的input的val里面
                 $(this).parent().prev().children().attr("oliName", oliName); //把当前点击的oliName赋值到显示的input的oliName里面
     
     
                 //设置字体大小
                 const elemId = $('.selectBox').parent().parent().attr("data-id");
                //  console.log(contentList[elemId])
     
                 contentList[elemId].obj.setFontSize($(this).attr("oliName"))
                 myCanvasOne.init(contentList);
             });
             $(document).click(function(event) {
                 $(".inputCase .fa").removeClass("fa-caret-up").addClass("fa-caret-down") //当点隐藏ul弹窗时候，把小图标恢复原状
                 $(".selectUlSize").hide(); //当点击空白处，隐藏ul弹窗
             });
     
             //加粗
             $('.font-b').click(function() {
                 if (!$(this).hasClass('font-b-active')) {
     
                     //设置字体粗细
                     const elemId = $(this).parent().parent().attr("data-id");
                     contentList[elemId].obj.setFontWeight('900');
                    //  console.log(contentList[elemId].obj)
                     myCanvasOne.init(contentList);
                 } else {
                     //设置字体粗细
                     const elemId = $(this).parent().parent().attr("data-id");
                     contentList[elemId].obj.setFontWeight('500');
                     myCanvasOne.init(contentList);
     
                 }
                 $(this).toggleClass('font-b-active');
     
             });
     
             //倾斜
             $('.font-i').click(function() {
                 if (!$(this).hasClass('font-i-active')) {
     
                     //设置字体粗细
                     const elemId = $(this).parent().parent().attr("data-id");
                     contentList[elemId].obj.setFontStyle('italic');
                    //  console.log(contentList[elemId].obj)
                     myCanvasOne.init(contentList);
                 } else {
                     //设置字体粗细
                     const elemId = $(this).parent().parent().attr("data-id");
                     contentList[elemId].obj.setFontStyle('normal');
                     myCanvasOne.init(contentList);
     
                 }
                 $(this).toggleClass('font-i-active');
             });
     
             //文本文字修改
             $(".str").bind('input propertychange', function() {
                 var a = $(".box1").val();
                 // 设置文字并重新渲染
                 const elemId = $(this).parent().parent().attr("data-id");
                 contentList[elemId].obj.setStr($(this).val())
                 myCanvasOne.init(contentList);
             })
     
     
             // 拖拽条
             ZUI.silder({
                 elem: '#tr_ts',
                 color: '#1E9FFF',
                 pos: '{{radius}}%',
                 showNum: true,
                 count: 100,
                 disable: false,
                 callBackMove: function(num) {
                     // console.log('move', num);
                     // 拖拽条数据显示同步
                     $(this.elem).siblings('p').children('.num').text(Math.round(num));
                     // 设置文字半径并重新渲染
                     const elemId = $(this.elem).parent().parent().attr("data-id");
                     contentList[elemId].obj.setRadius(Math.round(num) + 10)
                     myCanvasOne.init(contentList);
                 },
                 callBackMouseup: function(num) {
                     // console.log('up', num);
                 }
             })
             ZUI.silder({
                 elem: '#tarc_ts',
                 color: '#1E9FFF',
                 pos: '{{end}}%',
                 showNum: true,
                 count: 100,
                 disable: false,
                 callBackMove: function(num) {
                     // console.log('move', num);
                     // 拖拽条数据显示同步
                     $(this.elem).siblings('p').children('.num').text(Math.round(num));
                     // 设置文字弧长并重新渲染
                     const elemId = $(this.elem).parent().parent().attr("data-id");
                     contentList[elemId].obj.setEnd(Math.round(num))
                     myCanvasOne.init(contentList);
                 },
                 callBackMouseup: function(num) {
                     // console.log('up', num);
                 }
             })
             ZUI.silder({
                 elem: '#tsp_ts',
                 color: '#1E9FFF',
                 pos: '{{start}}%',
                 showNum: true,
                 count: 100,
                 disable: false,
                 callBackMove: function(num) {
                     // console.log('move', num);
                     // 拖拽条数据显示同步
                     $(this.elem).siblings('p').children('.num').text(Math.round(num));
                     // 设置文字起始弧长并重新渲染
                     const elemId = $(this.elem).parent().parent().attr("data-id");
                     contentList[elemId].obj.setStart(Math.round(num))
                     myCanvasOne.init(contentList);
                 },
                 callBackMouseup: function(num) {
                     // console.log('up', num);
                 }
             })`
         } else if (countList[id].type == 'normalText') {

             var jsTemplate = `
             //字体
             $("#select_ff .imitationSelect").on("click", function() {
                 $(this).parent().next().toggle(); //ul弹窗展开
                 $(this).next().toggleClass("fa-caret-up") //点击input选择适合，小图标动态切换
                 if (event.stopPropagation) {
                     // 针对 Mozilla 和 Opera   
                     event.stopPropagation();
                 } else if (window.event) {
                     // 针对 IE   
                     window.event.cancelBubble = true;
                 }
                 /*阻止事件传播，事件从点击的元素出发，向外（window）传播，
                              如果不写个阻止事件，会导致下面的document点击函数一起执行，导致显示失败*/
     
             });
             $("#select_ff_ul li").click(function(event) {
                 $(this).addClass("actived_li").siblings().removeClass("actived_li"); //点击当前的添加。actived_li这个类；其他的移除这个类名
                 var oliName = $(this).attr("oliName"); //定义一个name属性，获取点击的元素属性赋值到当前，方便动态化传值
                 // var oliId = $(this).attr("oliId"); //定义一个id属性，获取点击的元素属性赋值到当前，方便动态化传值
                 $(this).parent().prev().children('.imitationSelect').val(oliName); //把当前点击的name赋值到显示的input的val里面
                 $(this).parent().prev().children().attr("oliName", oliName); //把当前点击的oliName赋值到显示的input的oliName里面
     
                 //设置字体
                 const elemId = $('.selectBox').parent().parent().attr("data-id");
                 contentList[elemId].obj.setFontFamily($(this).attr("oliName"))
                 myCanvasOne.init(contentList);
             });
             $(document).click(function(event) {
                 $(".inputCase .fa").removeClass("fa-caret-up").addClass("fa-caret-down") //当点隐藏ul弹窗时候，把小图标恢复原状
                 $("#select_ff_ul").hide(); //当点击空白处，隐藏ul弹窗
             });
     
             //字体大小
             $(".selectSize .imitationSelect").on("click", function() {
                 $(this).parent().next().toggle(); //ul弹窗展开
                 $(this).next().toggleClass("fa-caret-up") //点击input选择适合，小图标动态切换
                 if (event.stopPropagation) {
                     // 针对 Mozilla 和 Opera   
                     event.stopPropagation();
                 } else if (window.event) {
                     // 针对 IE   
                     window.event.cancelBubble = true;
                 }
                 /*阻止事件传播，事件从点击的元素出发，向外（window）传播，
                              如果不写个阻止事件，会导致下面的document点击函数一起执行，导致显示失败*/
     
             });
             $(".selectUlSize li").click(function(event) {
                 $(this).addClass("actived_li").siblings().removeClass("actived_li"); //点击当前的添加。actived_li这个类；其他的移除这个类名
                 var oliName = $(this).attr("oliName"); //定义一个name属性，获取点击的元素属性赋值到当前，方便动态化传值
                 var oliId = $(this).attr("oliId"); //定义一个id属性，获取点击的元素属性赋值到当前，方便动态化传值
                 $(this).parent().prev().children().val(oliName); //把当前点击的name赋值到显示的input的val里面
                 $(this).parent().prev().children().attr("oliName", oliName); //把当前点击的oliName赋值到显示的input的oliName里面
     
     
                 //设置字体大小
                 const elemId = $('.selectBox').parent().parent().attr("data-id");
                //  console.log(contentList[elemId])
     
                 contentList[elemId].obj.setFontSize($(this).attr("oliName"))
                 myCanvasOne.init(contentList);
             });
             $(document).click(function(event) {
                 $(".inputCase .fa").removeClass("fa-caret-up").addClass("fa-caret-down") //当点隐藏ul弹窗时候，把小图标恢复原状
                 $(".selectUlSize").hide(); //当点击空白处，隐藏ul弹窗
             });
     
             //加粗
             $('.font-b').click(function() {
                 if (!$(this).hasClass('font-b-active')) {
     
                     //设置字体粗细
                     const elemId = $(this).parent().parent().attr("data-id");
                     contentList[elemId].obj.setFontWeight('900');
                    //  console.log(contentList[elemId].obj)
                     myCanvasOne.init(contentList);
                 } else {
                     //设置字体粗细
                     const elemId = $(this).parent().parent().attr("data-id");
                     contentList[elemId].obj.setFontWeight('500');
                     myCanvasOne.init(contentList);
     
                 }
                 $(this).toggleClass('font-b-active');
     
             });
     
             //倾斜
             $('.font-i').click(function() {
                 if (!$(this).hasClass('font-i-active')) {
     
                     //设置字体粗细
                     const elemId = $(this).parent().parent().attr("data-id");
                     contentList[elemId].obj.setFontStyle('italic');
                    //  console.log(contentList[elemId].obj)
                     myCanvasOne.init(contentList);
                 } else {
                     //设置字体粗细
                     const elemId = $(this).parent().parent().attr("data-id");
                     contentList[elemId].obj.setFontStyle('normal');
                     myCanvasOne.init(contentList);
     
                 }
                 $(this).toggleClass('font-i-active');
             });
     
             //文本文字修改
             $(".str").bind('input propertychange', function() {
                 var a = $(".box1").val();
                 // 设置文字并重新渲染
                 const elemId = $(this).parent().parent().attr("data-id");
                 contentList[elemId].obj.setStr($(this).val())
                 myCanvasOne.init(contentList);
             })
             // 拖拽条
             ZUI.silder({
                 elem: '#tr_tn',
                 color: '#1E9FFF',
                 pos: '{{x}}%',
                 showNum: true,
                 count: 100,
                 disable: false,
                 callBackMove: function(num) {
                     // console.log('move', num);
                     // 拖拽条数据显示同步
                     $(this.elem).siblings('p').children('.num').text(Math.round(num));
                     // 设置文字X并重新渲染
                     const elemId = $(this.elem).parent().parent().attr("data-id");
                     contentList[elemId].obj.setX(Math.round(num))
                     myCanvasOne.init(contentList);
                 },
                 callBackMouseup: function(num) {
                     // console.log('up', num);
                 }
             })
             ZUI.silder({
                 elem: '#tarc_tn',
                 color: '#1E9FFF',
                 pos: '{{y}}%',
                 showNum: true,
                 count: 100,
                 disable: false,
                 callBackMove: function(num) {
                     // 拖拽条数据显示同步
                     $(this.elem).siblings('p').children('.num').text(Math.round(num));
                     // 设置文字Y并重新渲染
                     const elemId = $(this.elem).parent().parent().attr("data-id");
                     contentList[elemId].obj.setY(Math.round(num))
                     myCanvasOne.init(contentList);
                 },
                 callBackMouseup: function(num) {
                     // console.log('up', num);
                 }
             })
             ZUI.silder({
                 elem: '#tsp_tn',
                 color: '#1E9FFF',
                 pos: '{{rotation}}%',
                 showNum: true,
                 count: 100,
                 disable: false,
                 callBackMove: function(num) {
                     // 拖拽条数据显示同步
                     $(this.elem).siblings('p').children('.num').text(Math.round(num));
                     // 设置文字旋转并重新渲染
                     const elemId = $(this.elem).parent().parent().attr("data-id");
                     contentList[elemId].obj.SetRotation(Math.round(num))
                     myCanvasOne.init(contentList);
                 },
                 callBackMouseup: function(num) {
                     // console.log('up', num);
                 }
             })`;
         } else if (countList[id].type == 'roundShape') {
             var jsTemplate = ` //字体
             $("#select_ff .imitationSelect").on("click", function() {
                 $(this).parent().next().toggle(); //ul弹窗展开
                 $(this).next().toggleClass("fa-caret-up") //点击input选择适合，小图标动态切换
                 if (event.stopPropagation) {
                     // 针对 Mozilla 和 Opera   
                     event.stopPropagation();
                 } else if (window.event) {
                     // 针对 IE   
                     window.event.cancelBubble = true;
                 }
                 /*阻止事件传播，事件从点击的元素出发，向外（window）传播，
                              如果不写个阻止事件，会导致下面的document点击函数一起执行，导致显示失败*/
     
             });
             $("#select_ff_ul li").click(function(event) {
                 $(this).addClass("actived_li").siblings().removeClass("actived_li"); //点击当前的添加。actived_li这个类；其他的移除这个类名
                 var oliName = $(this).attr("oliName"); //定义一个name属性，获取点击的元素属性赋值到当前，方便动态化传值
                 // var oliId = $(this).attr("oliId"); //定义一个id属性，获取点击的元素属性赋值到当前，方便动态化传值
                 $(this).parent().prev().children('.imitationSelect').val(oliName); //把当前点击的name赋值到显示的input的val里面
                 $(this).parent().prev().children().attr("oliName", oliName); //把当前点击的oliName赋值到显示的input的oliName里面
     
                 //设置字体
                 const elemId = $('.selectBox').parent().parent().attr("data-id");
                 contentList[elemId].obj.setFontFamily($(this).attr("oliName"))
                 myCanvasOne.init(contentList);
             });
             $(document).click(function(event) {
                 $(".inputCase .fa").removeClass("fa-caret-up").addClass("fa-caret-down") //当点隐藏ul弹窗时候，把小图标恢复原状
                 $("#select_ff_ul").hide(); //当点击空白处，隐藏ul弹窗
             });
     
             //字体大小
             $(".selectSize .imitationSelect").on("click", function() {
                 $(this).parent().next().toggle(); //ul弹窗展开
                 $(this).next().toggleClass("fa-caret-up") //点击input选择适合，小图标动态切换
                 if (event.stopPropagation) {
                     // 针对 Mozilla 和 Opera   
                     event.stopPropagation();
                 } else if (window.event) {
                     // 针对 IE   
                     window.event.cancelBubble = true;
                 }
                 /*阻止事件传播，事件从点击的元素出发，向外（window）传播，
                              如果不写个阻止事件，会导致下面的document点击函数一起执行，导致显示失败*/
     
             });
             $(".selectUlSize li").click(function(event) {
                 $(this).addClass("actived_li").siblings().removeClass("actived_li"); //点击当前的添加。actived_li这个类；其他的移除这个类名
                 var oliName = $(this).attr("oliName"); //定义一个name属性，获取点击的元素属性赋值到当前，方便动态化传值
                 var oliId = $(this).attr("oliId"); //定义一个id属性，获取点击的元素属性赋值到当前，方便动态化传值
                 $(this).parent().prev().children().val(oliName); //把当前点击的name赋值到显示的input的val里面
                 $(this).parent().prev().children().attr("oliName", oliName); //把当前点击的oliName赋值到显示的input的oliName里面
     
     
                 //设置字体大小
                 const elemId = $('.selectBox').parent().parent().attr("data-id");
                //  console.log(contentList[elemId])
     
                 contentList[elemId].obj.setFontSize($(this).attr("oliName"))
                 myCanvasOne.init(contentList);
             });
             $(document).click(function(event) {
                 $(".inputCase .fa").removeClass("fa-caret-up").addClass("fa-caret-down") //当点隐藏ul弹窗时候，把小图标恢复原状
                 $(".selectUlSize").hide(); //当点击空白处，隐藏ul弹窗
             });
     
             //加粗
             $('.font-b').click(function() {
                 if (!$(this).hasClass('font-b-active')) {
     
                     //设置字体粗细
                     const elemId = $(this).parent().parent().attr("data-id");
                     contentList[elemId].obj.setFontWeight('900');
                    //  console.log(contentList[elemId].obj)
                     myCanvasOne.init(contentList);
                 } else {
                     //设置字体粗细
                     const elemId = $(this).parent().parent().attr("data-id");
                     contentList[elemId].obj.setFontWeight('500');
                     myCanvasOne.init(contentList);
     
                 }
                 $(this).toggleClass('font-b-active');
     
             });
     
             //倾斜
             $('.font-i').click(function() {
                 if (!$(this).hasClass('font-i-active')) {
     
                     //设置字体粗细
                     const elemId = $(this).parent().parent().attr("data-id");
                     contentList[elemId].obj.setFontStyle('italic');
                    //  console.log(contentList[elemId].obj)
                     myCanvasOne.init(contentList);
                 } else {
                     //设置字体粗细
                     const elemId = $(this).parent().parent().attr("data-id");
                     contentList[elemId].obj.setFontStyle('normal');
                     myCanvasOne.init(contentList);
     
                 }
                 $(this).toggleClass('font-i-active');
             });
     
             //文本文字修改
             $(".str").bind('input propertychange', function() {
                 var a = $(".box1").val();
                 // 设置文字并重新渲染
                 const elemId = $(this).parent().parent().attr("data-id");
                 contentList[elemId].obj.setStr($(this).val())
                 myCanvasOne.init(contentList);
             })  // 拖拽条
             ZUI.silder({
                 elem: '#tr_s',
                 color: '#1E9FFF',
                 pos: '{{sRadius}}%',
                 showNum: true,
                 count: 50,
                 disable: false,
                 callBackMove: function(num) {
                     // 拖拽条数据显示同步
                     $(this.elem).siblings('p').children('.num').text(Math.round(num));
                     // 设置文字弧长并重新渲染
                     const elemId = $(this.elem).parent().parent().attr("data-id");
                     contentList[elemId].obj.setRadius(Math.round(num))
                     myCanvasOne.init(contentList);
                 },
                 callBackMouseup: function(num) {
                     // console.log('up', num);
                 }
             })
             ZUI.silder({
                 elem: '#tarc_s',
                 color: '#1E9FFF',
                 pos: '{{thickness}}%',
                 showNum: true,
                 count: 100,
                 disable: false,
                 callBackMove: function(num) {
                     // 拖拽条数据显示同步
                     $(this.elem).siblings('p').children('.num').text(Math.round(num));
                     // 设置文字弧长并重新渲染
                     const elemId = $(this.elem).parent().parent().attr("data-id");
                     contentList[elemId].obj.setThickness(Math.round(num))
                     myCanvasOne.init(contentList);
                 },
                 callBackMouseup: function(num) {
                     // console.log('up', num);
                 }
             });
             // ZUI.silder({
             //     elem: '#tsp',
             //     color: '#1E9FFF',
             //     pos: '50%',
             //     showNum: true,
             //     count: 50,
             //     disable: false,
             //     callBackMove: function(num) {
             //         $("#tsp").siblings('p').children('.num').text(Math.round(num))
             //             // console.log('move', num);
             //     },
             //     callBackMouseup: function(num) {
             //         // console.log('up', num);
             //     }
             // })`
         } else if (countList[id].type == 'imgShape') {
             var jsImgTemplate = `$('.img-item').click(function() {
                $(".img-box").slideUp();
                $(".item-img").show();
                
                contentList[$(this).parent().attr("data-id")].obj = new imgShape({
                    img:$(this).children("img")[0]
                });
                //渲染画布
                myCanvasOne.init(contentList);
            
                appendEditMenu("#edit_menu", contentList, true, contentList.length - 1);
                
            })`;
             var jsTemplate = `
            // 拖拽条
            ZUI.silder({
                elem: '#tr_img',
                color: '#1E9FFF',
                pos: '{{imgSize}}%',
                showNum: true,
                count: 100,
                disable: false,
                callBackMove: function(num) {
                    // console.log('move', num);
                    // 拖拽条数据显示同步
                    $(this.elem).siblings('p').children('.num').text(Math.round(num));
                    // 设置文字X并重新渲染
                    const elemId = $(this.elem).parent().parent().attr("data-id");
                    contentList[elemId].obj.setSize(Math.round(num)*2+30)
                    myCanvasOne.init(contentList);
                },
                callBackMouseup: function(num) {
                    // console.log('up', num);
                }
            });
            ZUI.silder({
                elem: '#trx_img',
                color: '#1E9FFF',
                pos: '{{x}}%',
                showNum: true,
                count: 100,
                disable: false,
                callBackMove: function(num) {
                    // console.log('move', num);
                    // 拖拽条数据显示同步
                    $(this.elem).siblings('p').children('.num').text(Math.round(num));
                    // 设置文字X并重新渲染
                    const elemId = $(this.elem).parent().parent().attr("data-id");
                    contentList[elemId].obj.setX(Math.round(num))
                    myCanvasOne.init(contentList);
                },
                callBackMouseup: function(num) {
                    // console.log('up', num);
                }
            })
            ZUI.silder({
                elem: '#tarc_img',
                color: '#1E9FFF',
                pos: '{{y}}%',
                showNum: true,
                count: 100,
                disable: false,
                callBackMove: function(num) {
                    // 拖拽条数据显示同步
                    $(this.elem).siblings('p').children('.num').text(Math.round(num));
                    // 设置文字Y并重新渲染
                    const elemId = $(this.elem).parent().parent().attr("data-id");
                    contentList[elemId].obj.setY(Math.round(num))
                    myCanvasOne.init(contentList);
                },
                callBackMouseup: function(num) {
                    // console.log('up', num);
                }
            })
            ZUI.silder({
                elem: '#tsp_img',
                color: '#1E9FFF',
                pos: '{{rotation}}%',
                showNum: true,
                count: 100,
                disable: false,
                callBackMove: function(num) {
                    // 拖拽条数据显示同步
                    $(this.elem).siblings('p').children('.num').text(Math.round(num));
                    // 设置文字旋转并重新渲染
                    const elemId = $(this.elem).parent().parent().attr("data-id");
                    contentList[elemId].obj.setRotation(Math.round(num))
                    myCanvasOne.init(contentList);
                },
                callBackMouseup: function(num) {
                    // console.log('up', num);
                }
            })
            `;
         } else if (countList[id].type == 'rectFrame') {
             var jsTemplate = `ZUI.silder({
                elem: '#tr_w',
                color: '#1E9FFF',
                pos: '{{rWidth}}%',
                showNum: true,
                count: 100,
                disable: false,
                callBackMove: function(num) {
                    // 拖拽条数据显示同步
                    $(this.elem).siblings('p').children('.num').text(Math.round(num));
                    // 设置文字弧长并重新渲染
                    const elemId = $(this.elem).parent().parent().attr("data-id");
                    contentList[elemId].obj.setWidth(Math.round(num)*240/100)
                    myCanvasOne.init(contentList);
                },
                callBackMouseup: function(num) {
                    // console.log('up', num);
                }
            });
            ZUI.silder({
                elem: '#tr_h',
                color: '#1E9FFF',
                pos: '{{rHeight}}%',
                showNum: true,
                count: 100,
                disable: false,
                callBackMove: function(num) {
                    // 拖拽条数据显示同步
                    $(this.elem).siblings('p').children('.num').text(Math.round(num));
                    // 设置文字弧长并重新渲染
                    const elemId = $(this.elem).parent().parent().attr("data-id");
                    contentList[elemId].obj.setHeight(Math.round(num)*240/100)
                    // console.log( contentList[elemId].obj)
                    myCanvasOne.init(contentList);
                },
                callBackMouseup: function(num) {
                    // console.log('up', num);
                }
            });
            ZUI.silder({
                elem: '#tr_x',
                color: '#1E9FFF',
                pos: '{{rX}}%',
                showNum: true,
                count: 100,
                disable: false,
                callBackMove: function(num) {
                    // 拖拽条数据显示同步
                    $(this.elem).siblings('p').children('.num').text(Math.round(num));
                    // 设置文字弧长并重新渲染
                    const elemId = $(this.elem).parent().parent().attr("data-id");
                    contentList[elemId].obj.setX(Math.round(num))
                    myCanvasOne.init(contentList);
                },
                callBackMouseup: function(num) {
                    // console.log('up', num);
                }
            });
            ZUI.silder({
                elem: '#tr_y',
                color: '#1E9FFF',
                pos: '{{rY}}%',
                showNum: true,
                count: 100,
                disable: false,
                callBackMove: function(num) {
                    // 拖拽条数据显示同步
                    $(this.elem).siblings('p').children('.num').text(Math.round(num));
                    // 设置文字弧长并重新渲染
                    const elemId = $(this.elem).parent().parent().attr("data-id");
                    contentList[elemId].obj.setY(Math.round(num))
                    myCanvasOne.init(contentList);
                },
                callBackMouseup: function(num) {
                    // console.log('up', num);
                }
            });`;
         } else {
             var jsTemplate = ``;
         }
         if (countList[id].obj) {

             html += exports.renderTemplate(template, {
                 id: id,
                 str: countList[id].obj.str || '',
                 fontFamliy: countList[id].obj.fontFamliy,
                 fontSize: countList[id].obj.fontSize,
                 radius: countList[id].obj.radius - 10,
                 sRadius: countList[id].obj.radius - 20,
                 start: countList[id].obj.start,
                 end: countList[id].obj.end,
                 x: countList[id].obj.x / 250 * 100,
                 y: countList[id].obj.y / 250 * 100,
                 rotation: countList[id].obj.rotation,
                 thickness: countList[id].obj.thickness,
                 imgSize: countList[id].obj.imgSize / 2,
                 rWidth: countList[id].obj.width / 240 * 100,
                 rHeight: countList[id].obj.height / 240 * 100,
                 rX: countList[id].obj.x - 5,
                 rY: countList[id].obj.y - 5,

             });
             jsTemplate = exports.renderTemplate(jsTemplate, {
                 radius: countList[id].obj.radius - 10,
                 sRadius: countList[id].obj.radius - 20,
                 start: countList[id].obj.start,
                 end: countList[id].obj.end,
                 x: countList[id].obj.x / 250 * 100,
                 y: countList[id].obj.y / 250 * 100,
                 rotation: countList[id].obj.rotation,
                 thickness: countList[id].obj.thickness,
                 imgSize: countList[id].obj.imgSize / 2,
                 rWidth: countList[id].obj.width / 240 * 100,
                 rHeight: countList[id].obj.height / 240 * 100,
                 rX: countList[id].obj.x - 5,
                 rY: countList[id].obj.y - 5,
             })
         } else {
             if (countList[id].type == "imgShape") {
                 html += exports.renderTemplate(imgBox, {
                     id: id,

                 });
                 jsTemplate = exports.renderTemplate(jsImgTemplate, {

                 })
             }
         }


         var child = exports.parseHtml(html);

         dom.appendChild(child);
         exports.loadScriptString(dom, jsTemplate);
     };
     /**
      * 绑定监听事件 暂时先用click
      * @param {String} dom 单个dom,或者selector
      * @param {Function} callback 回调函数
      * @param {String} eventName 事件名
      */
     exports.bindEvent = function(dom, callback, eventName) {
         eventName = eventName || 'click';
         if (typeof dom === 'string') {
             // 选择
             dom = document.querySelectorAll(dom);
         }
         if (!dom) {
             return;
         }
         if (dom.length > 0) {
             for (var i = 0, len = dom.length; i < len; i++) {
                 dom[i].addEventListener(eventName, callback);
             }
         } else {
             dom.addEventListener(eventName, callback);
         }
     };

 })(window.Common = {});