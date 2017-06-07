$(function() {
    var parts = location.pathname.split('/');
    var id = parts[parts.length-1].split('.')[0];
    //console.log(id);

    var vm = new Vue({
        el: '#mainContainer',
        data: {
            id: id,
            source: []
        },
        methods: {
        }
    });

    //markdown test
    md_content = "Hello.\n\n* This is markdown.\n* It is fun\n* Love it or leave it."
    html_content = markdown.toHTML( md_content );
    document.getElementById('mdcontent').innerHTML = html_content;
});
