export default function () {

	$.validator.setDefaults({
	    errorElement: 'span',
	    errorPlacement: function(error, element) {
	      error.addClass('form__error-label');
	      error.appendTo(element.closest('.form__control-wrap'));
	    },
	    highlight: function(element, errorClass, validClass) {
	      $(element).addClass(errorClass).removeClass(validClass);
	    },
	    unhighlight: function(element, errorClass, validClass) {
	      var $input = $(element);

	      if ($input.val() === '') {
	        $input.removeClass(validClass).removeClass(errorClass);
	      } else {
	        $input.removeClass(errorClass).addClass(validClass);
	      }
	    },
	    errorClass: 'is-error',
	    validClass: 'is-valid',
	    ignore: '.is-ignore'
	});

	$.extend($.validator.messages, {
	    required: 'Поле обязательно к заполнению',
	    remote: 'Поле заполнено некорректно',
	    email: 'E-mail некорректен',
	    url: 'URL некорректен',
	    date: 'Некорректная дата',
	    dateISO: 'Введите корректную дату в формате ISO.',
	    number: 'Введите число',
	    digits: 'Введите только цифры',
	    creditcard: 'Введите правильный номер карты',
	    equalTo: 'Введите такое же значение ещё раз',
	    extension: 'Выберите файл с правильным расширением',
	    maxlength: $.validator.format('Введите не больше {0} символов'),
	    minlength: $.validator.format('Введите не меньше {0} символов'),
	    rangelength: $.validator.format('Введите значение длиной от {0} до {1} символов'),
	    range: $.validator.format('Введите число от {0} до {1}'),
	    max: $.validator.format('Введите число, меньшее или равное {0}'),
	    min: $.validator.format('Введите число, большее или равное {0}')
	});

	$('.js-form-validate').each(function(){
        var $this_form = $(this);
        $this_form.validate();
    });

	$('.js-form-validate-ajax').each(function(){
		var $this_form = $(this);

		$this_form.validate({
			submitHandler: function(form) {
				$(form).ajaxSubmit({
					beforeSubmit: function(formData, jqForm, options){
						$this_form.find('input[type=submit], button[type=submit]').prop('disabled', true);
					},

					success: function(responseText, statusText, xhr){

						var responseFromServer =  JSON.parse(responseText);
                        var messages = makeMsgFromArray(responseFromServer.massages);
                        var $mfpContent = $('<div/>').addClass('mfp-content-holder').append(messages);

						$this_form.find('input[type=submit], button[type=submit]').prop('disabled', false);

						$.magnificPopup.open({
							items: {
								type: 'inline',
								src: $mfpContent
							}
						});

						if ( responseFromServer.result) {
							($this_form).resetForm();
						}

					},

					error: function(responseText, statusText, xhr){
						$this_form.find('input[type=submit], button[type=submit]').prop('disabled', false);

						var messages = "Ошибка сервера. Попробуйте повторить попытку позднее";
                        var $mfpContent = $('<div/>').addClass('mfp-content-holder').append(messages);

						$.magnificPopup.open({
							items: {
								type: 'inline',
								src: $mfpContent
							}
						});

					}
				});
				return false;
			}
		});
	});

	$('.js-form-validate-remote').each(function(){

		var $curForm = $(this);

		$curForm.validate({
			rules: {
		        CaptchaInputText: 
		        {
		            remote:$curForm.data('remote-url') + $curForm.serialize()
		        }
		    }, 
		    messages: {
		        CaptchaInputText: 
		        {
		            remote:"Символы введены неправильно"
		        }
		    }
		});
	});

	
	
	$.validator.addMethod("greaterThan", function(value, element, params) {    
	    if (!/Invalid|NaN/.test(new Date(value))) {
	        return new Date(value) > new Date($(params[0]).val());
	    }    
	    return isNaN(value) && isNaN($(params[0]).val()) || (Number(value) > Number($(params[0]).val())); 
	},'Must be greater than {1}.');

	$.validator.addMethod("float-digits", function(value, element, param) {
		if (this.optional(element)) {
			return true;
		}
		if (typeof param === "string") {
			param = new RegExp(param);
		}
		return param.test(value);
	});

	

	function makeMsgFromArray(array){
		var msg = '';

		for ( var i = 0; i <array.length; i++) {
			msg += array[i] + '<br/>';
		}

		return msg;
	};
}