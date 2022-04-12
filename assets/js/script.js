window.addEventListener("load", function () {
    //Grab the existing history from local storage If it exists
    let existingHistory;
    if (!JSON.parse(localStorage.getItem("history"))) {
        existingHistory = [];
    } else {
        existingHistory = JSON.parse(localStorage.getItem("history"))
    }
    let historyItems = [];

    // Function to get the forcast, loop through only the days of the week and render data to the page
    function getWeather(searchValue) {
        if (!searchValue) {
            return;
        }
        let endpoint = `http://api.openweathermap.org/data/2.5/forecast?q=${searchValue}&appid=d91f911bcf2c0f925fb6535547a5ddc9&units=imperial`;
        fetch(endpoint)
            .then((res) => res.json())
            .then((data) => {
                // Select our forecast element and add a header to it
                let forecastElement = document.querySelector("#forecast");
                forecastElement.innerHTML = `<h4 class="mt-3"> Your forecast for the next five days </h4>`;

                // Create a div and give it a class of row
                rowElement = document.createElement("div");
                rowElement.className = '"row"';

                // Loop over all forecasts (by 3-hour increments)
                for (var i = 0; i < data.list.length; i++) {
                    // Only look at forecasts around 3:00pm
                    if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                        // Create HTML elements for a bootstrap card
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
                        imageElement.setAttribute("src", `http://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png`);

                        let paragraph1 = document.createElement("p");
                        paragraph1.classList.add("card-text");
                        paragraph1.textContent = `temperature ${data.list[i].main.temp_max}f`;

                        let paragraph2 = document.createElement("p");
                        paragraph2.classList.add("card-text");
                        paragraph2.textContent = `humidity ${data.list[i].main.humidity}%`;

                        //Merge together and put on a page
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

    // Helper funcion to fetch and display the UV Index
    function uvIndex(lat, lon) {
        fetch(
            `http://api.openweathermap.org/data/2.5/uvi?appid=d91f911bcf2c0f925fb6535547a5ddc9&lat=${lat}&lon=${lon}`
            )

            .then((result) => result.json())
            .then((data) => {
                let bodyElement = document.querySelector(".card-body");
                let uvElement = document.createElement("p");
                uvElement.id = "uv";
                uvElement.textContent = "UV Index: ";
                let buttonElement = document.createElement("span");
                buttonElement.classList.add("btn", "btn-sm");
                buttonElement.innerHTML = data.value;

                switch(data.value) {
                    case data.value < 3:
                    buttonElement.classList.add("btn-success");
                    break;
                 case data.value < 7: 
                    buttonElement.classList.add("btn-warning");
                    break;
                 default:
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
            // If there is no history, create one with the searcValue and save it localStorage
        } else {
            historyItems.push(term);
            localStorage.setItem("history", JSON.stringify(historyItems));
        }
    };

    // Function that preforms the actual API request and creates elements to render to the page
    function searchWeather(searchValue){
        let endpoint= `http://api.openweathermap.org/data/2.5/weather?q=${searchValue}&appid=1cea51fd6d072959d8e4ce55c4aa0d3f&unit=imperial`;
        fetch(endpoint)
        .then((result)=> result.json())
        .then((data)=> {
            
            // Invoke history method
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
          imageElement.setAttribute("src", `http://openweathermap.org/img/w/${data.weather[0].icon}.png`);
            
          // Apend all the content that we created 
          titleElement.appendChild(imageElement);
          cardBodyElement.appendChild(titleElement);
          cardBodyElement.appendChild(tempElement);
          cardBodyElement.appendChild(windElement);
          cardBodyElement.appendChild(humidityElement);
          cardElement.appendChild(cardBodyElement);
          todayEl.appendChild(cardElement);

          // Invoke our forecast and UV functions
          getWeather(searchValue);
          uvIndex(data.coord.lat, data.coord.lon);
        });
      } 
    
    // Helper function to create a new row
    function newRow(searchValue){
        // Create a new 'li' element and add classes/text to it 
        let liElement= document.createElement("li");
        liElement.classList.add("list-group-item", "list-group-item-action");
        liElement.id= searchValue;
        let text= searchValue;
        liElement.textContent= text;

        // Select the history element and add an event to it
        liElement.addEventListener("click", (e)=> {
            if (e.target.tagName === "LI"){
                searchWeather(e.target.textContent);
            }
        })
        document.getElementById("history").appendChild(liElement);
    }

    // Render existing history to the page
    if (existingHistory && existingHistory.length > 0) {
        existingHistory.forEach((item)=> newRow(item));
    }

    // Helper function to get a search value
    function searchResults(){
        let searchValue= document.querySelector("#search-value").value;
        if (searchValue){
            searchWeather(searchValue);
            newRow(searchValue);
            document.querySelector("#search-value").value= "";
        }
    } 
    
    // Attach our searchResults function to the search button
    document.querySelector("#search-button").addEventListener("click", searchResults);
})
