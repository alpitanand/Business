$(function () {
    $('.event').click(function (e) {
        e.preventDefault();

        $.ajax({
            url: '/eventname/selfie',
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