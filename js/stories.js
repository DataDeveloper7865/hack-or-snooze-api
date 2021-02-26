"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}" data-story="${story}">
        <i class="far fa-star"></i>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Gets favorited stories, generates their HTML, and puts on page. */

function putFavoritesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  let favorited = storyList.stories.filter(el => el.favorite);

  // loop through all of our stories and generate HTML for them
  for (let story of favorited) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** grabs form values, adds new story and prepends to list */
async function handleStorySubmit(evt) {
  evt.preventDefault();
  let author = $("#author").val();
  let title = $("#title").val();
  let url = $("#url").val();
  let story = await storyList.addStory(currentUser, { author, title, url });
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);
}

$storyForm.on('submit', handleStorySubmit);

function handleStarClick(evt) {
  evt.preventDefault();
  console.log("a start was clicked");

  let idToLookFor = $(evt.target).parent().attr("id")
  let storyToUpdate = storyFromStoryId(idToLookFor);

  currentUser.addFavorite(storyToUpdate);
  
  //console.log($(evt.target).parent().data("story"))
  //console.log($(evt.target).parent().data())
  //console.log($(evt.target).parent().attr("id"))

  console.log($(evt.target).parent().attr("data-story"))

}

$allStoriesList.on('click', ".fa-star", handleStarClick);

function storyFromStoryId(storyId) {
  for (let story of storyList.stories) {
    if (story.storyId === storyId) {
      return story
    }
  }
}

