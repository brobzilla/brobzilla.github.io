var run = false;
var start = 0;
var duration = 3600;
function updateTime(div, dur, force) {
  if (!run && !force) {
    return;
  }

  let timeRemaining = dur - Math.round((Date.now() - start)/1000);
  if (timeRemaining < 0) {
    timeRemaining = 0;
  }
  const hh = Math.floor(timeRemaining / 3600);
  const mm = Math.floor((timeRemaining - 3600*hh) / 60);
  const ss = timeRemaining - 3600 * hh - 60 * mm;
  div.innerText = d2s(hh) + ":" + d2s(mm) + ":" + d2s(ss);
}

function d2s(n) {
  if (n < 10) {
    return "0"+n;
  } else {
    return "" + n;
  }
}

function init() {
  let params = new URLSearchParams(document.location.search.substring(1));
  duration = parseInt(params.get("duration"), 10);
  if (!duration) {
    duration = 3600;
  }
  start = parseInt(params.get("start"), 10);
  if (!start) {
    start = Date.now();
  } else {
    run = true;
    flipButton();
  }
  const timer = document.getElementById("timer");
  updateTime(timer, duration, true)
  window.setInterval(updateTime, 1000, timer, duration);
}

function flipButton() {
  let startBtn = document.getElementById("start");
  startBtn.style.display='none';
  let copyBtn = document.getElementById("copy");
  copyBtn.style.display='block';
}

function enable() {
  start = Date.now();
  run = true;
  updateUrl();
  flipButton();
}

function updateUrl() {
  if (history.pushState) {
    var newurl = (window.location.protocol + "//" + window.location.host +
		  window.location.pathname + "?duration="+duration+"&start="+start);
    window.history.pushState({path:newurl},'',newurl);
  }
}

function copyUrl() {
  const url = window.location.href;
  const copyBtn = document.getElementById("copy");

  if (!navigator.clipboard) {
    fallbackCopyToClipboard(url);
  } else {
    navigator.clipboard.writeText(url).then(function() {
      copyBtn.innerText = "URL copied!";
    }, function() {
      copyBtn.style.display="none";
    });
  }
}

function fallbackCopyToClipboard(s) {
  const copyBtn = document.getElementById("copy");
  const textArea = document.createElement("textarea");
  textArea.value = s;
  textArea.style.position="fixed";  //avoid scrolling to bottom
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    if (document.execCommand('copy')) {
      copyBtn.innerText = "URL copied!";
    } else {
      copyBtn.style.display="none";
    }
  } catch (err) {
    copyBtn.style.display="none";
  }
  document.body.removeChild(textArea);
}

init();

