import {} from "https://cdn.bootcdn.net/ajax/libs/jquery/1.12.4/jquery.js";

// 点击登录按钮，将用户名和密码传输给后端
const $btn = $('.btn');
const $mobile = $('.mobile'); //手机号
const $passworde = $('.passworde'); //密码
const $hint = $('.hint_pas'); //密码框提示文字
const $hint_mob = $('.hint_mob'); //手机框提示文字
let $flag = true;
$btn.on('click', function() {


    if ($mobile.val() === '') {
        $hint_mob.html('手机号不能为空');
        $flag = false;
    }
    if ($passworde.val() === '') {
        $hint.html('密码不能为空');
        $flag = false;
    }
    if (!$flag) {
        return false;
    } else {
        $.ajax({
            type: 'post',
            url: 'http://10.31.165.23/discount800/php/login.php',
            data: {
                user: $mobile.val(),
                pass: $passworde.val()
            }
        }).done(function(data) {
            if (data === 'true') {
                console.log(data);
                window.localStorage.setItem('loginname', $mobile.val());
                location.href = 'index1.html';
            } else {
                $hint.html('手机号或密码错误');
                $passworde.val('');
            }
        })
    }


});
//点击改变