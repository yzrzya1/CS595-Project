$(function ($) {
    // alert("in jQuery");
    var socket = io.connect();
    var nickForm = $('#setNick');
    var nickError = $('#nickError');
    var nickBox = $('#nickname');
    var messageBtn = $('#btn-chat');
    var messageBox = $('#btn-input');
    var users = $('#users');
    var chat = $('#chat');
    var usersList = $("usersList");
    var login = "false";
    var panelbody = $('#panel-body');
    var usersList = $('#usersList');
    var currentUser = '';



    // This function handles the Keyboards ENTER key, We need this because user could click the SUBMIT button but also can just hit ENTER key      
    $(document).keypress(function (e) {
        if (e.which == 13) {
            if (login == "true") {
                socket.emit('send_message', messageBox.val());
                messageBox.val("");
            } else {
                e.preventDefault();
                socket.emit('new_user', nickBox.val(), function (data) {
                    if (data) {
                        $('#nickWrap').hide();
                        $('#contentWrap').show();
                        login = "true";
                        currentUser = nickBox.val();

                    } else {
                        nickError.html("<p><font size='3' color='white'> " + "That user name is already taken !. Try again" + "</font></p>")
                    }
                });
                nickBox.val("");
            }
        }
    });


    // This function handles the users entry of Nick name
    nickForm.submit(function (e) {
        e.preventDefault();
        socket.emit('new_user', nickBox.val(), function (data) {
            if (data) {
                $('#nickWrap').hide();
                $('#contentWrap').show();
                login = "true";
            } else {
                nickError.html("That user name is already taken !. Try again")
            }
        });
        nickBox.val("");
    });

    messageBtn.click(function (e) {
        //    e.preventDefault();
        socket.emit('send_message', messageBox.val());
        messageBox.val("");
    });


    // This function handles the arrival for new message from the server
    socket.on('new_message', function (data) {
        // construct the message with face icon for the chat    
        /*
                if(currentUser != data.user){
                  console.log('you');
                var messageYou = "<li class='right clearfix'>"
                              +"<div class='chat-body clearfix'><p class='bubble you'>"
                              +  data.data 
                              + "</p><div style='float:right;'><strong class='right primary-font'>"
                              + data.user 
                              +"</strong>" 
                              
                              + " <img height='30' width='30' src='img/avatar3.png' alt='User Avatar' class='img-circle'></div>"

                              +"</div></li> ";
                chat.append(messageYou);
                }else{
                  console.log('me');
                  */
        var messageMe = "<li class='left clearfix'><span class='chat-img pull-left'><img height='30' width='30' src='img/avatar3.png' alt='User Avatar' class='img-circle'></span><div class='chat-body clearfix'><div class='header'><strong class='pull-left primary-font'>" + data.user + "</strong></div><p class='bubble me'>" + data.data + "</p></div></li> ";

        // Now add the message to the Chat Panel                          
        chat.append(messageMe);
        // }

        // This makes sure the vertical scroller is always at the bottom
        setTimeout(function () {
            panelbody.scrollTop(panelbody[0].scrollHeight);
        }, 1);
    });
    socket.on('usernames', function (data) {

        var item = "<li id='header' class='list-group-item'><span class='badge'></span> *  Current Users * </li>";

        for (i = 0; i < data.length; i++) {

            item += "<li class='list-group-item'><span class='chat-img pull-left'><img height='20' width='20' src='img/avatar3.png' alt='User Avatar' class='img-circle'></span><span class='badge'>Online</span> " + data[i] + "</li>";

        }

        usersList.html(item);
        //$("#usersList").append(item);

    });



});

$(window).on('beforeunload', function () {
    socket.close();
});