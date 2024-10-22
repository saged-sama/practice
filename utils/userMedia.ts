export async function getUserMediaStream(videoEnabled: boolean, audioEnabled: boolean): Promise<MediaStream> {
    const stream = await navigator.mediaDevices.getUserMedia({video: videoEnabled, audio: audioEnabled});
    return stream;
}

export async function addVideoTrack(stream: MediaStream) {
    const videoStream = await navigator.mediaDevices.getUserMedia({video: true});
    stream.addTrack(videoStream.getVideoTracks()[0]);
}

export async function addAudioTrack(stream: MediaStream) {
    const audioStream = await navigator.mediaDevices.getUserMedia({audio: true});
    stream.addTrack(audioStream.getAudioTracks()[0]);
}

export function removeVideoTrack(stream: MediaStream) {
    stream.getVideoTracks().forEach(track =>{
        track.stop();
        stream.removeTrack(track);
    });
}

export function removeAudioTrack(stream: MediaStream) {
    stream.getAudioTracks().forEach(track =>{
        track.stop();
        stream.removeTrack(track);
    });
}

export function removeTrack(stream: MediaStream){
    stream.getTracks().forEach(track =>{
        track.stop();
        stream.removeTrack(track);
    });
}