document.addEventListener("DOMContentLoaded", () => {
  let container = document.querySelector(".container");
  let loading = document.querySelector(".loading");

  setTimeout(() => {
    container.style = `visibility: visible;overflow: visible;height: 100vh;opacity:1`;
    loading.style = `display:none`;
  }, 3500);
});

let nav = document.querySelector(".nav");
let bar = document.querySelector(".bar");
let iMark = document.querySelector(".bar i");

bar.addEventListener("click", () => {
  if (nav.classList.contains("visibled")) {
    nav.classList.add("hiddend");
    nav.classList.remove("visibled");
    iMark.classList.add("fa-bars");
    iMark.classList.remove("fa-xmark");
  } else {
    nav.classList.add("visibled");
    nav.classList.remove("hiddend");

    iMark.classList.add("fa-xmark");
    iMark.classList.remove("fa-bars");
  }
});

fetch(`https://www.mp3quran.net/api/v3/reciters?language=ar`)
  .then((response) => {
    let data = response.json();
    return data;
  })
  .then((data) => {
    let reciter = document.querySelector(".reciter");
    reciter.innerHTML = `<option value="" selected disabled hidden>أختر القارئ</option>`;
    data.reciters.forEach((e) => {
      reciter.innerHTML += `<option value="${e.id}">${e.name}</option>`;
    });
    reciter.addEventListener("change", (e) => getRiwaya(e.target.value));
  });

function getRiwaya(reciter) {
  fetch(
    `https://www.mp3quran.net/api/v3/reciters?language=ar&reciter=${reciter}`
  )
    .then((response) => {
      let data = response.json();
      return data;
    })
    .then((data) => {
      let riwaya = document.querySelector(".riwaya");
      riwaya.innerHTML = `<option value="" selected disabled hidden>أختر الرواية</option>`;
      data.reciters[0].moshaf.forEach((e) => {
        riwaya.innerHTML += `<option value="${e.id}" data-server="${e.server}" data-surahlist="${e.surah_list}">${e.name}</option>`;
      });
      riwaya.addEventListener("change", (e) => {
        getSurah(
          e.target.options[e.target.selectedIndex].id,
          e.target.options[e.target.selectedIndex].dataset.server,
          e.target.options[e.target.selectedIndex].dataset.surahlist
        );
      });
    });
}

function getSurah(id, server, surahList) {
  fetch(`https://mp3quran.net/api/v3/suwar?language=ar&rewaya=${id}`)
    .then((response) => {
      let data = response.json();
      return data;
    })
    .then((data) => {
      let alSurah = document.querySelector(".surah");
      alSurah.innerHTML = `<option value="" selected disabled hidden>أختر السورة</option>`;
      surahList = surahList.split(",");
      surahList.forEach((sura) => {
        data.suwar.forEach((surah) => {
          if (surah.id == sura) {
            if (surah.id < 10) {
              alSurah.innerHTML += `<option value="${server}00${sura}.mp3">${surah.name}</option>`;
            } else if (surah.id < 100) {
              alSurah.innerHTML += `<option value="${server}0${sura}.mp3">${surah.name}</option>`;
            } else if (surah.id >= 100) {
              alSurah.innerHTML += `<option value="${server}${sura}.mp3">${surah.name}</option>`;
            }
          }
        });
      });
      alSurah.addEventListener("change", (e) => {
        let mp3 = e.target.value;
        playSurah(mp3);
      });
    });
}

function playSurah(mp3) {
  let audio = document.querySelector("audio");
  audio.src = mp3;
}

function playLive(live) {
  if (Hls.isSupported()) {
    var hls = new Hls();
    var video = document.querySelector("video");
    hls.loadSource(live);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      video.play();
    });
  } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = videoSrc;
  }
}
