export default function () {

	$('.js-form-validate').each(function(){
       
        var $this_form = $(this);
		
        $this_form.validate();
    });

	$('.js-form-validate-ajax').each(function(){
		var $this_form = $(this);

		$this_form.validate({

			errorPlacement: function(error, element) {
	            error.appendTo(element.closest('.form__row'));
	        },

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

	function makeMsgFromArray(array){
		var msg = '';

		for ( var i = 0; i <array.length; i++) {
			msg += array[i] + '<br/>';
		}

		return msg;
	};
	
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
}