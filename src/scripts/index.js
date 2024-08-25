/*
  Файл index.js является точкой входа в наше приложение
  и только он должен содержать логику инициализации нашего приложения
  используя при этом импорты из других файлов

  Из index.js не допускается что то экспортировать
*/
import "../index.css";

import { enableValidation, clearValidation } from "./validation.js";

import { createCardElement, handleLikeIcon, handleDeleteCard } from "./card";
import {
  closeModalWindow,
  openModalWindow,
  setCloseModalWindowEventListeners,
} from "./modal";

import { apiRequest } from "./utils";

// DOM узлы
const placesWrap = document.querySelector(".places__list");
const profileFormModalWindow = document.querySelector(".popup_type_edit");
const profileForm = profileFormModalWindow.querySelector(".popup__form");
const profileTitleInput = profileForm.querySelector(".popup__input_type_name");
const profileDescriptionInput = profileForm.querySelector(
  ".popup__input_type_description"
);

const cardFormModalWindow = document.querySelector(".popup_type_new-card");
const cardForm = cardFormModalWindow.querySelector(".popup__form");
const cardNameInput = cardForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = cardForm.querySelector(".popup__input_type_url");

const imageModalWindow = document.querySelector(".popup_type_image");
const imageElement = imageModalWindow.querySelector(".popup__image");
const imageCaption = imageModalWindow.querySelector(".popup__caption");

const openProfileFormButton = document.querySelector(".profile__edit-button");
const openCardFormButton = document.querySelector(".profile__add-button");
const openAvatarFormButton = document.querySelector(".profile__image");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileImage = openAvatarFormButton.querySelector(
  ".profile__image-avatar"
);
let profileId = "";

const avatarFormModalWindow = document.querySelector(".popup_type_avatar");
const avatarForm = avatarFormModalWindow.querySelector(".popup__form");
const avatarLinkInput = avatarForm.querySelector(".popup__input_avatar");

const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

const handlePreviewPicture = ({ name, link }) => {
  imageElement.src = link;
  imageElement.alt = `Изображение ${name}`;
  imageCaption.textContent = name;
  openModalWindow(imageModalWindow);
};

const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();

  const name = profileTitleInput.value;
  const about = profileDescriptionInput.value;

  const request = apiRequest(
    "users/me",
    "PATCH",
    JSON.stringify({ name, about })
  );
  if (request) {
    profileTitle.textContent = name;
    profileDescription.textContent = about;
    closeModalWindow(profileFormModalWindow);
  }
};

const handleCardFormSubmit = async (evt) => {
  evt.preventDefault();

  const name = cardNameInput.value;
  const link = cardLinkInput.value;

  // Запрос на добавление новой карточки
  const request = await apiRequest(
    "cards",
    "POST",
    JSON.stringify({ name, link })
  );

  if (!request) return;

  placesWrap.prepend(
    createCardElement(
      {
        name: cardNameInput.value,
        link: cardLinkInput.value,
      },
      {
        onPreviewPicture: handlePreviewPicture,
        onLikeIcon: handleLikeIcon,
        onDeleteCard: handleDeleteCard,
      }
    )
  );

  closeModalWindow(cardFormModalWindow);
  cardForm.reset();
};

const handleAvatarFormSubmit = async (evt) => {
  evt.preventDefault();
  const avatar = avatarLinkInput.value;

  const request = await apiRequest(
    "users/me/avatar",
    "PATCH",
    JSON.stringify({ avatar })
  );

  if (request) {
    profileImage.src = request.avatar;
    closeModalWindow(avatarFormModalWindow);
  }
};

// EventListeners
profileForm.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);
avatarForm.addEventListener("submit", handleAvatarFormSubmit);

openProfileFormButton.addEventListener("click", () => {
  profileForm.reset();
  clearValidation(profileForm, validationConfig);

  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  openModalWindow(profileFormModalWindow);
});

openCardFormButton.addEventListener("click", () => {
  cardForm.reset();
  clearValidation(cardForm, validationConfig);
  openModalWindow(cardFormModalWindow);
});

openAvatarFormButton.addEventListener("click", () => {
  avatarForm.reset();
  clearValidation(avatarForm, validationConfig);

  openModalWindow(avatarFormModalWindow);
});

const initialCards = async () => {
  const request = await apiRequest("cards", "GET");

  const userId = JSON.parse(localStorage.getItem("userId"));

  if (request) {
    // отображение карточек
    request.forEach((data) => {
      let isLiked = false;

      data.likes.forEach((like) => {
        if (like._id === userId) {
          isLiked = true;
        }
      });

      placesWrap.append(
        createCardElement(data, isLiked, {
          onPreviewPicture: handlePreviewPicture,
          onLikeIcon: handleLikeIcon,
          onDeleteCard: handleDeleteCard,
        })
      );
    });
  }
};

const userProfile = async () => {
  const request = await apiRequest("users/me", "GET");
  if (request) {
    profileTitle.textContent = request.name;
    profileDescription.textContent = request.about;
    profileImage.src = request.avatar;
    localStorage.setItem("userId", JSON.stringify(request._id));
  }
};
userProfile();

initialCards();

//настраиваем обработчики закрытия попапов
setCloseModalWindowEventListeners(profileFormModalWindow);
setCloseModalWindowEventListeners(cardFormModalWindow);
setCloseModalWindowEventListeners(imageModalWindow);
setCloseModalWindowEventListeners(avatarFormModalWindow);

enableValidation(validationConfig);

