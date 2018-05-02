$(document).ready(function(){
    $('#submitUser').click(function(){
        let valid = true,
            name = $('#name'),
            email = $('#email'),
            password = $('#password'),
            password2 = $('#password2');

        $('.red-text').remove();

        if (name.val().trim() == "") {
            let span = $('<span class="red-text text-darken-1 helper-text">');
            span.text('Name is required')
            name.after(span);
            valid = false;
        }

        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.val().trim())) {
            let span = $('<span class="red-text text-darken-1 helper-text">');
            span.text('Email is not valid')
            email.after(span);
            valid = false;
        }

        if (password.val().trim().length < 6) {
            let span = $('<span class="red-text text-darken-1 helper-text">');
            span.text('Password should be at least 6 chars long')
            password.after(span);
            valid = false;
        }

        if (password2.val().trim() !== password.val().trim()) {
            let span = $('<span class="red-text text-darken-1 helper-text">');
            span.text('Passwords do not match')
            password2.after(span);
            valid = false;
        }

        if(!valid) return false;

        const data = {
            name: name.val().trim(),
            email: email.val().trim(),
            password: password.val().trim(),
            password2: password2.val().trim()
        }

        let captchaValue = $('#g-recaptcha-response').val()

        $.post('/users/captcha', {'g-recaptcha-response': captchaValue}, (res) => {
            if(res.success == 0) {
                console.log("fail")
            } else {
                $.post('/users/register', data, function(res){
                    if(res.error){ 
                        let span = $('<span class="red-text text-darken-1 helper-text">').text(res.error);
                        email.after(span);
                        email.focus();
                    } else {
                        window.location.href = "/users/login";
                    }
                })
            }   
        })
    })
})