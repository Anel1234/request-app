var connection;

$(document).ready(function () {
    console.log('App starting!');
    ko.applyBindings(new userMessageViewModel());
})

function userMessageViewModel() {
    var self = this;
    self.userName = ko.observable("");
    self.userMessage = ko.observable("");
    self.messageHistory = ko.observableArray([]);

    submitMessage = function (data, event) {
        if (event.key == "Enter") {
            var messageObject = {
                "userName": self.userName(),
                "message": self.userMessage(),
                "datetime": new Date()
            }
            connection.send(JSON.stringify(messageObject));
            self.userMessage("");
        }
    }

    userNameSubmitted = function() {
        connection = new WebSocket('ws://127.0.0.1:1337');
        connection.onmessage = function (message) {
            // try to parse JSON message. Because we know that the server
            // always returns JSON this should work without any problem but
            // we should make sure that the massage is not chunked or
            // otherwise damaged.
            try {
                var json = JSON.parse(message.data);
                self.messageHistory.push(json);
                console.log(json);
                console.log(self.messageHistory());
            } catch (e) {
                console.log('Invalid JSON: ', message.data);
                return;
            }
        }
    
        $('#userNameSubmit').hide();
        $('#userInputArea').show();
    }

}

