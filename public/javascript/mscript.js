$(document).ready(function(){
        $('#form')
          .form({
            fields: {
              fullname: {
                identifier: 'fullname',
                rules: [
                  {
                    type   : 'empty',
                    prompt : 'יש למלא את השדה ״שם מלא״'
                  }
                ]
              },
               email: {
                identifier: 'email',
                rules: [
                  {
                    type   : 'empty',
                    prompt : 'לא הזנת כתובת אימייל'
                  },
                  {
                    type : 'email',
                    prompt : 'יש להזין כתובת מייל תקינה'
                  }
                ]
              },
              phonenumber: {
                identifier: 'phonenumber',
                rules: [
                  {
                    type   : 'empty',
                    prompt : 'יש למלא מספר טלפון'
                  }
                ]
              },
            }
          });        


    $('#form').submit(function(){
        console.log('starting');
        modifyCss('.ui.dimmer', 'add', 'active');
        var data = {
            fullname: $('.fullname input').val(),
            phonenumber: $('.phonenumber input').val(),
            email: $('.email input').val(),
            content: $('textarea').val()
        };
        $.post($(this).attr('action'), $(this).serialize(), function(res){
            if (!res.is_validated){
                modifyCss('.ui.dimmer', 'remove', 'active');

            }
            else if (res.is_validated) {
                if (res.is_mailed){
                    console.log('success');
                    console.log(res.fullname);
                    sayThanks(res.fullname.toString());
                    modifyCss('.ui.dimmer', 'remove', 'active');
                    clearInputs();
                }
            }
            else if (!res.is_mailed){
                    raiseError(res.fullname.toString(),'אנו מתנצלים על אי הנוחות הזמנית, לא ניתן לשלוח את המידע בשלב זה - אנא נסו מאוחר יותר');
                    modifyCss('.ui.dimmer', 'remove', 'active');
                    console.log('failed to send data error: '+ res.status +', sent: '+res.data); 
            }
            // Don't forget to hide the loading indicator!
        }, "json");

        return false; // prevent default action

    });



    $(".phonenumber input").keypress( function(e) {
        var chr = String.fromCharCode(e.which);
        if ("1234567890".indexOf(chr) < 0 || $(this).val().length > 9)
            return false;
    });

    function modifyCss(selector, action, css_class){
        if (action == 'remove'){
            $(selector).removeClass(css_class);
        }
        else if (action == 'add') {
            $(selector).addClass(css_class);
        }
    }

    function clearInputs(){
        $('input').val('');
        $('textarea').val('');
    }

    function sayThanks(name){
        $('div#success').html('<div class="ui large blue centered message">תודה על פנייתך '+name+ '</div>');
    }
    function raiseError(name, msg){
        $('div#error').html('<div class="ui large error centered message">שלום '+ name + ', '+msg+ '</div>');
    }

    $('.faceb i').hover(function(){
        if ($(this).hasClass('grey')){
            $(this).removeClass('grey');
            $(this).addClass('pink');
        }
        else if ($(this).hasClass('pink')){
            $(this).removeClass('pink');
            $(this).addClass('grey');
        }

    });
});