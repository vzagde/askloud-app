var img_url = 'http://kreaserv.com/askloud/assets/uploads/';
var api_url = 'http://kreaserv.com/askloud/index.php/api/';

var token = Lockr.get('token');
var email_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
var phone_regex = /^\d{10}$/;
var days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

var category = '';
var subcategory = '';

var category_filter = '';
var subcategory_filter = '';

var myApp = new Framework7({
    // swipePanel: 'left',
    material: true,
    preloadPreviousPage: false,
    uniqueHistory: true,
    uniqueHistoryIgnoreGetParameters: true,
    modalTitle: 'Pettato',
    imagesLazyLoadPlaceholder: 'img/lazyload.jpg',
    imagesLazyLoadThreshold: 50,
    statusbar: {
        iosOverlaysWebView: true,
    },
});

var mainView = myApp.addView('.view-main', {});

myApp.onPageInit('index', function(page) {
});

myApp.onPageInit('login', function(page) {
});

myApp.onPageInit('forgot-password', function(page) {
    $("#forgot-email").on('change', function(e){
        if ($("#forgot-email").val() == $("#forgot-verify-email").val()) {
        } else {
            $("#forgot-verify").val('NO');
            $("#forgot-verify-email").val('');
        }
    })

    $(".forgot_send_otp").click(function(e){
        e.preventDefault();
        if (!$("#forgot-email").val()) {
            myApp.alert('Please enter your Email Id');
            return false;
        } else if (!$("#forgot-email").val().match(email_regex)) {
            myApp.alert('Please enter valid Email Id');
            return false;
        } else {
            $.ajax({
                url: api_url+'generate_otp',
                type: 'POST',
                crossDomain: true,
                data: {
                    API_KEY: "DEV_AZHAR_ASKLOUD",
                    email: $("#forgot-email").val(),
                }
            }).done(function(res){
                if (res.status == 'Success') {
                    myApp.alert(res.api_msg);
                } else {
                    myApp.alert(res.api_msg);
                }
            })
        }
    })

    $(".forgot_verify_otp").click(function(e){
        e.preventDefault();

        if (!$("#forgot-email").val()) {
            myApp.alert('Please enter your Email Id');
            return false;
        } else if (!$("#forgot-email").val().match(email_regex)) {
            myApp.alert('Please enter valid Email Id');
            return false;
        } else if (!$("#forgot-otp").val()) {
            myApp.alert('Please enter OTP');
            return false;
        } else {
            $.ajax({
                url: api_url+'verify_otp',
                type: 'POST',
                crossDomain: true,
                data: {
                    API_KEY: "DEV_AZHAR_ASKLOUD",
                    email: $("#forgot-email").val(),
                    otp: $("#forgot-otp").val(),
                }
            }).done(function(res){
                if (res.status == 'Success') {
                    myApp.alert(res.api_msg);
                    $("#forgot-verify").val('YES');
                    $("#forgot-verify-email").val($("#forgot-email").val());
                } else {
                    myApp.alert(res.api_msg);
                }
            })
        }
    })
});

myApp.onPageInit('register', function(page) {
    $("#signup-email").on('change', function(e){
        if ($("#signup-email").val() == $("#signup-verify-email").val()) {
        } else {
            $("#signup-verify").val('NO');
            $("#signup-verify-email").val('');
        }
    })

    $(".send_otp").click(function(e){
        e.preventDefault();
        if (!$("#signup-email").val()) {
            myApp.alert('Please enter your Email Id');
            return false;
        } else if (!$("#signup-email").val().match(email_regex)) {
            myApp.alert('Please enter valid Email Id');
            return false;
        } else {
            $.ajax({
                url: api_url+'generate_otp',
                type: 'POST',
                crossDomain: true,
                data: {
                    API_KEY: "DEV_AZHAR_ASKLOUD",
                    email: $("#signup-email").val(),
                }
            }).done(function(res){
                if (res.status == 'Success') {
                    myApp.alert(res.api_msg);
                } else {
                    myApp.alert(res.api_msg);
                }
            })
        }
    })

    $(".verify_otp").click(function(e){
        e.preventDefault();

        if (!$("#signup-email").val()) {
            myApp.alert('Please enter your Email Id');
            return false;
        } else if (!$("#signup-email").val().match(email_regex)) {
            myApp.alert('Please enter valid Email Id');
            return false;
        } else if (!$("#signup-otp").val()) {
            myApp.alert('Please enter OTP');
            return false;
        } else {
            $.ajax({
                url: api_url+'verify_otp',
                type: 'POST',
                crossDomain: true,
                data: {
                    API_KEY: "DEV_AZHAR_ASKLOUD",
                    email: $("#signup-email").val(),
                    otp: $("#signup-otp").val(),
                }
            }).done(function(res){
                if (res.status == 'Success') {
                    myApp.alert(res.api_msg);
                    $("#signup-verify").val('YES');
                    $("#signup-verify-email").val($("#signup-email").val());
                } else {
                    myApp.alert(res.api_msg);
                }
            })
        }
    })
});

myApp.onPageInit('dashboard', function(page) {
    if (token !== undefined) { $(".profile_name").html(token.first_name); $(".profile_username").html(token.status); }
    load_poll_list();
});

myApp.onPageInit('news', function(page) {
    if (token !== undefined) { $(".profile_name").html(token.first_name); $(".profile_username").html(token.status); }
    load_news();
});

myApp.onPageInit('category', function(page) {
    if (token !== undefined) { $(".profile_name").html(token.first_name); $(".profile_username").html(token.status); }
    load_category();
});

myApp.onPageInit('subcategory', function(page) {
    if (token !== undefined) { $(".profile_name").html(token.first_name); $(".profile_username").html(token.status); }
    load_subcategory();
});

myApp.onPageInit('create_poll', function(page) {
    if (token !== undefined) { $(".profile_name").html(token.first_name); $(".profile_username").html(token.status); }
    $("#createpoll-category").html('');
    $("#createpoll-subcategory").html('');
    $.ajax({
        url: api_url+'get_category',
        type: 'POST',
        crossDomain: true,
    }).done(function(res){
        var html = '<option value="">Select Category</option>';
        $.each(res.data, function(index, value){
            html += '<option value="'+value.id+'">'+value.category_name+'</option>';
        })

        $("#createpoll-category").html(html);
    })

    $("#createpoll-category").on('change', function(e){
        e.preventDefault();
        $("#createpoll-subcategory").html('');
        if ($("#createpoll-category").val()) {
            $.ajax({
                url: api_url+'get_sub_category',
                type: 'POST',
                crossDomain: true,
                data: {
                    category_id: $("#createpoll-category").val(),
                }
            }).done(function(res){
                var html = '<option value="">Select Category</option>';
                $.each(res.data, function(index, value){
                    html += '<option value="'+value.id+'">'+value.category_name+'</option>';
                })

                $("#createpoll-subcategory").html(html);
            })
        }
    })
});

myApp.onPageInit('profile', function(page) {
    if (token !== undefined) { $(".profile_name").html(token.first_name); $(".profile_username").html(token.status); }
    load_profile_poll_list();
});

myApp.onPageInit('edit_profile', function(page) {
    if (token !== undefined) { $(".profile_name").html(token.first_name); $(".profile_username").html(token.status); }
    $("#editprofile-id").val(token.id);
    $("#editprofile-name").val(token.first_name);
    $("#editprofile-email").val(token.email);
    $("#editprofile-contact").val(token.phone);
    $("#editprofile-gender").val(token.gender);
    $("#editprofile-dob").val(token.dob);
    $("#editprofile-city").val(token.city);
    $("#editprofile-country").val(token.country);
});

myApp.onPageInit('create-multiple-options', function(page) {
    if (token !== undefined) { $(".profile_name").html(token.first_name); $(".profile_username").html(token.status); }
});

myApp.onPageInit('create-a-b', function(page) {
    if (token !== undefined) { $(".profile_name").html(token.first_name); $(".profile_username").html(token.status); }
});

myApp.onPageInit('create-rating', function(page) {
    if (token !== undefined) { $(".profile_name").html(token.first_name); $(".profile_username").html(token.status); }
});
