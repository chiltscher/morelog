var socket = io(document.origin);

socket.on('files', function(files){
    updateFilelist(files);
    socket.emit('getContent', lastOpend);
});

socket.on('content', function(file){
    document.cookie = "lastOpend="+file.filename;
    updateContentBox(file);
});

var lastOpend = document.cookie.split("lastOpend=")[1];

function updateContentBox(file){
    var filename = file.filename;
    var content = file.content;
    var id = filename.split('.jLog')[0];
    $('.active').removeClass('active');
    $('#'+id).addClass('active');
    $('.log').remove();
    content.forEach(function(log){
        var type = getClass(log.instance);
        var el = $('<div class="log ' + type + '"></div>');
        var time = $('<div class="time">' + log.time + ' - </div>');
        var instance = $('<div class="instance">' + log.instance + ' - </div>');
        var text = $('<div class="text">' + log.text + '</div>');
        el.append(time, instance, text);
        $('.content').append(el);
    });
}

function updateFilelist(files){
    $('.file').remove();
    files.forEach(function(file){
        var id = file.split('.jLog')[0];
        var el = $('<div class="listelement file" id="' + id + '">' + file + '</div>');
        el.on('click', function(){
            socket.emit('getContent', file);
        });
        $('.filelist').append(el);
    });
}

function getClass(instance){
    if(instance.indexOf("WARNING") !== -1)
        return "warn";
    if(instance.indexOf("DEBUG") !== -1)
        return "debug";
    if(instance.indexOf("ERROR") !== -1)
        return "error";
    if(instance.indexOf("INFO") !== -1)
        return "info";
    return;
}
