const socket = io('/')
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true

var peer = new Peer(undefined, {
    path: "/peerjs",
    host: "/",
    port: "443"
});


let myVideoStream
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream)
    
    peer.on('call', (call) => {
        // console.log("peer call")
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
    console.log("I'm in userVideoStream")

            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', (userId) => {
    // console.log("I'm in user-connected")

        connectToNewUser(userId, stream);
    })
 
})

let text_msg = $('input')
$('html').keydown( e => {
    if(e.which == 13 && text_msg.val().length !== 0){
        socket.emit('message', text_msg.val())
        text_msg.val('')
    }
})

socket.on('createMessage', message => {
    $("ul").append(`<li class="message"><b>user</b><br/>${message}</li>`);
    scrollToBottom();
})

const scrollToBottom = () => {
    let d = $('.main_chat_window')
    d.scrollTop(d.prop('scrollHeight'))
}


socket.on('connect', () => {
    console.log('Connected to server');
});
socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

peer.on('open', (id) => {
    socket.emit('join-room', ROOM_ID, id)
})

const connectToNewUser = (userId, stream) => {
    
    const call = peer.call(userId, stream)
    // console.log("I'm in connectToNewUser")
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
    // console.log("I'm in 72")

        addVideoStream(video, userVideoStream)
    })
}

const addVideoStream = (video, stream) => {
    // console.log("I'm in addVideoStream")
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video);
}

const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    // console.log(myVideoStream)
    if(enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setMuteButton();
    } else {
        myVideoStream.getAudioTracks()[0].enabled = true;
        setUnmuteButton();
    }
}

const setMuteButton = () => {
    const muteButton = `<i class="fas fa-microphone"></i>
                            <span>Mute</span>` 
    document.querySelector('.main_mute_button').innerHTML = muteButton
}
const setUnmuteButton = () => {
    const UnmuteButton = `<i class="unmute fas fa-microphone-slash"></i>
                            <span>Unmute</span>` 
    document.querySelector('.main_mute_button').innerHTML = UnmuteButton
}


const playStop = () => {
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    // console.log(myVideoStream)
    if(enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setStopButton();
    } else {
        myVideoStream.getVideoTracks()[0].enabled = true;
        setPlayButton();
    }
}

const setPlayButton = () => {
    const stopButton = `<i class="fas fa-video"></i>
                            <span>Stop Video</span>` 
    document.querySelector('.main_video_button').innerHTML = stopButton
}
const setStopButton = () => {
    const playButton = `<i class="unmute fas fa-video-slash"></i>
                            <span>Play Video</span>` 
    document.querySelector('.main_video_button').innerHTML = playButton
}