import Story from "../components/Story.js";
import view from "../utils/view.js";
import baseUrl from "../utils/baseUrl.js";
import Comment from "../components/Comment.js";
import checkFavorite from "../utils/checkFavorite.js";
import store from "../store.js";

export default async function Item() {
  let story = null;
  let hasComments = false;
  let hasError = false;

  try {
    story = await getStory();
    hasComments = story.comments.length > 0;
  } catch (error) {
    hasError = true;
    console.error(error);
  }

  if (hasError) {
    view.innerHTML = `<div class="error">Error fetching story</div>`;
  }
  view.innerHTML = `
    <div>
        ${Story(story)}
    </div>
    <hr/>
        ${
          hasComments
            ? story.comments.map((comment) => Comment(comment)).join("")
            : "no comments"
        }
    `;

  document.querySelectorAll(".favorite").forEach((favoriteButton) => {
    favoriteButton.addEventListener("click", async function () {
      const story = JSON.parse(this.dataset.story);
      const isFavorited = checkFavorite(favorites, story);
      store.dispatch({
        type: isFavorited ? "REMOVE_FAVORITE" : "ADD_FAVORITE",
        payload: { favorite: story },
      });

      await Item();
    });
  });
}

async function getStory() {
  const storyId = window.location.hash.split("?id=")[1];
  // console.log(storyId);
  const response = await fetch(`${baseUrl}/item/${storyId}`);
  const story = await response.json();
  return story;
}
