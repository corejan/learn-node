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
});
