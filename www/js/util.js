document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	myApp.showIndicator();
	user_data = token;

	if (token === undefined) {
        myApp.hideIndicator();
        mainView.router.load({
            url: 'index.html',
        });
    } else {
        myApp.hideIndicator();
        mainView.router.load({
            url: 'category.html',
            query: {
                id: token
            },
            ignoreCache: true,
        });
    }

    document.addEventListener("backbutton", function(e) {
        e.preventDefault();
        var page = myApp.getCurrentView().activePage;
        myApp.hideIndicator();
        image_from_device = '';
        if (page.name == "category" || page.name == "index") {
            myApp.confirm('Are you sure you want to exit the app?', function() {
                navigator.app.clearHistory();
                navigator.app.exitApp();
            });
        } else {
            mainView.router.back({});
        }
    }, false);
}

function logout() {
    Lockr.flush();
    token = false;
    mainView.router.load({
        url: 'index.html',
        ignoreCache: false,
    });
}

function load_poll_list() {
	$("#poll_list_dynamic").html("");

	$.ajax({
		url: api_url+'get_polls_list',
		type: 'POST',
		crossDomain: true,
		data: {
			API_KEY: 'DEV_AZHAR_ASKLOUD',
			category: category_filter,
			subcategory: subcategory_filter,
		}
	}).done(function(res){
		var html = '';
		$.each(res.poll_list, function(index, value){
			html += '<div class="card facebook-card">'+
					'<div class="card-header">'+
					'<div class="facebook-avatar"><img src="https://eruditegroup.co.nz/wp-content/uploads/2016/07/profile-dummy3.png" width="34" height="34"></div>'+
					'<div class="facebook-name">'+value.user_data.first_name+'</div>'+
					'</div>'+
					'<div class="card-content">'+
					'<div class="card-content-inner">'+
					'<p class="font-17">'+value.poll_header+'</p>';
			if (value.poll_type == 1) {
				$.each(value.poll_options, function(i, v){
					var per_val = Number(parseInt((v.poll_count/value.total_poll_count)*100));
					if (isNaN(per_val)) {
						per_val = 0;
					}
					html += '<div class="option_selection options_1 text-center col option'+i+'">'+v.poll_options+' <b>'+per_val+'%</b></div>';
				})
			} else if (value.poll_type == 2) {
				$.each(value.poll_options, function(i, v) {
					var per_val = Number(parseInt((v.poll_count/value.total_poll_count)*100));
					if (isNaN(per_val)) {
						per_val = 0;
					}
					html += '<div class="option_selection options_2 text-center col option'+i+'">'+v.poll_options+' <b>'+per_val+'%</b></div>';
				})
			} else {
				for (var i = 1; i <= 10; i++) {
					if (value.poll_avg >= i) {
						html += '<span class="option_selection text-center col star'+i+' bg-yellow">'+i+'</span>';
					} else {
						html += '<span class="option_selection text-center col star'+i+'">'+i+'</span>';
					}
				}
			}
			
			html += '<p class="color-gray">'+value.created_date+'</p>'+
					'</div>'+
					'</div>'+
					'<div class="card-footer">'+
					'<a href="#" class="open-popup" data-pollid="'+value.id+'">Poll</a>'+
					'<a href="#">No. Of Pollls: <span>'+value.total_poll_count+'</span></a>'+
					'</div>'+
					'</div>';
		})

		$("#poll_list_dynamic").html(html);

		$(".open-popup").click(function(e){
			e.preventDefault();
			$(".question_dynamic").html('');
			$(".question_answers").html('');
			var poll_id = $(this).data('pollid');

			$.ajax({
				url: api_url+'get_poll_details',
				type: 'POST',
				crossDomain: true,
				data: {
					API_KEY: 'DEV_AZHAR_ASKLOUD',
					poll_id: poll_id,
				}
			}).done(function(res){
				if (res.status == 'Success') {
					console.log(res);
					$(".question_dynamic").html(res.question_data.poll_header);

					var anshtml = '';

					if (res.question_data.poll_type == 1) {
						anshtml += '<div>';
						$.each(res.answers_data, function(index, value){
							anshtml += '<span class="option_selection answer_selection queoption12 text-center col bg-red" data-valueid="'+value.id+'">'+value.poll_options+'</span>';
						})
						anshtml += '</div>'+
									'<div>'+
									'<input id="submit_poll_ans" type="hidden" value="">'+
									'<input id="submit_poll_que" type="hidden" value="'+poll_id+'">'+
									'<button class="btn btn-app" onclick="submit_poll_ans();">Submit Poll</button>'+
									'</div>';
					} else if (res.question_data.poll_type == 2) {
						anshtml += '<div>';
						$.each(res.answers_data, function(index, value){
							anshtml += '<span class="option_selection answer_selection queoption12 text-center col bg-red" data-valueid="'+value.id+'">'+value.poll_options+'</span>';
						})
						anshtml += '</div>'+
									'<div>'+
									'<input id="submit_poll_ans" type="hidden" value="">'+
									'<input id="submit_poll_que" type="hidden" value="'+poll_id+'">'+
									'<button class="btn btn-app" onclick="submit_poll_ans();">Submit Poll</button>'+
									'</div>';
					} else {
						anshtml += '<div>'+
									'<span class="option_selection answer_selection text-center col star1">1</span>'+
									'<span class="option_selection answer_selection text-center col star2">2</span>'+
									'<span class="option_selection answer_selection text-center col star3">3</span>'+
									'<span class="option_selection answer_selection text-center col star4">4</span>'+
									'<span class="option_selection answer_selection text-center col star5">5</span>'+
									'<span class="option_selection answer_selection text-center col star6">6</span>'+
									'<span class="option_selection answer_selection text-center col star7">7</span>'+
									'<span class="option_selection answer_selection text-center col star8">8</span>'+
									'<span class="option_selection answer_selection text-center col star9">9</span>'+
									'<span class="option_selection answer_selection text-center col star10">10</span>'+
									'</div>'+
									'<div>'+
									'<input id="submit_poll_ans" type="hidden" value="">'+
									'<input id="submit_poll_que" type="hidden" value="'+poll_id+'">'+
									'<button class="btn btn-app" onclick="submit_poll_ans();">Submit Poll</button>'+
									'</div>';
					}

					$(".question_answers").html(anshtml);
					myApp.popup('.popup-about');

					$(".answer_selection.queoption12").click(function(e){
						$(".answer_selection.queoption12").removeClass('bg-green');
						$(".answer_selection.queoption12").addClass('bg-red');
						$(this).removeClass('bg-red');
						$(this).addClass('bg-green');
						$("#submit_poll_ans").val($(this).data('valueid'));
						e.preventDefault();
					})

					$('.answer_selection.star1').click(function(e){
						e.preventDefault();
						$("#submit_poll_ans").val('1');
						$(".answer_selection").removeClass('bg-yellow');
						$(".answer_selection.star1").addClass('bg-yellow');
					})
					$('.answer_selection.star2').click(function(e){
						e.preventDefault();
						$("#submit_poll_ans").val('2');
						$(".answer_selection").removeClass('bg-yellow');
						$(".answer_selection.star1, .answer_selection.star2").addClass('bg-yellow');
					})
					$('.answer_selection.star3').click(function(e){
						e.preventDefault();
						$("#submit_poll_ans").val('3');
						$(".answer_selection").removeClass('bg-yellow');
						$(".answer_selection.star1, .answer_selection.star2, .answer_selection.star3").addClass('bg-yellow');
					})
					$('.answer_selection.star4').click(function(e){
						e.preventDefault();
						$("#submit_poll_ans").val('4');
						$(".answer_selection").removeClass('bg-yellow');
						$(".answer_selection.star1, .answer_selection.star2, .answer_selection.star3, .answer_selection.star4").addClass('bg-yellow');
					})
					$('.answer_selection.star5').click(function(e){
						e.preventDefault();
						$("#submit_poll_ans").val('5');
						$(".answer_selection").removeClass('bg-yellow');
						$(".answer_selection.star1, .answer_selection.star2, .answer_selection.star3, .answer_selection.star4, .answer_selection.star5").addClass('bg-yellow');
					})
					$('.answer_selection.star6').click(function(e){
						e.preventDefault();
						$("#submit_poll_ans").val('6');
						$(".answer_selection").removeClass('bg-yellow');
						$(".answer_selection.star1, .answer_selection.star2, .answer_selection.star3, .answer_selection.star4, .answer_selection.star5, .answer_selection.star6").addClass('bg-yellow');
					})
					$('.answer_selection.star7').click(function(e){
						e.preventDefault();
						$("#submit_poll_ans").val('7');
						$(".answer_selection").removeClass('bg-yellow');
						$(".answer_selection.star1, .answer_selection.star2, .answer_selection.star3, .answer_selection.star4, .answer_selection.star5, .answer_selection.star6, .answer_selection.star7").addClass('bg-yellow');
					})
					$('.answer_selection.star8').click(function(e){
						e.preventDefault();
						$("#submit_poll_ans").val('8');
						$(".answer_selection").removeClass('bg-yellow');
						$(".answer_selection.star1, .answer_selection.star2, .answer_selection.star3, .answer_selection.star4, .answer_selection.star5, .answer_selection.star6, .answer_selection.star7, .answer_selection.star8").addClass('bg-yellow');
					})
					$('.answer_selection.star9').click(function(e){
						e.preventDefault();
						$("#submit_poll_ans").val('9');
						$(".answer_selection").removeClass('bg-yellow');
						$(".answer_selection.star1, .answer_selection.star2, .answer_selection.star3, .answer_selection.star4, .answer_selection.star5, .answer_selection.star6, .answer_selection.star7, .answer_selection.star8, .answer_selection.star9").addClass('bg-yellow');
					})
					$('.answer_selection.star10').click(function(e){
						e.preventDefault();
						$("#submit_poll_ans").val('10');
						$(".answer_selection").removeClass('bg-yellow');
						$(".answer_selection.star1, .answer_selection.star2, .answer_selection.star3, .answer_selection.star4, .answer_selection.star5, .answer_selection.star6, .answer_selection.star7, .answer_selection.star8, .answer_selection.star9, .answer_selection.star10").addClass('bg-yellow');
					})

				} else {
					myApp.alert(res.api_msg);
				}
			}).fail(function(res){
				myApp.alert('Some technical problem occured, Please try again later!');
			})

		})
		console.log(res);
	}).error(function(res){
		console.log(res);
	})
}

function submit_poll_ans() {
	if (!$("#submit_poll_ans").val()) {
		myApp.alert("Please make valid selection!");
	} else {
		$.ajax({
			url: api_url+'submit_poll',
			type: 'POST',
			crossDomain: true,
			data: {
				API_KEY: 'DEV_AZHAR_ASKLOUD',
				poll_ans: $("#submit_poll_ans").val(),
				poll_que: $("#submit_poll_que").val(),
				user_id: token.id,
			}
		}).done(function(res){
			if (res.status == 'Success') {
				mainView.router.refreshPage();
			} else {
				myApp.alert('Some technical problem occured while submitting your selection!');
			}
		})
	}
}

function goto_question(poll_type) {
	if (!$("#createpoll-category").val()) {
		myApp.alert('Please select category before proceeding');
		return false;
	} else if (!$("#createpoll-subcategory").val()) {
		myApp.alert('Please select category before proceeding');
		return false;
	} else {
		category = $("#createpoll-category").val();
		subcategory = $("#createpoll-subcategory").val();
		if (poll_type == 1) {
	        mainView.router.load({
	            url: 'create-multiple-options.html',
	            query: {
	                poll_type: 1,
	                user_id: token.id,
	            },
	            ignoreCache: true,
	        });
		} else if (poll_type == 2) {
	        mainView.router.load({
	            url: 'create-a-b.html',
	            query: {
	                poll_type: 2,
	                user_id: token.id,
	            },
	            ignoreCache: true,
	        });
		} else if (poll_type == 3) {
	        mainView.router.load({
	            url: 'create-rating.html',
	            query: {
	                poll_type: 3,
	                user_id: token.id,
	            },
	            ignoreCache: true,
	        });
		} else {
			myApp.alert('There some error with the selection, Please select appropriate option!');
		}
	}
}

function add_options_list() {
	var html = 	'<li>'+
                '<div class="item-content">'+
                '<div class="item-inner">'+
                '<div class="item-input item-input-field">'+
                '<input type="text" class="bg-green multiple_selection_option_input" placeholder="New Option">'+
                '</div>'+
                '</div>'+
                '</div>'+
                '</li>';

    $("#option-list-append").append(html);
}

function submit_poll_rating() {
	if (!$("#input_poll_rating_text").val()) {
		myApp.alert('Please enter all poll details');
	} else {
		$.ajax({
			url: api_url+'create_poll',
			type: 'POST',
			crossDomain: true,
			data: {
				API_KEY: 'DEV_AZHAR_ASKLOUD',
				poll_type: 3,
				poll_que: $("#input_poll_rating_text").val(),
				user_id: token.id,
				category_id: category,
				subcategory_id: subcategory,
			}
		}).done(function(res){
			console.log(res);
			if (res.status == 'Success') {
				category = '';
				subcategory = '';
				myApp.alert(res.api_msg);
				mainView.router.load({
		            url: 'category.html',
		            query: {
		                poll_type: 3,
		                user_id: token.id,
		            },
		            ignoreCache: true,
		        });
			} else {
				myApp.alert(res.api_msg);
			}
		}).error(function(res){
			console.log(res);
		})
	}
}

function submit_poll_a_b() {
	if (!$("#input_poll_a_b_text").val()) {
		myApp.alert('Please enter all poll details');
	} else {
		var option_arr = [];

		$.each($(".selection_option_input"), function(index, value){
			option_arr.push($(this).val());
		})

		if (option_arr.length !== 2) {
			myApp.alert('Please enter all poll details');
		} else {
			$.ajax({
				url: api_url+'create_poll',
				type: 'POST',
				crossDomain: true,
				data: {
					API_KEY: 'DEV_AZHAR_ASKLOUD',
					poll_type: 2,
					poll_que: $("#input_poll_a_b_text").val(),
					poll_options: option_arr,
					user_id: token.id,
					category_id: category,
					subcategory_id: subcategory,
				}
			}).done(function(res){
				console.log(res);
				if (res.status == 'Success') {
					category = '';
					subcategory = '';
					myApp.alert(res.api_msg);
					mainView.router.load({
			            url: 'category.html',
			            query: {
			                poll_type: 3,
			                user_id: token.id,
			            },
			            ignoreCache: true,
			        });
				} else {
					myApp.alert(res.api_msg);
				}
			}).error(function(res){
				console.log(res);
			})
		}
	}
}

function submit_poll_multiple_options() {
	if (!$("#input_poll_multiple_options_text").val()) {
		myApp.alert('Please enter all poll details');
		return false;
	} else {
		var option_arr = [];

		$.each($(".multiple_selection_option_input"), function(index, value){
			option_arr.push($(this).val());
		})

		if (option_arr.length < 2) {
			myApp.alert('Please enter all poll details');
		} else {
			$.ajax({
				url: api_url+'create_poll',
				type: 'POST',
				crossDomain: true,
				data: {
					API_KEY: 'DEV_AZHAR_ASKLOUD',
					poll_type: 1,
					poll_que: $("#input_poll_multiple_options_text").val(),
					poll_options: option_arr,
					user_id: token.id,
					category_id: category,
					subcategory_id: subcategory,
				}
			}).done(function(res){
				console.log(res);
				if (res.status == 'Success') {
					category = '';
					subcategory = '';
					myApp.alert(res.api_msg);
					mainView.router.load({
			            url: 'category.html',
			            query: {
			                poll_type: 3,
			                user_id: token.id,
			            },
			            ignoreCache: true,
			        });
				} else {
					myApp.alert(res.api_msg);
				}
			}).error(function(res){
				console.log(res);
			})
		}
	}
}

function login() {
	if (!$("#signin-email").val()) {
		myApp.alert('Please enter your email id!');
		return false;
	} else if (!$("#signin-password").val()) {
		myApp.alert('Please enter your password!');
		return false;
	} else {
		$.ajax({
			url: api_url+'signin',
			type: 'POST',
			crossDomain: true,
			data: {
				API_KEY: 'DEV_AZHAR_ASKLOUD',
				email: $("#signin-email").val(),
				password: $("#signin-password").val()
			}
		}).done(function(res){
			if (res.status == 'Success') {
				Lockr.set('token', res.data);
            	token = res.data;
				mainView.router.load({
		            url: 'category.html',
		        });
			} else {
				myApp.alert(res.api_msg);
				return false;
			}
		}).fail(function(res){
			myApp.alert('Some technical error occured, Please try again later!');
			return false;
		})
	}
}

function register() {
	if (!$("#signup-name").val()) {
		myApp.alert('Please enter your name!');
		return false;
	} else if (!$("#signup-email").val()) {
		myApp.alert('Please enter your email id!');
		return false;
	} else if (!$("#signup-password").val()) {
		myApp.alert('Please enter password!');
		return false;
	} else if (!$("#signup-cpassword").val()) {
		myApp.alert('Please enter confirm password!');
		return false;
	} else if ($("#signup-password").val() !== $("#signup-cpassword").val()) {
		myApp.alert('Password does not match!');
		return false;
	} else if (!$("#signup-contact").val()) {
		myApp.alert('Please enter your contact number!');
		return false;
	} else if (!$("#signup-gender").val()) {
		myApp.alert('Please enter your gender!');
		return false;
	} else if (!$("#signup-dob").val()) {
		myApp.alert('Please enter your date of birth!');
		return false;
	} else if (!$("#signup-verify") == 'YES') {
		myApp.alert('Please verify your Email Id!');
		return false;
	} else {
		$.ajax({
			url: api_url+'signup',
			type: 'POST',
			crossDomain: true,
			data: {
				API_KEY: 'DEV_AZHAR_ASKLOUD',
				name: $("#signup-name").val(),
				email: $("#signup-email").val(),
				password: $("#signup-password").val(),
				cpassword: $("#signup-cpassword").val(),
				contact: $("#signup-contact").val(),
				gender: $("#signup-gender").val(),
				dob: $("#signup-dob").val(),
			}
		}).done(function(res){
			if (res.status == 'Success') {
				Lockr.set('token', res.data);
            	token = res.data;
				mainView.router.load({
		            url: 'category.html',
		        });
			} else {
				myApp.alert(res.api_msg);
				return false;
			}
		}).fail(function(res){
			myApp.alert('Some technical error occured, Please try again later!');
			return false;
		})
	}
}

function update_password() {
	if (!$("#forgot-email").val()) {
		myApp.alert('Please enter your email id!');
		return false;
	} else if (!$("#forgot-password").val()) {
		myApp.alert('Please enter password!');
		return false;
	} else if (!$("#forgot-cpassword").val()) {
		myApp.alert('Please enter confirm password!');
		return false;
	} else if ($("#forgot-password").val() !== $("#forgot-cpassword").val()) {
		myApp.alert('Password does not match!');
		return false;
	} else if (!$("#forgot-verify") == 'YES') {
		myApp.alert('Please verify your Email Id!');
		return false;
	} else {
		$.ajax({
			url: api_url+'update_password',
			type: 'POST',
			crossDomain: true,
			data: {
				API_KEY: 'DEV_AZHAR_ASKLOUD',
				email: $("#forgot-email").val(),
				password: $("#forgot-password").val(),
				cpassword: $("#forgot-cpassword").val(),
			}
		}).done(function(res){
			if (res.status == 'Success') {
				myApp.alert('Password updated successfully!');
				mainView.router.load({
		            url: 'login.html',
		        });
			} else {
				myApp.alert(res.api_msg);
				return false;
			}
		}).fail(function(res){
			myApp.alert('Some technical error occured, Please try again later!');
			return false;
		})
	}
}



function edit_profile() {
	if (!$("#editprofile-name").val()) {
		myApp.alert('Please enter your name!');
		return false;
	} else if (!$("#editprofile-email").val()) {
		myApp.alert('Please enter your email id!');
		return false;
	} else if (!$("#editprofile-contact").val()) {
		myApp.alert('Please enter your contact number!');
		return false;
	} else if (!$("#editprofile-gender").val()) {
		myApp.alert('Please enter your gender!');
		return false;
	} else if (!$("#editprofile-dob").val()) {
		myApp.alert('Please enter your date of birth!');
		return false;
	} else {
		$.ajax({
			url: api_url+'editprofile',
			type: 'POST',
			crossDomain: true,
			data: {
				API_KEY: 'DEV_AZHAR_ASKLOUD',
				id: $("#editprofile-id").val(),
				name: $("#editprofile-name").val(),
				email: $("#editprofile-email").val(),
				contact: $("#editprofile-contact").val(),
				gender: $("#editprofile-gender").val(),
				dob: $("#editprofile-dob").val(),
				city: $("#editprofile-city").val(),
				country: $("#editprofile-country").val(),
			}
		}).done(function(res){
			if (res.status == 'Success') {
				Lockr.set('token', res.data);
            	token = res.data;
				mainView.router.load({
		            url: 'category.html',
		        });
			} else {
				myApp.alert(res.api_msg);
				return false;
			}
		}).fail(function(res){
			myApp.alert('Some technical error occured, Please try again later!');
			return false;
		})
	}
}

function load_profile_poll_list() {
	$("#created_polls, #answered_polls").html("");

	$.ajax({
		url: api_url+'get_profile_polls_list',
		type: 'POST',
		crossDomain: true,
		data: {
			API_KEY: 'DEV_AZHAR_ASKLOUD',
			user_id: token.id,
		}
	}).done(function(res){
		var html = '';
		$.each(res.created_polls, function(index, value){
			html += '<div class="card facebook-card">'+
					'<div class="card-header">'+
					'<div class="facebook-avatar"><img src="https://eruditegroup.co.nz/wp-content/uploads/2016/07/profile-dummy3.png" width="34" height="34"></div>'+
					'<div class="facebook-name">'+value.user_data.first_name+'</div>'+
					'</div>'+
					'<div class="card-content">'+
					'<div class="card-content-inner">'+
					'<p class="font-17">'+value.poll_header+'</p>';

			if (value.poll_type == 1) {
				$.each(value.poll_options, function(i, v){
					var per_val = Number(parseInt((v.poll_count/value.total_poll_count)*100));
					if (isNaN(per_val)) {
						per_val = 0;
					}
					html += '<div class="option_selection options_1 text-center col option'+i+'">'+v.poll_options+' <b>'+per_val+'%</b></div>';
				})
			} else if (value.poll_type == 2) {
				$.each(value.poll_options, function(i, v) {
					var per_val = Number(parseInt((v.poll_count/value.total_poll_count)*100));
					if (isNaN(per_val)) {
						per_val = 0;
					}
					html += '<div class="option_selection options_2 text-center col option'+i+'">'+v.poll_options+' <b>'+per_val+'%</b></div>';
				})
			} else {
				for (var i = 1; i <= 10; i++) {
					if (value.poll_avg >= i) {
						html += '<span class="option_selection text-center col star'+i+' bg-yellow">'+i+'</span>';
					} else {
						html += '<span class="option_selection text-center col star'+i+'">'+i+'</span>';
					}
				}
			}

			html += '<p class="color-gray">'+value.created_date+'</p>'+
					'</div>'+
					'</div>'+
					'<div class="card-footer">'+
					'<a href="#">No. Of Pollls: <span>'+value.total_poll_count+'</span></a>'+
					'</div>'+
					'</div>';
		})

		$("#created_polls").html(html);

		var html = '';

		$.each(res.answered_polls, function(index, value){
			html += '<div class="card facebook-card">'+
					'<div class="card-header">'+
					'<div class="facebook-avatar"><img src="https://eruditegroup.co.nz/wp-content/uploads/2016/07/profile-dummy3.png" width="34" height="34"></div>'+
					'<div class="facebook-name">'+value.user_data.first_name+'</div>'+
					'</div>'+
					'<div class="card-content">'+
					'<div class="card-content-inner">'+
					'<p class="font-17">'+value.poll_header+'</p>';

			if (value.poll_type == 1) {
				$.each(value.poll_options, function(i, v){
					var per_val = Number(parseInt((v.poll_count/value.total_poll_count)*100));
					if (isNaN(per_val)) {
						per_val = 0;
					}
					html += '<div class="option_selection options_1 text-center col option'+i+'">'+v.poll_options+' <b>'+per_val+'%</b></div>';
				})
			} else if (value.poll_type == 2) {
				$.each(value.poll_options, function(i, v) {
					var per_val = Number(parseInt((v.poll_count/value.total_poll_count)*100));
					if (isNaN(per_val)) {
						per_val = 0;
					}
					html += '<div class="option_selection options_2 text-center col option'+i+'">'+v.poll_options+' <b>'+per_val+'%</b></div>';
				})
			} else {
				for (var i = 1; i <= 10; i++) {
					if (value.poll_avg >= i) {
						html += '<span class="option_selection text-center col star'+i+' bg-yellow">'+i+'</span>';
					} else {
						html += '<span class="option_selection text-center col star'+i+'">'+i+'</span>';
					}
				}
			}
					
			html += '<p class="color-gray">'+value.created_date+'</p>'+
					'</div>'+
					'</div>'+
					'<div class="card-footer">'+
					'<a href="#">No. Of Pollls: <span>'+value.total_poll_count+'</span></a>'+
					'</div>'+
					'</div>';

		})

		$("#answered_polls").html(html);
	}).error(function(res){
		console.log(res);
	})
}

function load_category() {
	$.ajax({
		url: api_url+'get_category',
		type: 'POST',
		crossDomain: true,
		data: {
			API_KEY: 'DEV_AZHAR_ASKLOUD',
		}
	}).done(function(res){
		$("#category_dynamic").html('');
		var html = '';
		if (res.status == 'Success') {
			$.each(res.data, function(index, value){
				html += '<li class="card" onclick="load_subcategory_page('+value.id+')">'+
	                        '<div class="card-header">'+value.category_name+'</div>'+
	                        '<div class="card-footer">View Polls</div>'+
	                    '</li>';
			})

			$("#category_dynamic").html(html);
		} else {
			myApp.alert(res.api_msg);
		}
	}).error(function(res){
		myApp.alert('Network Error!');
	})
}

function load_subcategory_page(category_id) {
	category_filter = category_id;

	mainView.router.load({
        url: 'sub-category.html',
    });
}

function load_subcategory() {
	$.ajax({
		url: api_url+'get_sub_category',
		type: 'POST',
		crossDomain: true,
		data: {
			API_KEY: 'DEV_AZHAR_ASKLOUD',
			category_id: category_filter,
		}
	}).done(function(res){
		$("#subcategory_dynamic").html('');
		var html = '';
		if (res.status == 'Success') {
			$.each(res.data, function(index, value){
				html += '<li class="card" onclick="load_polls('+value.id+')">'+
	                        '<div class="card-header">'+value.category_name+'</div>'+
	                        '<div class="card-footer">View Polls</div>'+
	                    '</li>';
			})

			$("#subcategory_dynamic").html(html);
		} else {
			myApp.alert(res.api_msg);
		}
	}).fail(function(res){
		myApp.alert('Network Error!');
	})
}

function load_polls(subcategory_id) {
	subcategory_filter = subcategory_id;

	mainView.router.load({
        url: 'dashboard.html',
    });
}

function load_news() {
	$.ajax({
		url: api_url+'load_news',
		type: 'POST',
		crossDomain: true,
		data: {
			API_KEY: 'DEV_AZHAR_ASKLOUD',
		}
	}).done(function(res){
		$("#news_dynamic").html('');
		var html = '';
		if (res.status == 'Success') {
			$.each(res.data, function(index, value){
				html += '<li class="card" onclick="open_link('+value.link+')">'+
	                        '<div class="card-header">'+value.title+'</div>'+
	                        '<div class="card-content">'+
	                            '<div class="card-content-inner">'+value.desc+'</div>'+
	                        '</div>'+
	                        '<div class="card-footer">Publish Date: '+value.pubDate+'</div>'+
	                    '</li>';
			})

			$("#news_dynamic").html(html);
		} else {
			myApp.alert(res.api_msg);
		}
	}).error(function(res){
		myApp.alert('Network Error!');
	})
}

function open_link(link) {
	window.open(link, '_system');
	return false;
}
