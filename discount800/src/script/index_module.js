import {} from "https://cdn.bootcdn.net/ajax/libs/jquery/1.12.4/jquery.js";
import {} from "../script/jquery.lazyload.js";
//渲染
const $list = $('.discounts_details ul');
$.ajax({
    url: 'http://10.31.165.23/discount800/php/index1.php',
    dataType: 'json'
}).done(function(data) {
    let $arrdata = data.pagecontent;
    let $strhtml = '';
    $.each($arrdata, function(index, value) {
        $strhtml += `
                <li>
                    <a href="http://10.31.165.23/discount800/src/detail.html?sid=${value.sid}">
                        <img class='lazy' data-original="${value.picurl}" alt="" >
                        <div>
                        <p>${value.title}</p><span>${value.date}</span>
                        </div>
                        <span>￥${value.price}</span>
                    </a>
                 </li>
                `;

    });
    $list.html($strhtml);
    $('img.lazy').lazyload({
        effect: "fadeIn",
        threshold: 200,
        container: $(".discounts_details ul")

    }).removeClass("lazy");
});

//轮播图
const $banner = $('.banner');
const $piclist = $('.banner ul li');
const $btnlist = $('.banner ol li');
const $leftarrow = $('#leftarrow');
const $rightarrow = $('#rightarrow');

let $index = 0;
let $timer = null;

function tabswitch() {
    $btnlist.eq($index).addClass('active').siblings('ol li').removeClass('active');
    $piclist.eq($index).stop(true).animate({
        opacity: 1
    }).siblings('ul li').stop(true).animate({
        opacity: 0
    });
}


$btnlist.on('mouseover', function() {
    $index = $(this).index();
    tabswitch();
});
$rightarrow.on('click', function() {
    $index++;
    if ($index > $btnlist.length - 1) {
        $index = 0;
    }
    tabswitch();
});


$leftarrow.on('click', function() {
    $index--;
    if ($index < 0) {
        $index = $btnlist.length - 1;
    }
    tabswitch();
    $('title').html($index);
});

$timer = setInterval(function() {
    $rightarrow.click();
}, 3000);

$banner.hover(function() {
    clearInterval($timer);
}, function() {
    $timer = setInterval(function() {
        $rightarrow.click();
    }, 3000);
});

//顶部悬浮
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
    if ($top >= 700) {
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

//购物车商品数量
if  (localStorage.getItem('localsid'))  {    
    let  arrsid  =  localStorage.getItem('localsid').split(',');    
    $("#num").html(arrsid.length);    
    $(".tab-top a #num").html(arrsid.length);
} 
else  {    
    $("#num").html(0);    
    $(".tab-top a #num").html(0);
}



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