import view from "../utils/view.js";
import store from "../store.js";
import Story from "../components/Story.js";
import checkFavorite from "../utils/checkFavorite.js";

export default function Favorites() {
  const { favorites } = store.getState();
  const hasFavorites = favorites.length > 0;

  view.innerHTML = `<div>  
        ${
          hasFavorites
            ? favorites
                .map((story) =>
                  Story({
                    ...story,
                    isFavorite: checkFavorite(favorites, story),
                  })
                )
                .join("")
            : "Add some favorites!"
        } 
        
    </div>`;

  document.querySelectorAll(".favorite").forEach((favoriteButton) => {
    favoriteButton.addEventListener("click", async function () {
      const story = JSON.parse(this.dataset.story);
      const isFavorited = checkFavorite(favorites, story);
      store.dispatch({
        type: isFavorited ? "REMOVE_FAVORITE" : "ADD_FAVORITE",
        payload: { favorite: story },
      });

      Favorites();
    });
  });
}
