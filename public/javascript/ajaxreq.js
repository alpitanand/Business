// $(function () {
//     $('.event').click(function (e) {
//         e.preventDefault();

//         $.ajax({
//             url: '/events/selfie',
//             type: 'GET',
//             success: function () {
//                 console.log("logged in");
//             },
//             error: function () {
//                 var btn = document.querySelector('#fblogin');
//                 tippy(btn, {
//                     size: 'large',
//                     distance: 25
//                 })
//                 btn._tippy.show();

//             }
//         });
//     })
// })



$(function(){
    $('.like').click(function (e){
        e.preventDefault();
        var url_value= $(this).attr("href");
        $.ajax({
            url:$(this).attr("href"),
            type:'GET',
            success:function(data){
                console.log(data);
                if(data=="upvoted"){
                    console.log(data);
                    var x = url_value.split('/')[1];
                    console.log(parseInt($('#'+x).text()))
                    $('#'+x).html(parseInt($('#'+x).text())+1)       
                }
                else if(data=="downvoted"){
                    console.log(data);
                    var x = url_value.split('/')[1];
                    console.log(parseInt($('#'+x).text()))
                    $('#'+x).html(parseInt($('#'+x).text())-1)      
                }
                else if(data=="downLaugh"){
                    console.log(data);
                    var x = url_value.split('/')[1];
                    $('#'+x+"laugh").html(parseInt($('#'+x+"laugh").text())-1) 
                    $('#'+x).html(parseInt($('#'+x).text())+1)       
                }
                else if(data=="downSad"){
                    console.log(data);
                    var x = url_value.split('/')[1];
                    $('#'+x+"sad").html(parseInt($('#'+x+"sad").text())-1) 
                    $('#'+x).html(parseInt($('#'+x).text())+1)       
                }
                 
            },
            error: function () {
              console.log("Not been liked");
            }
        })
    })
})

$(function(){
    $('.haha').click(function (e){
        e.preventDefault();
        var url_value= $(this).attr("href");
        $.ajax({
            url:$(this).attr("href"),
            type:'GET',
            success:function(data){
                console.log(data);
                if(data=="laughed"){
                    console.log(data);
                    var x = url_value.split('/')[1];
                    console.log(parseInt($('#'+x).text()))
                    $('#'+x+"laugh").html(parseInt($('#'+x+"laugh").text())+1)       
                }
                else if(data=="notlaughed"){
                    console.log(data);
                    var x = url_value.split('/')[1];
                    console.log(parseInt($('#'+x).text()))
                    $('#'+x+"laugh").html(parseInt($('#'+x+"laugh").text())-1)      
                }
                else if(data=="downLove"){
                    console.log(data);
                    var x = url_value.split('/')[1];
                    $('#'+x).html(parseInt($('#'+x).text())-1) 
                    $('#'+x+"laugh").html(parseInt($('#'+x+"laugh").text())+1)       
                }
                   else if(data=="downSad"){
                    console.log(data);
                    var x = url_value.split('/')[1];
                    $('#'+x+"sad").html(parseInt($('#'+x+"sad").text())-1) 
                    $('#'+x+"laugh").html(parseInt($('#'+x+"laugh").text())+1)       
                }
            },
            error: function () {
              console.log("Not been liked");
            }
        })
    })
})

$(function(){
    $('.downvote').click(function (e){
        e.preventDefault();
        var url_value= $(this).attr("href");
        $.ajax({
            url:$(this).attr("href"),
            type:'GET',
            success:function(data){
                console.log(data);
                if(data=="sad"){
                    console.log(data);
                    var x = url_value.split('/')[1];
                    console.log(parseInt($('#'+x).text()))
                    $('#'+x+"sad").html(parseInt($('#'+x+"sad").text())+1)       
                }
                else if(data=="notSad"){
                    console.log(data);
                    var x = url_value.split('/')[1];
                    console.log(parseInt($('#'+x).text()))
                    $('#'+x+"sad").html(parseInt($('#'+x+"sad").text())-1)      
                }
                else if(data=="downLove"){
                    console.log(data);
                    var x = url_value.split('/')[1];
                    $('#'+x).html(parseInt($('#'+x).text())-1) 
                    $('#'+x+"sad").html(parseInt($('#'+x+"sad").text())+1)       
                }
                   else if(data=="downLaugh"){
                    console.log(data);
                    var x = url_value.split('/')[1];
                    $('#'+x+"sad").html(parseInt($('#'+x+"sad").text())+1) 
                    $('#'+x+"laugh").html(parseInt($('#'+x+"laugh").text())-1)       
                }
            },
            error: function () {
              console.log("Not been liked");
            }
        })
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

