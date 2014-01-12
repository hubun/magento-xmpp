var BOSH_SERVICE = 'http://localhost/http-bind';
var connection = null;

function onConnect(status)
{
    if (status == Strophe.Status.CONNECTING) {
	alert('Strophe is connecting.');
    } else if (status == Strophe.Status.CONNFAIL) {
        alert('Strophe failed to connect.');
    } else if (status == Strophe.Status.DISCONNECTING) {
        alert('Strophe is disconnecting.');
    } else if (status == Strophe.Status.DISCONNECTED) {
        alert('Strophe is disconnected.');
    } else if (status == Strophe.Status.CONNECTED) {
        alert('Strophe is connected.');
	    connection.addHandler(onMessage, null, 'message', null, null,  null);
	    connection.send($pres().tree());
    }
}

function onMessage(msg) {
    var to = msg.getAttribute('to');
    var from = msg.getAttribute('from');
    var type = msg.getAttribute('type');
    var elems = msg.getElementsByTagName('body');

    if (type == "chat" && elems.length > 0) {
	var body = elems[0];

	log('ECHOBOT: I got a message from ' + from + ': ' + 
	    Strophe.getText(body));
    
	var reply = $msg({to: from, from: to, type: 'chat'})
            .cnode(Strophe.copyElement(body));
	connection.send(reply.tree());

	log('ECHOBOT: I sent ' + from + ': ' + Strophe.getText(body));
    }

    // we must return true to keep the handler alive.  
    // returning false would remove it after it finishes.
    return true;
}

jQuery(document).ready(function () {
    connection = new Strophe.Connection(BOSH_SERVICE);

    // Uncomment the following lines to spy on the wire traffic.
    //connection.rawInput = function (data) { log('RECV: ' + data); };
    //connection.rawOutput = function (data) { log('SEND: ' + data); };

    // Uncomment the following line to see all the debug output.
    //Strophe.log = function (level, msg) { log('LOG: ' + msg); };
    connection.connect('user','password', onConnect);
});
