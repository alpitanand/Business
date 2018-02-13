
$(function () {
    $('#selfielogin').click(function (e) {
        console.log("alpit");
        e.preventDefault();
    
        $.ajax({
            url: '/selfie',
            type: 'GET',
            success: function () {
                console.log("*********************");
            },
            error: function() {
                var btn = document.querySelector('#fblogin');
                tippy(btn,{
                    theme: 'light',
                    arrow: true,
                    size: 'large'
                   
                })
                btn._tippy.show();
                
             }
         });
    })
})


