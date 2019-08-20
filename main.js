(async function () {

  let list = document.getElementById("eating-list");
  let selectInput = document.getElementById("area");
  let story = document.getElementById("story");
  let randomBtn = document.getElementById("random");
  let searchBar = document.getElementById("search");
  let html = '';
  let selectArr = [];
  // Load Data
  const restarunt = [];
  const area = [];
  const data = await axios.get("./data.json");

  restarunt.push(...data.data);
  [...data.data].forEach(item => {
    area.push(item.district);
  })
  // render restarunt list
  let DOMRender = function () {
    restarunt.forEach((store, idx) => {
      html = `
        <div class="restarunt">
          <div class="title">${store.name}</div>
          <div data-region="${store.district}" class="info">
            <p>營業時間:${store.open_time}</p>
            <p>地址: ${store.address}</p>
            <p>電話: ${store.tel}</p>
          </div>
        </div>
      `
      list.innerHTML += html;
    });
  }
  DOMRender();
  const uniqDistrict = area.reduce(function (prev, now) {
    if (prev.indexOf(now) < 0) prev.push(now);
    return prev;
  }, []);
  // click render info
  let eatList = document.querySelectorAll("#eating-list .title");
  let info = document.querySelectorAll('.info');
  let showInfo = function () {
    info.forEach(item => {
      item.classList.remove("open");
    })

    this.nextElementSibling.classList.add("open");
    let storyHtml = '';
    restarunt.forEach(res => {
      if (res.name === this.innerText) {
        storyHtml = `
            <h1>${res.name}</h1>
            <p>${res.introduction}</p>
          `
        story.innerHTML = storyHtml;
      }
    });
    let top = this.parentElement.offsetTop - this.parentElement.scrollHeight;
    list.scrollTo({
      top,
      behavior: "smooth"
    });
  }

  let selectArea = function () {
    selectArr = [];
    searchBar.value = "";
    eatList.forEach(region => {
      region.parentElement.style.display = "none";
      if (region.nextElementSibling.getAttribute("data-region") === this.value) {
        selectArr.push(region);
        region.parentElement.style.display = "block";
        randomBtn.disabled = false;
      } else if (this.value === "全區") {
        window.location.reload();
      }
    })
  }
  // 阿三意麵
  let search = function () {
    selectArr = [];
    eatList.forEach(name => {
      if (name.innerText === this.value) {
        selectArr.push(name);
        name.click();
      } else {
        return false;
      }
    })
  }

  let draw = function (e) {
    e.preventDefault();
    searchBar.value = "";

    let randomNum = Math.floor(Math.random() * Math.floor(selectArr.length));
    selectArr[randomNum].click();
  }

  uniqDistrict.forEach(region => {
    let option = document.createElement('option');
    option.value = region;
    option.textContent = region;
    selectInput.appendChild(option);
  })
  //選擇地區，render該地區的餐廳
  selectInput.addEventListener("change", selectArea);
  randomBtn.addEventListener("click", draw);
  searchBar.addEventListener("keyup", search);

  eatList.forEach(title => {
    title.addEventListener("click", showInfo);
  })

})();