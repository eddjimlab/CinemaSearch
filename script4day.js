const searchForm = document.querySelector("#search-form");
const movie = document.querySelector("#movies");
let urlPoster = "https://image.tmdb.org/t/p/w500";

// добавляем предварительную загрузку трнедов (all, movie, tv, person \\ day, week)
document.addEventListener("DOMContentLoaded", function() {
  fetch(
    "https://api.themoviedb.org/3/trending/all/week?api_key=1a68372fcca439831d85880c1c1936b0&language=ru"
  )
    .then(function(value) {
      if (value.status !== 200) {
        return Promise.reject(new Error(value.status + "Ошибка"));
      }
      return value.json();
    })

    .then(function(output) {
      let inner =
        '<h4 class="col-12 text-center text-info my-4">Популярные за неделю!</h4>';
      if (output.results.length === 0) {
        inner =
          '<h2 class="col-12 text-center text-info">По Вашему запросу ничего не найдено! </h2 > ';
      }
      output.results.forEach(function(item) {
        const imageReady = item.poster_path
          ? urlPoster + item.poster_path
          : "./no_image1.png";
        let nameItem = item.name || item.title;
          let mediaType = item.title ? "movie" : "tv";
          let nonDate = item.release_date ? item.release_date.substring(0,4) : 'Нет';
          
        let dataInfo = `data-id="${item.id}" data-type="${mediaType}"`;
        inner += `
<div class="col-6 col-md-6 col-xl-3 item pb-4">
    <div class="card-deck">
        <div class="card">
            <img class="card-img-top" src="${imageReady}" class="img_poster" alt="${nameItem}" ${dataInfo}>
        </div>
    </div>
    
</div> 
<div class="col-6 col-md-6 col-xl-3 item text_cover pb-4">
<h5 class="card-title">${nameItem}</h5>
<p class="card-text" ><b>Описание:</b> ${item.overview.substring(0,200)}</p>
<p class="card-text"><b>Год выпуска:</b> ${(nonDate)}</p>
<p class="card-text rate">Рейтинг: ${item.vote_average}</p>
</div>
            
            `;
      });
        
      movie.innerHTML = inner;
      addEventMedia();
    })
    .catch(function(reason) {
      movie.innerHTML =
        " Упс что -то пошло не так !<br>Нужно ввести слово для поиска!";
      console.log("error" + reason);
    });
});
// предварительная загрузка

function apiSearch(event) {
  event.preventDefault();
  const searchText = document.querySelector(".form-control").value;
  if (searchText.trim().length === 0) {
    movie.innerHTML =
      '<h2 class="col-12 text-center text-danger">Поле поиска не должно быть пустым! </h2 > ';
    return;
  }
  const server =
    "https://api.themoviedb.org/3/search/multi?api_key=1a68372fcca439831d85880c1c1936b0&language=ru&query=" +
    searchText;
  movie.innerHTML = '<div class="spinner"></div>">';

  fetch(server)
    .then(function(value) {
      if (value.status !== 200) {
        return Promise.reject(new Error(value.status + "Ошибка"));
      }
      return value.json();
    })

    .then(function(output) {
        let inner = 
      `<h4 class="col-12 text-left text-info my-4">Результаты поиска: <small style="color:rgb(130, 12, 97); font-style: italic;">${searchText.trim()}</small></h4>`;
      if (output.results.length === 0) {
        inner =
          '<h2 class="col-12 text-center text-info">По Вашему запросу ничего не найдено! </h2 > ';
      }
      output.results.forEach(function(item) {
        const imageReady = item.poster_path
          ? urlPoster + item.poster_path
          : "./no_image1.png";
          let nameItem = item.name || item.title;
          let nonDate = item.release_date ? item.release_date.substring(0, 4) : 'Нет';
        let dataInfo = "";
        if (item.media_type !== "person")
          dataInfo = `data-id="${item.id}" data-type="${item.media_type}"`;
        inner += `
<div class="col-6 col-md-6 col-xl-3 item pb-4">
    <div class="card-deck">
        <div class="card">
            <img class="card-img-top" src="${imageReady}" class="img_poster" alt="${nameItem}" ${dataInfo}>
        </div>
    </div>
    
</div> 
<div class="col-6 col-md-6 col-xl-3 item text_cover pb-4">
<h5 class="card-title">${nameItem}</h5>
<p class="card-text" ><b>Описание:</b> ${item.overview.substring(0, 200)}</p>
<p class="card-text"><b>Год выпуска:</b> ${(nonDate)}</p>
<p class="card-text rate">Рейтинг: ${item.vote_average}</p>
</div>
            
            `;
      });
      movie.innerHTML = inner;

      addEventMedia();
    })
    .catch(function(reason) {
      movie.innerHTML =
        " Упс что -то пошло не так !<br>Нужно ввести слово для поиска!";
      console.log("error" + reason);
    });
}
searchForm.addEventListener("submit", apiSearch);

function addEventMedia() {
  const media = movie.querySelectorAll("img[data-id]");
  media.forEach(function(elem) {
    elem.style.cursor = "pointer";
    elem.addEventListener("click", showFullInfo);
  });
}

//показ полной информации
function showFullInfo() {
  let url = "";
  if (this.dataset.type == "movie") {
    url = `https://api.themoviedb.org/3/movie/${
      this.dataset.id
    }?api_key=1a68372fcca439831d85880c1c1936b0&language=ru`;
  } else if (this.dataset.type == "tv") {
    url = `https://api.themoviedb.org/3/tv/${
      this.dataset.id
    }?api_key=1a68372fcca439831d85880c1c1936b0&language=ru`;
  } else {
    movie.innerHTML =
      '<h2 class="col-12 text-center text-info">Произошла ошибка повторите позже! </h2 >';
  }
  fetch(url)
    .then(function(value) {
      if (value.status !== 200) {
        return Promise.reject(new Error(value.status + "Ошибка"));
      }
      return value.json();
    })

    .then(function(output) {
        movie.innerHTML = `
            <div class="col-4">
            <img src="${urlPoster + output.poster_path}" alt="${output.name ||
        output.title}">
            

            </div>
            <div class="col-8 fullInfo">
            <h4 class="col-12 text-center text-info">${output.name ||
          output.title}</h4>
            <p> <b>Рейтинг:</b> ${output.vote_average}</p>
            <p> <b>Статус:</b>${output.status}</p>
            <p> <b>Примьера:</b> ${output.first_air_date || output.release_date}</p>
            <p> <b>Оригинальное название:</b> ${output.original_title}</p>
            <p> <b>Язые оригинала:</b> ${output.original_language}</p>
            
            ${
              output.last_episode_to_air
                ? `<p>${output.number_of_seasons} сезон ${
                    output.last_episode_to_air.episode_number
                  } серий вышло</p>`
                : ""
            }

            <p><b>Описание:</b> ${output.overview}</p>
            ${
            output.homepage
                ? `<p class="text-left my-2"><a href="${
                output.homepage
                }" target="_blank">Официальная страница</a></p>`
                : ""
            }
            ${
            output.imdb_id
                ? `<p class="text-left"><a href="https://imdb.com/title/${
                output.imdb_id
                }" target="_blank">Страница на IMDB.com</a></p>`
                : ""
            }
            ${
            output.imdb_id
                ? `<p class="text-left"><a href="https://themoviedb.org/movie/${
                output.id
                }-${output.original_name}" target="_blank">Страница на The Movie Db.com</a></p>`
                : ""
            }
            </div>
            `;
    })
    .catch(function(reason) {
      movie.innerHTML =
        " Упс что -то пошло не так !<br>Нужно ввести слово для поиска!";
      console.log("error" + reason);
    });
}

