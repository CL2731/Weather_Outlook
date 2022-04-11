window.addEventListener("load", function(){
    let existingHistory; 
    if(!JSON.parse(localStorage.getItem("history"))){
        existingHistory=[];
    } else {
        existingHistory=JSON.parse(localStorage.getItem("history"))
    } 
    let historyItems=[];
    function getWeather(searchValue){
        if(!searchValue){
            return;
        }   
        let endpoint= `http://api.openweathermap.org/data/2.5/forecast?q=${searchValue}&appid=d91f911bcf2c0f925fb6535547a5ddc9&units=imperial`;
        fetch(endpoint)
        .then((res)=>res.json())
        .then((data)=>{
            let forecastElement= document.getElementById("forecast");
            forecastElement.innerHTML= `<h4 class="mt-3"> Your forecast for the next five days </h4>`;
            rowElement= document.createElement("div");
            rowElement.className= `"row"`;
            for(var i=0; i<data.list.length; i++){
                if(data.list[i].dt_txt.indexOf("15:00:00")!== -1){
                    let columnElement= document.createElement("div");
                    columnElement.classList.add("col-md-2");
                }
            }
        })
    }
})