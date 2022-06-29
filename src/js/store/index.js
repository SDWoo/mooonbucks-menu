export const store = {
  setLocalStorage(menu) {
    localStorage.setItem("menu", JSON.stringify(menu)); //json 문자열 형태로 넣기
  },
  getLocalStorage() {
    return JSON.parse(localStorage.getItem("menu")); //json 형태로 받아오기
  },
};
