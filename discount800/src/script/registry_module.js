import {} from "https://cdn.bootcdn.net/ajax/libs/jquery/1.12.4/jquery.js";
const $phone = $('#phone');
const $password = $('#password');
const $repass = $('#repass');
const $confirm = $('#confirm');
const $go = $('#go');
const $sbm = $('#confirm');
const $form = $('form');
var $aphone = true;
var $apass = true;
var $arepass = true;
$go.on('submit', function() {

    if ($sbm.prop('checked') == false) {
        $sbm.siblings('span').html('请确认您已看过并同意《用户协议》').css('color', 'red')
    }
    if ($phone.val() === '') {
        $phone.css('border', '1px solid red').siblings('span').html('手机号码格式错误').css('color', 'red');
        $aphone = false;
    }
    if ($password.val() === '') {
        $password.css('border', '1px solid red').siblings('span').html('密码不能为空').css('color', 'red');
        $apass = false;
    }
    if ($repass.val() === '') {
        $repass.css('border', '1px solid red').siblings('span').html('密码不能为空').css('color', 'red');
        $arepass = false;
    }
    if (!$aphone || !$apass || !$arepass || !$sbm.prop('checked')) {
        return false;
    }
})
$sbm.on("change", function() {
        console.log($sbm.prop('checked'))
        if (!$sbm.prop('checked')) {
            $sbm.prop('checked', false)
            $sbm.siblings('span').html('请确认您已看过并同意《用户协议》').css('color', 'red')
        } else {
            $sbm.prop('checked', true)
            $sbm.siblings('span').html('')
        }

    })
    //手机栏失去焦点
$phone.on('blur', function() {
        if ($phone.val() !== '') {
            let $reg = /^1[35789]\d{9}$/
            if ($reg.test($phone.val())) {
                $.ajax({
                    type: 'post',
                    url: 'http://10.31.165.23//discount800/php/reg.php',
                    data: {
                        checkname: $phone.val()
                    }
                }).done(function(data) {

                    if (data === 'true') {
                        $phone.css('border', '1px solid red').siblings('span').html('该手机号已存在').css('color', 'red');
                        $aphone = false;

                    } else if (data === 'false') {
                        $phone.css('border', '1px solid green').siblings('span').html('');
                        $aphone = true;
                    }
                })
            } else {
                $phone.css('border', '1px solid red').siblings('span').html('手机号码格式错误').css('color', 'red');
                $aphone = false;
            }
        } else {
            $phone.css('border', '1px solid red').siblings('span').html('手机号码不能为空').css('color', 'red');
            $aphone = false;
        }
    })
    //手机栏点击
$phone.on('focus', function() {
    $phone.css('border', '#333').siblings('span').html('为了您的账户安全，请填写常用手机号').css('color', '#999')
});

//密码
$password.on('input', function() {

    let $reg1 = /^\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])(?=\S*[!@#$%^&*? ])\S*$/;
    if ($reg1.test($(this).val())) {
        $password.css('border', '1px solid green');
        $apass = true;
    } else {
        $password.css('border', '1px solid red').siblings('span').html('包括最少1个大写字母、小写字母、数字、特殊字符')
        $apass = false;
    }

})
$password.on('blur', function() {
    if ($password.val() !== '') {
        if ($apass) {
            $password.css('border', '1px solid green').siblings('span').html('');
            $apass = true;
        }
    } else {
        $password.css('border', '1px solid red').siblings('span').html('密码不能为空').css('color', 'red');
        $apass = false;
    }
})

//确认密码
$repass.on('blur', function() {
    if ($repass.val() !== '') {
        if ($repass.val() === $password.val()) {
            $repass.css('border', '1px solid green').siblings('span').html('');
            $arepass = true;
        } else {
            $repass.css('border', '1px solid red').siblings('span').html('密码不一致').css('color', 'red');
            $arepass = false;
        }
    } else {
        $repass.css('border', '1px solid red').siblings('span').html('密码不能为空').css('color', 'red');
        $arepass = false;
    }
})