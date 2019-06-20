const searchForm = document.querySelector("#search-form");
const movie = document.querySelector("#movies");

function apiSearch(event) {
    event.preventDefault();
    const searchText = document.querySelector(".form-control").value;
    const server =
        "https://api.themoviedb.org/3/search/multi?api_key=1a68372fcca439831d85880c1c1936b0&language=ru&query=" +
        searchText;
    movie.innerHTML = "Загрузка";
    requestApi(server)
        .then(function (result) {
            const output = JSON.parse(result);

            let inner = "";
            output.results.forEach(function (item) {
                let nameItem = item.name || item.title;
                inner += `<div class="col-6">${nameItem}</div>
            <div class="col-6">${item.release_date}</div>`;
            });
            movie.innerHTML = inner;
        })
        .catch(function (reason) {
            movie.innerHTML =
                " Упс что -то пошло не так !<br>Нужно ввести слово для поиска!";
            console.log("error" + reason.status);
        });
}
searchForm.addEventListener("submit", apiSearch);

function requestApi(url) {
    return new Promise(function (resolve, reject) {
        const request = new XMLHttpRequest();
        request.open("GET", url);
        request.addEventListener("load", function () {
            if (request.status !== 200) {
                reject({
                    status: request.status
                });
                return;
            }
            resolve(request.response);
        });
        request.addEventListener("error", function () {
            reject({
                status: request.status
            });
        });
        request.send();
    });
}