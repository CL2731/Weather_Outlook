window.addEventListener("load", function () {
    let existingHistory;
    if (!JSON.parse(localStorage.getItem("history"))) {
        existingHistory = [];
    } else {
        existingHistory = JSON.parse(localStorage.getItem("history"))
    }
    let historyItems = [];
    function getWeather(searchValue) {
        if (!searchValue) {
            return;
        }
        let endpoint = `http://api.openweathermap.org/data/2.5/forecast?q=${searchValue}&appid=d91f911bcf2c0f925fb6535547a5ddc9&units=imperial`;
        fetch(endpoint)
            .then((res) => res.json())
            .then((data) => {
                let forecastElement = document.getElementById("forecast");
                forecastElement.innerHTML = `<h4 class="mt-3"> Your forecast for the next five days </h4>`;
                rowElement = document.createElement("div");
                rowElement.className = `"row"`;
                for (var i = 0; i < data.list.length; i++) {
                    if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                        let columnElement = document.createElement("div");
                        columnElement.classList.add("col-md-2");

                        let cardElement = document.createElement("div");
                        cardElement.classList.add("card", "bg-info", "text-black");

                        let windElement = document.createElement("p");
                        windElement.classList.add("card-text");
                        windElement.textContent = `wind speed: ${data.list[i].wind.speed}mph`;

                        let humidityElement = document.createElement("p");
                        humidityElement.classList.add("card-text");
                        humidityElement.textContent = `humidity: ${data.list[i].main.humidity}%`;


                        let bodyElement = document.createElement("div");
                        bodyElement.classList.add("card-body", "p-2");

                        let titleElement = document.createElement("h5");
                        titleElement.classList.add("card-title");
                        titleElement.textContent = new Date(
                            data.list[i].dt_txt
                        ).toLocaleDateString();

                        let imageElement = document.createElement("img");
                        imageElement.setAttribute("src", "http://openweathermap.org/img/w/${data.weather[0].icon}.png");

                        let paragraph1 = document.createElement("p");
                        paragraph1.classList.add("card-text");
                        paragraph1.textContent = `temperature ${data.list[i].main.temp_max}f`;

                        let paragraph2 = document.createElement("p");
                        paragraph2.classList.add("card-text");
                        paragraph2.textContent = `humidity ${data.list[i].main.humidity}%`;

                        columnElement.appendChild(cardElement);
                        bodyElement.appendChild(titleElement);
                        bodyElement.appendChild(imageElement);
                        bodyElement.appendChild(windElement);
                        bodyElement.appendChild(humidityElement);
                        bodyElement.appendChild(paragraph1);
                        bodyElement.appendChild(paragraph2);
                        bodyElement.appendChild(columnElement);
                    }
                }
            })
    }


    function uvIndex(latitude, longitutde) {
        fetch(`http://api.openweathermap.org/data/2.5/uvi?appid=d91f911bcf2c0f925fb6535547a5ddc9&lat=${latitude}&lon=${longitutde}`)
            .then((result) => result.json())
            .then((data) => {
                let bodyElement = document.querySelector("card-body");
                let uvElement = document.createElement("p");
                uvElement.id = "uv"
                uvElement.textContent = "uvIndex"
                let buttonElement = document.createElement("span");
                buttonElement.classList.add("btn", "btn-sm");
                buttonElement.innerHTML = data.value;
                if (data.value < 3) {
                    buttonElement.classList.add("btn-success");
                } else if (data.value < 7) {
                    buttonElement.classList.add("btn-warning");
                } else {
                    buttonElement.classList.add("btn-danger");
                } 
                
                bodyElement.appendChild(uvElement);
                uvElement.appendChild(buttonElement);
            })
    }
    const handleHistory= (term)=> {
        if(existingHistory && existingHistory.length > 0){
            let existingEntry= JSON.parse(localStorage.getItem("history"));
            let newHistory= [...existingEntry, term];
            localStorage.setItem("history", JSON.stringify(newHistory));
        } else {
            historyItems.push(term);
            localStorage.setItem("history", JSON.stringify(historyItems));
        }
    };
    function searchWeather(searchValue){
        let endpoint= `http://api.openweathermap.org/data/2.5/weather?q=${searchValue}&appid=d91f911bcf2c0f925fb6535547a5ddc9&units=imperial`;
        fetch(endpoint)
        .then((result)=> result.json())
        .then((data)=> {
            // Invoke our history method

          if (!existingHistory.includes(searchValue)) {
            handleHistory(searchValue);
          }
          // Clear any old content
          todayEl = document.querySelector('#current-day');
          todayEl.textContent = ' ';
          // Create html content for current weather
          let titleElement = document.createElement('h3');
          titleElement.classList.add('card-title');
          titleElement.textContent = `${
            data.name
          } (${new Date().toLocaleDateString()})`;

          let cardElement = document.createElement('div');
          cardElement.classList.add('card');

          let windElement = document.createElement('p');
          windElement.classList.add('card-text');

          let humidityElement = document.createElement('p');
          humidityElement.classList.add('card-text');
          
          let tempElement = document.createElement('p');
          tempElement.classList.add('card-text');
          humidityElement.textContent = `Humidity: ${data.main.humidity} %`;
          tempElement.textContent = `Temperature: ${data.main.temp} °F`;

          let cardBodyElement = document.createElement('div');
               cardBodyElement.classList.add('card-body');

          let imageElement = document.createElement('img');
          imageElement.setAttribute(
            'src',
            `http://openweathermap.org/img/w/${data.weather[0].icon}.png`
          );
  
          titleElement.appendChild(imageElement);
          cardBodyElement.appendChild(titleElement);
          cardBodyElement.appendChild(tempElement);
          cardBodyElement.appendChild(windElement);
          cardBodyElement.appendChild(humidityElement);
          cardElement.appendChild(cardBodyElement);
          todayEl.appendChild(cardElement);
          uvIndex(data.coord.latitude, data.coord.longitutde);
          getWeather(searchValue);
        })

    } 

    function newRow(searchValue){
        let liElement= document.createElement("li");
        liElement.classList.add("list-group-item", "list-group-item-action");
        liElement.id= searchValue;
        let text= searchValue;
        liElement.textContent= text;
        liElement.addEventListener("click", (e)=> {
            if (e.target.tagName === "LI"){
                searchWeather(e.target.textContent);
            }
        })
        document.getElementById("history").appendChild(liElement);
    }
    if (existingHistory && existingHistory.length > 0) {
        existingHistory.forEach((item)=> newRow(item));
    }
    function searchResults(){
        let searchValue= document.querySelector("#search-value").value;
        if (searchValue){
            searchWeather(searchValue);
            newRow(searchValue);
            document.querySelector("#search-value").value= "";
        }
    } document.querySelector("#search-button").addEventListener("click", searchResults);
})
