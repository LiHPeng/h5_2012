import {} from 'https://cdn.bootcdn.net/ajax/libs/jquery/1.12.4/jquery.js';

//2.在详情页面获取商品的sid - 列表传入一个sid到详情页。
let $sid = location.search.substring(1).split('=')[1];

// 如果sid不存在，默认sid为1
if (!$sid) {
    $sid = 1;
}
const $imgbox = $('#img'); //图盒子
const $smallpic = $('#img img'); //图
const $title = $('.title'); //标题
const $loadpcp = $('.loadpcp'); //价格
const $list = $('.ullist ul') //放小图

const $onbox = $('.join_box a') //加入购物车按钮
const $overlay = $('.overlay')

let $lilenth = 0; //所有li的个数
let $liwidth = 0; //li的宽度

$.ajax({
    url: 'http://10.31.165.23/data2012/projectname/php/getsid.php',
    data: {
        datasid: $sid
    },
    dataType: 'json'
}).done(function(data) {
    $smallpic.attr('src', data.picurl);
    $title.html(data.title);
    $loadpcp.html(data.price);
    let $picarr = data.piclisturl.split(',');
    let $strHtml = '';
    $.each($picarr, function(index, value) {
        $strHtml += `
            <li>
                <img src="${value}"/>
            </li>
        `;
        $list.html($strHtml);
    });
    $list.on('click', 'li', function() {
        let $url = $(this).find('img').attr('src');
        $smallpic.attr('src', $url);
    });


});
let $arrsid = [];
let $arrnum = [];

function getLocalStorage() {
    if (localStorage.getItem('localsid') && localStorage.getItem('localnum')) {
        $arrsid = localStorage.getItem('localsid').split(',');
        $arrnum = localStorage.getItem('localnum').split(',');
    } else {
        $arrsid = [];
        $arrnum = [];
    }
}
const $join = $('.submit .join_box a');
const $count = $('.ipt_val');
$join.on('click', function() {
    $('.overlay').css('display', 'block');
    getLocalStorage()
    if ($arrsid.includes($sid)) {
        let $index = $arrsid.indexOf($sid);
        $arrnum[$index] = parseInt($arrnum[$index]) + parseInt($count.val());
        localStorage.setItem('localnum', $arrnum);
    } else {
        $arrsid.push($sid);
        localStorage.setItem('localsid', $arrsid);
        $arrnum.push($count.val());
        localStorage.setItem('localnum', $arrnum);
    }
    down();
});

//修改数量
$('.right').on('click', function() {
    let $num = $(this).parents('.amount').find('.ipt_val').val();
    $num++;
    $(this).parents('.amount').find('.ipt_val').val($num);
    getLocalStorage($(this));
});

$('.left').on('click', function() {
    let $num = $(this).parents('.amount').find('.ipt_val').val();
    $num--;
    if ($num <= 1) {
        $num = 1
    }
    $(this).parents('.amount').find('.ipt_val').val($num);

    getLocalStorage($(this));
});

//input判断
$('.ipt_val').on('input', function() {
    let $reg = /^\d+$/;
    if (!$reg.test($(this).val())) {
        $(this).val(1);
    }
})

//楼梯
let $return_top = $('.return_top');

function scroll() {
    let $top = $(window).scrollTop();
    if ($top >= 100) {
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
// 购物车

function down() {
    if  (localStorage.getItem('localsid'))  {    
        let  arrsid  =  localStorage.getItem('localsid').split(',');    
        $("#num").html(arrsid.length);    
        $(".tab-top a #num").html(arrsid.length);
    } 
    else  {    
        $("#num").html(0);    
        $(".tab-top a #num").html(0);
    }
};
down()

//隐藏盒子
$('.overlay_box span').on('click', function() {
    $('.overlay').css('display', 'none');
})