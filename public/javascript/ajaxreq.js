$(function () {
    $('.event').click(function (e) {
        e.preventDefault();

        $.ajax({
            url: '/events/selfie',
            type: 'GET',
            success: function () {
                console.log("logged in");
            },
            error: function () {
                var btn = document.querySelector('#fblogin');
                tippy(btn, {
                    size: 'large',
                    distance: 25
                })
                btn._tippy.show();

            }
        });
    })
})


$(function () {
    $('#upload-form').click(function (e) {
        e.preventDefault();

        $.ajax({
            url: '/events/upload',
            type: 'POST',
            data: new FormData($('form')[0]),
            cache: false,
            contentType: false,
            processData: false,
            success: function () {
                console.log("Uploded");
            },
            error: function () {
               console.log("Not uploded");
            }
        });
    })
})

