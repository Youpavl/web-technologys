const movies = [
  {
    title: 'Інтерстеллар',
    poster: 'https://image.tmdb.org/t/p/w300/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
  },
  {
    title: 'Матриця',
    poster: 'https://image.tmdb.org/t/p/w300/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
  },
  {
    title: 'Назад у майбутнє',
    poster: 'https://image.tmdb.org/t/p/w300/7lyBcpYB0Qt8gYhXYaEZUNlNQAv.jpg',
  },
]

function FavoriteMovies() {
  return (
    <div className="movies-container">
      <h3>Мої улюблені фільми</h3>
      <ol>
        {movies.map((movie, index) => (
          <li key={index}>
            <p className="movie-title">{movie.title}</p>
            <img src={movie.poster} alt={movie.title} />
            <br />
            <button onClick={() => alert(`Детальніше про: ${movie.title}`)}>
              Детальніше
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default FavoriteMovies
