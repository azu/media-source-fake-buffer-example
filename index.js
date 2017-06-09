// LICENSE : MIT
"use strict";
var video = document.querySelector('video');

var assetURL = 'frag_bunny.mp4';
// Need to be specific for Blink regarding codecs
// ./mp4info frag_bunny.mp4 | grep Codec
var mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';

if ('MediaSource' in window && MediaSource.isTypeSupported(mimeCodec)) {
    var _MediaSource = window.MediaSource || window.webKitMediaSource;
    var mediaSource = new _MediaSource();
    //console.log(mediaSource.readyState); // closed
    video.src = URL.createObjectURL(mediaSource);
    mediaSource.addEventListener('sourceopen', sourceOpen);
} else {
    console.error('Unsupported MIME type or codec: ', mimeCodec);
}

function addSeekable() {
    console.log(mediaSource);
}

function sourceOpen(_) {
    //console.log(this.readyState); // open
    var mediaSource = this;
    var sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
    setDuration(mediaSource, 60 * 100); // 100min
    setSeekable(mediaSource, 0, 60 * 100); // 0-100
    fetchAB(assetURL, function(buf) {
        sourceBuffer.addEventListener('updateend', function(_) {
            // mediaSource.endOfStream();
            // video.play();
            //console.log(mediaSource.readyState); // ended
        });
        sourceBuffer.appendBuffer(buf);
    });
}


function setDuration(source, value) {
    if (source.duration !== value) {
        source.duration = value;
    }

    return source.duration;
}

function setSeekable(source, start, end) {
    if (typeof source.setLiveSeekableRange === 'function' && typeof source.clearLiveSeekableRange === 'function') {
        source.clearLiveSeekableRange();
        source.setLiveSeekableRange(start, end);
    }
}

function fetchAB(url, cb) {
    var xhr = new XMLHttpRequest;
    xhr.open('get', url);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function() {
        cb(xhr.response);
    };
    xhr.send();
}
document.querySelector("#js-add-seekable").addEventListener("click", function() {
    addSeekable();
});