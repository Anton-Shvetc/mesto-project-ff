import { apiRequest } from "./utils";

export const handleLikeIcon = (evt) => {
  console.log("add like");
  evt.target.classList.toggle("card__like-button_is-active");
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

