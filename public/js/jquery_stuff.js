
(function($){
// Uplaod
// ============================================
  
// Form jquery
// ============================================
    var panels2 = $('.vote-results2');
    var panels = $('.vote-results');
    var panelsButton = $('#dropdown-results');
    panels.hide();
    panels2.hide();
    //Click close
    $('#upload_document').click(function() {
		panels2.fadeIn('slow');
	});
	$('#close2').click(function() {
		panels2.fadeOut('slow');
	})
    $('#cancel2').click(function() {
		panels2.fadeOut('slow');
	})
    $('#close').click(function() {
		panels.fadeOut('slow');
	})
    $('#cancel').click(function() {
		panels.fadeOut('slow');
	})
    //Click dropdown
    panelsButton.click(function() {
		panels.fadeIn('slow');
    //panels.show();
        //get data-for attribute
        var dataFor = $(this).attr('data-for');
        var idFor = $(dataFor);

        //current button
        var currentButton = $(this);
        idFor.slideToggle(400, function() {
            //Completed slidetoggle
            if(idFor.is(':visible'))
            {
                currentButton.html('Hide Results');
            }
            else
            {
                currentButton.html('View Results');
            }
        })
    });
})(jQuery);
