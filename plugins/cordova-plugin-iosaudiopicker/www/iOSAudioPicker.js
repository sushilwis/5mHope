var exec = require('cordova/exec');

exports.getAudio = function(onSuccess, onError, multiple, icloud) {
    console.log("Plugin called");
    exec(onSuccess, onError, "iOSAudioPicker", "getAudio", [multiple,icloud]);
};

exports.deleteSongs = function(onSuccess, onError, multiple, filepath) {
    exec(onSuccess, onError, "iOSAudioPicker", "deleteSongs", [multiple,filepath]);
    
};
