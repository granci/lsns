$.extend(true, $.magnificPopup.defaults, {  
    iframe: {
        patterns: {
           youtube: {
              index: 'youtube.com/', 
              id: function (url) {
                var [url, t] = url.split('&t=');
                return url.split('?v=')[1] + '?autoplay=1' + (t !== undefined ? '&start='+t : '')
              },
              src: 'https://www.youtube.com/embed/%id%' 
          },
          vimeo: {
              index: 'vimeo.com/', 
              id: '/', 
              src: 'https://www.vimeo.com/%id%?autoplay=1' 
          }
        }
    }
});

$(document).ready(function() {
  $('.gallery').each(function() { // the containers for all your galleries
    $(this).magnificPopup({
      delegate: 'a', // the selector for gallery item
      type: 'image',
      gallery: {
        enabled:true
      },
      image: {
        titleSrc: function(item) { return item.img.attr('alt'); }
      }
    });
  });

  $('.nav-item').on('click',function(){
    $('.nav-item').removeClass('active');
    $(this).addClass('active');
  });  

});

function concat(outer, items) {
  var d = $(outer);
  for (var i=0; i<items.length; i++) $(items[i]).appendTo(d);
  return d;
}
function mkName(n) { return ('<div class="name">'+n+'</div>'); }
function mkBubble(t) { return ('<div class="bubble">'+t+'</div>'); }
function mkMsg(n, c, t) { return concat('<div class="'+c+'"/>', [mkName(n), mkBubble(t)]); }
function mkDial(n1, n2, c1, c2, ts) {
  for (var i=0; i<ts.length; i++) {
    if (ts[i] === "...") {
      if (i+1 < ts.length && ts[i+1] === "...") {
        ts[i] = "<span />";
      } else {
        ts[i] = "<hr />";
      }
    } else {
      ts[i] = mkMsg(i%2 ? n2 : n1, i%2 ? c2 : c1, ts[i]);
    }
  }
  return concat('<div class="column"/>', ts);
}
function mkImg(i) { return ('<img src="'+DIR+i+'.png" max-height="100px" width="100px" />'); }
function mkTitle(n, f) { 
  return '<div style="display: table-cell; vertical-align: middle; height: 100px;">' +
    '<a href="#' + idFromStr(n) + '"><h4 id="' + idFromStr(n) + '">' + n + (f !== '' ? ' &ndash; '+f : '') + '</h4></a></div>';
}
function linkify(s) {
    return s.replace(/\[(https?:\/\/[^ \]]*)( [^\]]*)?\]/gim, '<a href="$1" target="_blank">$2<img src="img/link.png" height="12px" /></a>');
}
function mkUL(items) {
  var d = $('<ul/>');
  for (var i=0; i<items.length; i++) $('<li>'+linkify(items[i])+'</li>').appendTo(d);
  return d;
}
function mkGal(items) {
  var d = $('<div class="gallery" />');
  for (var i=0; i<items.length; i++)
    if (typeof(items[i]) === 'object') {
      if (items[i][0].includes("https://www.youtube.com/")) {
          $('<a href="' + items[i][0] + '" class="mfp-iframe"><img src="' + DIR + items[i][1] + '" height="50px" /></a>').appendTo(d);
      } else {
          $('<a href="' + DIR + items[i][0] + '"><img alt="' + items[i][1] +'" src="' + DIR + items[i][0] + '" /></a>').appendTo(d);
      }
    } else {
      $('<a href="' + DIR + items[i] + '"><img alt="" src="' + DIR + items[i] + '" /></a>').appendTo(d);
    }
  return d;
}
function mkProfile(img, n, f, items) {
  var title = concat('<div class="title"/>', [mkImg(img), mkTitle(n, f)]),
      text = concat('<div style=""/>', items); // display: none;
  //title.click(function() { text.toggle(); });
  return addSec('#f5f5f5', [concat('<div class="profile"/>', [title, text])]);
}
function mkItm(n, items) {
  var title = '<a href="#' + idFromStr(n) + '"><h4 id="' + idFromStr(n) + '">' + n + '</h4></a>',
      text = concat('<div style=""/>', items);
  return addSec('#f5f5f5', [concat('<div class="profile"/>', [title, text])]);
}
function mkTit(t) { return '<h2>'+t+'</h2>'; }
function mkP(t) { return '<p>'+linkify(t)+'</p>'; }
function addSec(bc, its, c="section") {
  concat('<div class="'+c+'" style="background-color: '+bc+'"/>', its).appendTo($('#body'));
}

function mkNav(fbLink) {
  var menuItems = {
    index: 'Násilníci',
    fasisti: 'Fašisti',
    seky: 'Šeky',
    hlupaci: 'Hlupáci',
    weby: 'Kotleboweby',
  }
  var file = document.URL.split('.html')[0].split('/')[document.URL.split('.html')[0].split('/').length - 1];
  var ul = $('<ul/>');
  Object.keys(menuItems).forEach(k => {
    var cl = 'nav-item';
    if (file === k) cl += ' active';
    $('<li class="' + cl + '"><a href="' + k + '.html">' + menuItems[k] + '</a></li>').appendTo(ul);
  });
  if (fbLink) {
    var fbBtn = $('<div class="fb-share-button" data-href="'+ fbLink + '" data-layout="button_count" data-size="small"/>')
    $('<a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=' + fbLink + '&amp;src=sdkpreparse" class="fb-xfbml-parse-ignore">').appendTo(fbBtn);
    fbBtn.appendTo(ul);
  }
  ul.appendTo($('#nav'));
}

function idFromStr(str) {
  return str
    .normalize('NFC')
    .replace(/[ÀÁÂÃÄÅ]/g,"A")
    .replace(/[àáâãäå]/g,"a")
    .replace(/[Č]/g,"C")
    .replace(/[č]/g,"c")
    .replace(/[Ď]/g,"D")
    .replace(/[ď]/g,"d")
    .replace(/[ÈÉÊË]/g,"E")
    .replace(/[é]/g,"e")
    .replace(/[Í]/g,"I")
    .replace(/[í]/g,"i")
    .replace(/[ĹĽ]/g,"L")
    .replace(/[ĺľ]/g,"l")
    .replace(/[Ň]/g,"N")
    .replace(/[ň]/g,"n")
    .replace(/[ÓÔ]/g,"O")
    .replace(/[óô]/g,"o")
    .replace(/[Ŕ]/g,"R")
    .replace(/[ŕ]/g,"r")
    .replace(/[Š]/g,"S")
    .replace(/[š]/g,"s")
    .replace(/[Ť]/g,"T")
    .replace(/[ť]/g,"t")
    .replace(/[Ú]/g,"U")
    .replace(/[ú]/g,"u")
    .replace(/[Ý]/g,"Y")
    .replace(/[ý]/g,"y")
    .replace(/[Ž]/g,"z")
    .replace(/[ž]/g,"z")
    .replace(/[^a-z0-9,.?!-]/gi,'_'); // final clean up
}
