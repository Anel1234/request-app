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
                "datetime": new Date(),
                "history": true
            }
            connection.send(JSON.stringify(messageObject));
            self.userMessage("");
        }
    }

    userNameSubmitted = function () {

        connection = new WebSocket('ws://127.0.0.1:1337');
        connection.onmessage = function (message) {
            // try to parse JSON message. Because we know that the server
            // always returns JSON this should work without any problem but
            // we should make sure that the massage is not chunked or
            // otherwise damaged.
            //try {
                console.log(message);
                var json = JSON.parse(message.data);
                json.forEach(function(obj) {                   
                    obj.data.datetime = moment(obj.data.datetime).format("DD/MM/YY hh:mm")  
                    self.messageHistory.push(obj.data);
                    console.log(obj.data);
                })
                //json.data.datetime = moment(json.datatime).format("DD/MM/YY hh:mm")
                // self.messageHistory.push(json);
                // console.log(json);

                // console.log(self.messageHistory());
            // } catch (e) {
            //     console.log('Invalid JSON: ', message.data);
            //     return;
            // }
        }

        connection.onopen = function (message) {
            var messageObject = {
                "history": false
            }
            connection.send(JSON.stringify(messageObject));

        }

        $('#userNameSubmit').hide();
        $('#userInputArea').show();
    }
}