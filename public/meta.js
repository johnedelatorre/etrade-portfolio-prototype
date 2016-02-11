(function(){

  var el;
  var script;
  var cssVersion = '1.0.4'; // the version of bootstrap we're using.

  document.addEventListener('DOMContentLoaded', function(){
    var request = new XMLHttpRequest();
    request.open('GET', '/data/package.json', true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        var data = JSON.parse(request.responseText);
        console.log(data);
        el = document.querySelector('#software-release');
        el.innerHTML = data.release + ' Prototype <br/> <a target="_blank" href="http://styleguide.etradecreative.com/'+cssVersion+'/docs/"> ETrade Bootstrap v. '+cssVersion + '</a>';
        el.classList.add('active');
        el.addEventListener('click',function(e){
          el.classList.add('mute');
          setTimeout(function(){
            el.classList.remove('mute');
          },10000);
        });
      } else {

      }
    };

    request.onerror = function() {
      // There was a connection error of some sort
    };

    request.send();
  });


})(); 
