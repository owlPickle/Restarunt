(async function () {

  let list = document.getElementById("eating-list");
  let selectInput = document.getElementById("area");
  let story = document.getElementById("story");
  let randomBtn = document.getElementById("random");
  let html = '';
  // Load Data
  const restarunt = [];
  const area = [];
  const selectArr = [];
  const data = await axios.get("./data.json");

  restarunt.push(...data.data);
  // render restarunt list
  restarunt.forEach((store, idx) => {
    area.push(store.district);
    html = `
      <div class="restarunt">
        <div class="title">${store.name}</div>
        <div data-region="${store.district}" class="info">
          <p>${store.open_time}</p>
          <p>${store.address}</p>
        </div>
      </div>
    `
    list.innerHTML += html;
  });

  const uniqDistrict = area.reduce(function (prev, now) {
    if (prev.indexOf(now) < 0) prev.push(now);
    return prev;
  }, []);

  // click render info
  let eatList = document.querySelectorAll("#eating-list .title");
  let showInfo = function () {
    this.nextElementSibling.classList.toggle("open");
    let storyHtml = '';
    restarunt.forEach(res => {
      if (res.name === this.innerText) {
        storyHtml = `
            <h1>${res.name}</h1>
            <p>${res.introduction}</p>
          `
        story.innerHTML = storyHtml;
      }
    })
  }
  let selectArea = function () {
    eatList.forEach(region => {
      region.parentElement.style.display = "none";
      if (region.nextElementSibling.getAttribute("data-region") === this.value) {
        selectArr.push(region);
        region.parentElement.style.display = "block";
        randomBtn.disabled = false;
      }
    })
  }

  let draw = function (e) {
    e.preventDefault();
    
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

  eatList.forEach(title => {
    title.addEventListener("click", showInfo);
  })

})();