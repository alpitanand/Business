$(function(){
    $('.lovebtn').click(function (e){
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
                    console.log(parseInt($('#love-data').text()))
                    $('#love-data').html(parseInt($('#love-data').text())+1)
                    $('.scoreCard').html(parseFloat($('.scoreCard').text())+1)      
                }
                else if(data=="downvoted"){
                    console.log(data);
                    var x = url_value.split('/')[1];
                    console.log(parseInt($('#love-data').text()))
                    $('#love-data').html(parseInt($('#love-data').text())-1)
                    $('.scoreCard').html(parseFloat($('.scoreCard').text())-1)    
                }
                else if(data=="downLaugh"){
                    console.log(data);
                    var x = url_value.split('/')[1];
                    $('#laugh-data').html(parseInt($('#laugh-data').text())-1) 
                    $('#love-data').html(parseInt($('#love-data').text())+1)
                    $('.scoreCard').html(parseFloat($('.scoreCard').text())+.5)   
                }
                else if(data=="downSad"){
                    console.log(data);
                    var x = url_value.split('/')[1];
                    $('#downvote-data').html(parseInt($('#downvote-data').text())-1) 
                    $('#love-data').html(parseInt($('#love-data').text())+1)
                    $('.scoreCard').html(parseFloat($('.scoreCard').text())+2)       
                }
                
            },
            error: function () {
                console.log("Not been liked");
              }
        })
    })
})

$(function(){
    $('.hahabtn').click(function (e){
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
                    console.log(parseInt($('#laugh-data').text()))
                    $('#laugh-data').html(parseInt($('#laugh-data').text())+1)
                    $('.scoreCard').html(parseFloat($('.scoreCard').text())+.5)       
                }
                else if(data=="notlaughed"){
                    console.log(data);
                    var x = url_value.split('/')[1];
                    console.log(parseInt($('#laugh-data').text()))
                    $('#laugh-data').html(parseInt($('#laugh-data').text())-1)
                    $('.scoreCard').html(parseFloat($('.scoreCard').text())-(0.5))     
                }
                else if(data=="downLove"){
                    console.log(data);
                    var x = url_value.split('/')[1];
                    $('#laugh-data').html(parseInt($('#laugh-data').text())+1) 
                    $('#love-data').html(parseInt($('#love-data').text())-1)
                    $('.scoreCard').html(parseFloat($('.scoreCard').text())-.5)       
                }
                   else if(data=="downSad"){
                    console.log(data);
                    var x = url_value.split('/')[1];
                    $('#downvote-data').html(parseInt($('#downvote-data').text())-1) 
                    $('#laugh-data').html(parseInt($('#laugh-data').text())+1)
                    $('.scoreCard').html(parseFloat($('.scoreCard').text())+1.5)       
                }
            },
            error: function () {
                console.log("Not been liked");
              }
        })
    })
})

$(function(){
    $('.downbtn').click(function (e){
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
                    console.log(parseInt($('#downvote-data').text()))
                    $('#downvote-data').html(parseInt($('#downvote-data').text())+1)
                    $('.scoreCard').html(parseFloat($('.scoreCard').text())-1)       
                }
                else if(data=="notSad"){
                    console.log(data);
                    var x = url_value.split('/')[1];
                    console.log(parseInt($('#downvote-data').text()))
                    $('#downvote-data').html(parseInt($('#downvote-data').text())-1)
                    $('.scoreCard').html(parseFloat($('.scoreCard').text())+1)      
                }
                else if(data=="downLove"){
                    console.log(data);
                    var x = url_value.split('/')[1];
                    $('#downvote-data').html(parseInt($('#downvote-data').text())+1) 
                    $('#love-data').html(parseInt($('#love-data').text())-1)
                    $('.scoreCard').html(parseFloat($('.scoreCard').text())-2)       
                }
                   else if(data=="downLaugh"){
                    console.log(data);
                    var x = url_value.split('/')[1];
                    $('#laugh-data').html(parseInt($('#laugh-data').text())-1) 
                    $('#downvote-data').html(parseInt($('#downvote-data').text())+1)
                    $('.scoreCard').html(parseFloat($('.scoreCard').text())- 1.5)       
                }
            },
            error: function () {
                console.log("Not been liked");
              }
        })
    })
})
