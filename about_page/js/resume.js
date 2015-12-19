/**
 * Created by GuoJunjun on 27.12.14. JunjunGuo.com
 */
jQuery(document).ready(function ($) {

//item trigger
    $('.itemTrigger span').click(function () {
        if ($(this).hasClass('fa fa-plus')) {
            $(this).removeClass('fa fa-plus').addClass('fa fa-minus');
        } else {
            $(this).removeClass('fa fa-minus').addClass('fa fa-plus');
        }
    });
    $('.itemTitle').click(function () {
        $trigger = $(this).parent().parent().find('.itemTrigger span');
        if ($trigger.hasClass('fa fa-plus')) {
            $trigger.removeClass('fa fa-plus').addClass('fa fa-minus');
        } else {
            $trigger.removeClass('fa fa-minus').addClass('fa fa-plus');
        }
    });
    // mouseover function
    $('.movertrigger').mouseover(function () {
        $(this).removeClass('ison').addClass('isoff');
    })
        .mouseout(function () {
                      $(this).removeClass('isoff').addClass('ison');
                  });
});

