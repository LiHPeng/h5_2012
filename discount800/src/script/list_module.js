//引入jquery模块
import {} from "https://cdn.bootcdn.net/ajax/libs/jquery/1.12.4/jquery.js";

//引入懒加载模块
import {} from "../script/jquery.lazyload.js";

//引入分页的模块
import {} from "./jquery.pagination.js";
/* 
    一.图片懒加载的使用。
    1.给图片对象设置宽高。
    2.给图片对象添加一个类 -> class='lazy';
    3.将图片对象src属性 -> data-original
    4.添加js代码执行懒加载动作。
    二.分页插件的使用
    1.引入css和js文件，分页插件非常多，选择的是pagination插件。
    2.分页思路
    前端引入对应的css和js
    前端需要将对应的页面传递给后端。

 	$('.page').pagination({
        pageCount: 3, //总的页数
        jump: true, //是否开启跳转到指定的页数，布尔值。
        prevContent: '上一页', //将图标改成上一页下一页。
        nextContent: '下一页',
        callback: function(api) {
            console.log(api.getCurrent()); //获取当前的点击的页码。
        }
    });
*/

//渲染
const $list = $('.list ul');
let $page = null;

//排序的操作-设置初始变量
let $array = []; //排序后的数组
let $array_default = []; //排序前的数组
let $prev = 0; //上一个价格
let $next = 0; //下一个价格

$.ajax({
    url: 'http://10.31.165.23/discount800/php/list.php',
    dataType: 'json'
}).done(function(data) {
    $page = data.pagesize;
    let $arrdata = data.pagecontent; //获取初始的数据。
    let $strhtml = '';
    $.each($arrdata, function(index, value) {
        $strhtml += `
            <li>
                <a href="http://10.31.165.23/discount800/src/detail.html?sid=${value.sid}">
                    <img class='lazy' data-original="${value.picurl}" alt="" width="200" height="200">
                    <p>${value.title}</p><em>${value.date}<em>
                    <span>￥${value.price}</span>
                </a>
            </li>
        `;
    });
    $list.html($strhtml); //追加

    //第一页进行排序
    //将所以的li添加到数组中。
    //重新重置数组
    $array = []; //排序后的数组
    $array_default = []; //排序前的数组

    $('.list li').each(function(index, element) {
        $array[index] = $(this);
        $array_default[index] = $(this); //保留初始状态
    });





    //添加懒加载
    $('img.lazy').lazyload({
        effect: "fadeIn" //切换形式
    });





    //分页 - 点击分页触发
    $('.page').pagination({
        pageCount: $page, //总的页数
        jump: false, //是否开启跳转到指定的页数，布尔值。
        prevContent: '上一页', //将图标改成上一页下一页。
        nextContent: '下一页',
        callback: function(api) { //包含当前点击的分页的页码
            // console.log(api.getCurrent()); //获取当前的点击的页码。

            //将获取的页面传递给后端
            $.ajax({
                url: 'http://10.31.165.23/discount800/php/list.php',
                data: {
                    page: api.getCurrent() //将页码传递给后端。
                },
                dataType: 'json'
            }).done(function(data) {
                let $arrdata = data.pagecontent; //获取初始的数据。
                let $strhtml = '';
                $.each($arrdata, function(index, value) {
                    $strhtml += `
                        <li>
                            <a href="http://10.31.165.23/discount800/src/detail.html?sid=${value.sid}">
                                <img class='lazy' data-original="${value.picurl}" alt="" width="200" height="200">
                                <p>${value.title}</p><em>${value.date}<em>
                                <span>￥${value.price}</span>
                            </a>
                        </li>
                    `;
                });
                $list.html($strhtml); //追加


                //分页也要重排
                $array = []; //排序后的数组
                $array_default = []; //排序前的数组

                $('.list li').each(function(index, element) {
                    $array[index] = $(this);
                    $array_default[index] = $(this); //保留初始状态
                });



                //添加懒加载
                $('img.lazy').lazyload({
                    effect: "fadeIn" //切换形式
                });
            });
        }
    });
});



//排序 - 点击按钮事件 - 冒泡排序(相邻的两两比较)
$('button').eq(0).on('click', function() {
    $.each($array_default, function(index, value) { //value:每一个li元素
        $list.append(value); //append相当于appendChild,逐个追加
    });
    return;
});
$('button').eq(1).on('click', function() {
    for (let i = 0; i < $array.length - 1; i++) {
        for (let j = 0; j < $array.length - i - 1; j++) {
            $prev = parseFloat($array[j].find('span').html().substring(1)); //第一个价格
            $next = parseFloat($array[j + 1].find('span').html().substring(1)); //第二个价格
            if ($prev > $next) { //交换位置。
                let temp = $array[j];
                $array[j] = $array[j + 1];
                $array[j + 1] = temp;
            }
        }
    }

    $.each($array, function(index, value) { //value:每一个li元素
        $list.append(value); //append相当于appendChild,逐个追加
    });
});

$(window).on('scroll', function() {
    let $top = $(window).scrollTop();
    if ($top >= 200) {
        $('.top_nav').stop(true).animate({
            top: 0
        });
    } else {
        $('.top_nav').stop(true).animate({
            top: -80
        });
    }
});

//楼梯
let $return_top = $('.return_top');

function scroll() {
    let $top = $(window).scrollTop();
    if ($top >= 300) {
        $return_top.css('display', 'block');
    } else {
        $return_top.css('display', 'none');
    }
};
scroll();
$(window).on('scroll', function() {
    scroll();
});
//点击回到顶部
$('.go_top ').on('click', function() {
    $("html,body").animate({ scrollTop: '0px' }, 500);
})


//登录推出
const $unlogin = $('.unlogin');
const $logined = $('.latent');
const $quit = $('.quit');
const $name = $('.login_name');
if (window.localStorage.getItem('loginname')) {
    $logined.show();
    $unlogin.hide();
    $name.html(window.localStorage.getItem('loginname'));
}
$quit.on('click', function() {
    $logined.hide();
    $unlogin.show();
    window.localStorage.removeItem('loginname'); //删除本地存储
});

//购物车
if  (localStorage.getItem('localsid'))  {    
    let  arrsid  =  localStorage.getItem('localsid').split(',');    
    $("#num").html(arrsid.length);    
    $(".tab-top a #num").html(arrsid.length);
} 
else  {    
    $("#num").html(0);    
    $(".tab-top a #num").html(0);
}