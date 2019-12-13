var img_url = 'http://kreaserv.com/askloud/assets/uploads/';
var api_url = 'http://kreaserv.com/askloud/index.php/api/';

var token = Lockr.get('token');
var email_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
var phone_regex = /^\d{10}$/;
var days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

var category = '';
var subcategory = '';

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

myApp.onPageInit('register', function(page) {
});

myApp.onPageInit('dashboard', function(page) {
    if (token !== undefined) { $(".profile_name").html(token.first_name); }
    load_poll_list();
});

myApp.onPageInit('create_poll', function(page) {
    if (token !== undefined) { $(".profile_name").html(token.first_name); }
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
    if (token !== undefined) { $(".profile_name").html(token.first_name); }
    load_profile_poll_list();
});

myApp.onPageInit('edit_profile', function(page) {
    if (token !== undefined) { $(".profile_name").html(token.first_name); }
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
    if (token !== undefined) { $(".profile_name").html(token.first_name); }
});

myApp.onPageInit('create-a-b', function(page) {
    if (token !== undefined) { $(".profile_name").html(token.first_name); }
});

myApp.onPageInit('create-rating', function(page) {
    if (token !== undefined) { $(".profile_name").html(token.first_name); }
});
