const searchForm = document.querySelector("#search-form");
const movie = document.querySelector("#movies");
let urlPoster = 'https://image.tmdb.org/t/p/w500';


    


function apiSearch(event) {
    event.preventDefault();
    const searchText = document.querySelector(".form-control").value;
    const server =
        "https://api.themoviedb.org/3/search/multi?api_key=1a68372fcca439831d85880c1c1936b0&language=ru&query=" +
        searchText;
    movie.innerHTML = '<img src="Blocks-1s-200px.gif">';

    fetch(server)
        .then(function (value) {
            if (value.status !== 200) {
                return Promise.reject(new Error(value.status + 'Ошибка'));
            }
            return value.json();
        })


        .then(function (output) {
            let inner = "";
            output.results.forEach(function (item) {
                if (urlPoster == null) {
                    urlPoster = 'no_image.png';
                }
                let nameItem = item.name || item.title;
                inner += `
<div class="col-12 col-md-4 col-xl-3 item">
    <div class="card-deck">
        <div class="card">
            <img class="card-img-top" src="${
                    
                    urlPoster + item.poster_path}" alt="${nameItem}">
            <div class="card-body">
                <h5 class="card-title">${nameItem}</h5>
                <p class="card-text">Release: ${item.release_date}</p>
            </div>
        </div>
    </div>
</div> 
            
            `;
            });
            movie.innerHTML = inner;
        })
        .catch(function (reason) {
            movie.innerHTML =
                " Упс что -то пошло не так !<br>Нужно ввести слово для поиска!";
            console.log("error" + reason);
        });
}
searchForm.addEventListener("submit", apiSearch);