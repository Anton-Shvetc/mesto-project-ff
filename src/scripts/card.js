import { apiRequest } from "./utils";

export const handleLikeIcon = async (evt) => {
  const cardLikeCount =
    evt.target.parentNode.querySelector(".card__like-count");

  const id = evt.target.closest(".card").getAttribute("id");

  const isLiked = evt.target.classList.contains("card__like-button_is-active");

  let request;

  if (isLiked) {
    request = await apiRequest(`cards/likes/${id}`, "DELETE");
  } else {
    request = await apiRequest(`cards/likes/${id}`, "PUT");
  }

  if (request) {
    evt.target.classList.toggle("card__like-button_is-active");

    cardLikeCount.textContent = request.likes.length;
  }
};

export const handleDeleteCard = async (evt) => {
  const id = evt.target.closest(".card").getAttribute("id");

  const request = apiRequest(`cards/${id}`, "DELETE");

  if (request) {
    evt.target.closest(".card").remove();
  }
};

const getTemplate = () => {
  return document
    .querySelector(".card-template")
    .content.querySelector(".card")
    .cloneNode(true);
};

export const createCardElement = (
  data,
  isLiked,
  { onPreviewPicture, onLikeIcon, onDeleteCard }
) => {
  const cardElement = getTemplate();
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const cardImage = cardElement.querySelector(".card__image");
  cardImage.style.backgroundImage = `url(${data.link})`;
  cardElement.querySelector(".card__title").textContent = data.name;
  // Добавляем атрибут 'id' с уникальным значением
  cardElement.setAttribute("id", data["_id"]);

  const cardLikeCount = cardElement.querySelector(".card__like-count");

  if (isLiked) {
    likeButton.classList.add("card__like-button_is-active");
  }

  cardLikeCount.textContent = data.likes.length;

  if (onLikeIcon) {
    likeButton.addEventListener("click", onLikeIcon);
  }

  if (onDeleteCard) {
    deleteButton.addEventListener("click", onDeleteCard);
  }

  if (onPreviewPicture) {
    cardImage.addEventListener("click", () => onPreviewPicture(data));
  }

  return cardElement;
};

