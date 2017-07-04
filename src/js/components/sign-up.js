export default function () {

    $('.js-sign-up').each(function(){
        var $signUpForm = $(this),
            $signUpClose = $signUpForm.find('.js-sign-up__close'),
            $signUpOpen  = $signUpForm.find('.js-sign-up__open');

            $signUpClose.click(function(){
                $signUpForm.removeClass('open');
                $signUpOpen.removeClass('hidden-button');
            });

            $signUpOpen.click(function(e){
                e.preventDefault();
                $signUpForm.addClass('open');
                $signUpOpen.addClass('hidden-button');
            });
    });

    $('.js-sign-up').each(function(){
        var $this = $(this);
        var $this_form = $this.find('form');

        $this_form.validate({

            errorPlacement: function(error, element) {
                error.appendTo(element.closest('.form__row'));
            },

            submitHandler: function(form) {
                $(form).ajaxSubmit({
                    beforeSubmit: function(formData, jqForm, options){
                        $this_form.addClass('submitted');
                        $this_form.find('input[type=submit], button[type=submit]').prop('disabled', true);
                    },
                    
                    success: function(responseText, statusText, xhr){

                        var responseFromServer =  JSON.parse(responseText);
                        var messages = makeMsgFromArray(responseFromServer.massages);
                        var $responseElem = $this.find('.js-sign-up__response');

                        $this_form.removeClass('submitted');
                        $this_form.find('input[type=submit], button[type=submit]').prop('disabled', false);

                        $responseElem.html(messages).addClass(responseFromServer.result);
                        $this_form.addClass('hidden');

                    },

                    error: function(responseText, statusText, xhr){

                        var $responseElem = $this.find('.js-sign-up__response');

                        $this_form.removeClass('submitted');
                        $this_form.find('input[type=submit], button[type=submit]').prop('disabled', false);

                        $responseElem.html("Ошибка сервера. Попробуйте повторить попытку позднее").addClass('error');
                        $this_form.addClass('hidden');

                    }
                });
                return false;
            }
        });
    });
    
    $('.js-open-form').click(function(){
		$($(this).attr('href')).addClass('open');
		
		return false;
    });

    function makeMsgFromArray(array){
        var msg = '';

        for ( var i = 0; i <array.length; i++) {
            msg += array[i] + '<br/>';
        }

        return msg;
    };
}