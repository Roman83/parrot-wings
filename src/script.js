(function () {
  var nav = nav || document.getElementById('nav');
  document.getElementsByClassName('nav-toggle')[0].onclick = function() {
    nav.classList.toggle('collapsed');
  };
  var li = nav.getElementsByTagName('li');
  for (var i = 0; i < li.length; i++) {
    li[i].onclick = function() { nav.classList.add('collapsed'); };
  };
})();

(function () {
  var searchbar = searchbar || document.getElementsByClassName('search-bar')[0];
  document.getElementsByClassName('search-toggle')[0].onclick = function() {
    searchbar.classList.toggle('collapsed');
  };
})();
