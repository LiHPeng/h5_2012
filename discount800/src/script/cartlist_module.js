import {} from 'https://cdn.bootcdn.net/ajax/libs/jquery/1.12.4/jquery.js';



if (localStorage.getItem('localsid') && localStorage.getItem('localnum')) {
    let arrsid = localStorage.getItem('localsid').split(',');
    let arrnum = localStorage.getItem('localnum').split(',');
    for (let i = 0; i < arrsid.length; i++) {
        renderList(arrsid[i], arrnum[i]);
    }

}

function renderList(sid, num) {
    $.ajax({
        url: 'http://10.31.165.23/data2012/projectname/php/alldata.php',
        dataType: 'json'
    }).done(function(data) {
        $.each(data, function(index, value) {
            if (value.sid === sid) {
                let $clonebox = $('.goods-item:hidden').clone(true, true);
                $clonebox.find('.goods-pic img').attr('src', value.picurl);
                $clonebox.find('.goods-pic img').attr('sid', value.sid);
                $clonebox.find('.goods-d-info a').html(value.title);
                $clonebox.find('.b-price strong').html(value.price);
                $clonebox.find('.quantity-form input').val(num);
                $clonebox.find('.b-sum strong').html((value.price * num).toFixed(2));
                $clonebox.css('display', 'block');
                $('.item-list').append($clonebox);

                allprice(); //计算总价
            }
        })
    });
}

function allprice() {
    let $allnum = 0; //存储商品的数量
    let $allprice = 0; //存储商品的总价
    $('.goods-item:visible').each(function(index, element) { //遍历多个元素对象，index:索引   element:元素的元素对象。
        //$(this):当前操作的商品列表goods-item
        if ($(this).find('.cart-checkbox input').prop('checked')) { //判断当前的商品列表前面的复选框是否是选中的
            $allnum += parseInt($(this).find('.quantity-form input').val());
            $allprice += parseInt($(this).find('.b-sum strong').html());
        }
    });

    $('.amount-sum em').html($allnum); //赋值总的数量
    $('.totalprice').html('￥' + $allprice); //赋值总的价格
}


//5.全选
$('.allsel').on('click', function() {
    $('.goods-item:visible').find('input:checkbox').prop('checked', $(this).prop('checked'));
    $('.allsel').prop('checked', $(this).prop('checked'));
    allprice();
});


$('.item-list').on('click', 'input:checkbox', function() {
    if ($('.goods-item:visible').find('input:checkbox').length === $('.goods-item:visible').find('input:checked').length) {
        $('.allsel').prop('checked', true);
    } else {
        $('.allsel').prop('checked', false);
    }
    allprice();
});

// 6.数量的改变
$('.quantity-add').on('click', function() {
    let $num = $(this).parents('.goods-item').find('.quantity-form input').val();
    $num++;
    $(this).parents('.goods-item').find('.quantity-form input').val($num);

    $(this).parents('.goods-item').find('.b-sum strong').html(singleprice($(this))); //计算单价以及赋值
    allprice(); //计算总价

    localStorageData($(this)); //重新将数量添加到本地存储
});

$('.quantity-down').on('click', function() {
    let $num = $(this).parents('.goods-item').find('.quantity-form input').val();
    $num--;
    if ($num <= 1) {
        $num = 1
    }
    $(this).parents('.goods-item').find('.quantity-form input').val($num);
    $(this).parents('.goods-item').find('.b-sum strong').html(singleprice($(this))); //计算单价以及赋值
    allprice(); //计算总价
    localStorageData($(this)); //重新将数量添加到本地存储
});

$('.quantity-form input').on('input', function() {
    let $reg = /^\d+$/; //行首行尾匹配一个或者多个数字
    if (!$reg.test($(this).val())) { //如果不满足条件，值为1
        $(this).val(1);
    }
    $(this).parents('.goods-item').find('.b-sum strong').html(singleprice($(this))); //计算单价以及赋值
    allprice(); //计算总价
    localStorageData($(this)); //重新将数量添加到本地存储
});

//封装函数实现小计的改变
function singleprice(obj) { //obj:当前操作的元素对象。
    let $price = obj.parents('.goods-item').find('.b-price strong').html(); //单价
    let $num = obj.parents('.goods-item').find('.quantity-form input').val(); //数量
    return ($price * $num).toFixed(2); //保留2位小数
}






let $arrsid = []; //存储的商品编号
let $arrnum = []; //存储商品的数量

function getLocalStorage() {
    if (localStorage.getItem('localsid') && localStorage.getItem('localnum')) { //商品已经存储过
        $arrsid = localStorage.getItem('localsid').split(','); //将获取的编号转换成数组，方便后面判断是否存在当前编号。
        $arrnum = localStorage.getItem('localnum').split(',');
    } else {
        $arrsid = [];
        $arrnum = [];
    }
}


function localStorageData(obj) { //obj:当前操作的元素对象。
    getLocalStorage(); //获取本地存储，将其转换成数组。
    let $index = obj.parents('.goods-item').find('.goods-pic img').attr('sid'); //获取对应的sid  
    $arrnum[$arrsid.indexOf($index)] = obj.parents('.goods-item').find('.quantity-form input').val(); //根据sid将对应的新的数量赋值给数组,重新存储。
    localStorage.setItem('localnum', $arrnum); //本地存储
}


//8.删除购物车商品列表
$('.b-action a').on('click', function() {
    let $this = $(this);
    if (window.confirm('你确定要删除吗?')) {
        $this.parents('.goods-item').remove();
        delstorage($arrsid, $(this).parents('.goods-item').find('.goods-pic img').attr('sid'));
        allprice(); //计算总价
    }
});

$('.operation a').on('click', function() {
    if (window.confirm('你确定要删除吗?')) {
        $('.goods-item:visible').each(function(index, element) {
            if ($(this).find('.cart-checkbox input').is(':checked')) { //找到复选框，是否是选中的，如果是返回true
                $(this).remove();
                delstorage($arrsid, $(this).find('.goods-pic img').attr('sid'));
                allprice(); //计算总价
            }
        });
    }
});



function delstorage(arrsid, sid) { //arrsid:数组   sid:数组中对应的值
    getLocalStorage(); //将获取的本地存储的值转换成数组
    let $index = -1; //存储索引的
    $.each(arrsid, function(index, valuesid) {
        if (valuesid == sid) {
            $index = index; //满足条件的值对应的索引赋值给$index
        }
    });

    //获取对应的索引进行删除。
    $arrsid.splice($index, 1);
    $arrnum.splice($index, 1);

    //重新设置本地存储。
    localStorage.setItem('localsid', $arrsid);
    localStorage.setItem('localnum', $arrnum);
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

//购物车
function down() {
    if  (localStorage.getItem('localsid'))  {    
        let  arrsid  =  localStorage.getItem('localsid').split(',');    
        $(".toolbar_l ul li #num").html(arrsid.length);    
    } 
    else  {    
        $(".toolbar_l ul li #num").html(0);    
    }
};
down();