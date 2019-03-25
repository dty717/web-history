function ready(func) {
	if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading') {
		func();
	} else {
		document.addEventListener('DOMContentLoaded', func);
	}
}
function getLocalIPs(callback) {
    var ips = [];

    var RTCPeerConnection = window.RTCPeerConnection ||
        window.webkitRTCPeerConnection || window.mozRTCPeerConnection;

    var pc = new RTCPeerConnection({
        // Don't specify any stun/turn servers, otherwise you will
        // also find your public IP addresses.
        iceServers: []
    });
    // Add a media line, this is needed to activate candidate gathering.
    pc.createDataChannel('');
    
    // onicecandidate is triggered whenever a candidate has been found.
    pc.onicecandidate = function(e) {
        if (!e.candidate) { // Candidate gathering completed.
            pc.close();
            callback(ips);
            return;
        }
        var ip = /^candidate:.+ (\S+) \d+ typ/.exec(e.candidate.candidate)[1];
        if (ips.indexOf(ip) == -1) // avoid duplicate entries (tcp/udp)
            ips.push(ip);
    };
    pc.createOffer(function(sdp) {
        pc.setLocalDescription(sdp);
    }, function onerror() {});
}


ready(function () {
    // Example (using the function below).
    getLocalIPs(function(ips) { // <!-- ips is an array of local IP addresses.
        var url="https://127.0.0.1:8443/web/history";
        var pc="Laptop"
        for(var i=0;i<ips.length;i++){
            if(ips[i]=="192.168.2.100"){
                url="https://192.168.2.101:8443/web/history"
                pc="Desktop";
                break;
            }
        }
        $.ajax({
            url: url,
            type: 'POST',
            data: {href:window.location.href,pc:pc,title:document.title},
            cache: false,
            success: function (response) {
                console.log(response);
            }
        });
        
    });

});