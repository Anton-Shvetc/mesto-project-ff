const serverConfig = {
  url: "https://nomoreparties.co/v1/cohort-magistr-2",
  headers: {
    authorization: "b354eeff-aa28-4966-b729-3b31a1f1a39b",
    "Content-Type": "application/json",
  },
};

// Шаблон функции запроса
export const apiRequest = async (url, method, body) => {
  try {
    const response = await fetch(`${serverConfig.url}/${url}`, {
      method,
      headers: serverConfig.headers,
      body,
    });

    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return null;
  }
};
