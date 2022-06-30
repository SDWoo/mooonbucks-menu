import { $ } from "./utils/dom.js";
import { store } from "./store/index.js";

// step 3 요구사항
// TODO 서버 요청 부분
// [x] - 웹 서버를 띄운다.
// [] - 서버에 새로운 메뉴 생성하기를 요청한다.
// [] - 서버에 카테고리 별 메뉴리스트 불러오기를 요청한다.
// [] - 서버에 메뉴 수정하기를 요청한다.
// [] - 서버에 메뉴 품절상태 toggle을 요청한다.
// [] - 서버에 메뉴 삭제를 요청한다.

// TODO 리팩터링 부분
// [] - localStorage에 저장하는 로직은 지운다.
// [] - fetch 비동기 api를 사용하는 부분을 async await을 사용하여 구현한다.

// TODO 사용자 설정
// [] - API 통신이 실패하는 경우에 대해 사용자가 알 수 있게 alert으로 예외처리를 진행한다.
// [] - 중복되는 메뉴는 추가할 수 없다.
// API 통신 방법 fetch('url', option)

const BASE_URL = "http://localhost:3000/api";
const MenuApi = {
  async getAllMenuByCategory(category) {
    const response = await fetch(`${BASE_URL}/category/${category}/menu`);
    return response.json();
  },
};
function App() {
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };
  this.currentCategory = "espresso";

  this.init = async () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
    render();
    initEventListener();
  };

  const render = () => {
    const template = this.menu[this.currentCategory]
      .map((item, index) => {
        return `
        <li data-menu-Id = "${index}" class ="menu-list-item d-flex items-center py-2">
        <span class=" ${item.soldOut ? "sold-out" : ""} w-100 pl-2 menu-name">${
          item.name
        }</span>
        <button
        type="button"
        class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
        >
        품절
        </button>
        <button
        type="button"
        class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button">
        수정
        </button>  
        <button
        type="button"
        class="bg-gray-50 text-gray-500 text-sm menu-remove-button">
        삭제
        </button>
        </li>
        `;
      })
      .join("");
    $("#menu-list").innerHTML = template;
    updateMenuCount();
  };
  const updateMenuCount = () => {
    const menuCount = this.menu[this.currentCategory].length;
    $(".menu-count").innerText = `총 ${menuCount} 개`;
  };

  const addMenu = async () => {
    if ($("#menu-name").value === "") {
      alert("값을 입력해주세여");
      return;
    }
    const menuName = $("#menu-name").value;
    // 메뉴 추가하는 api 요청
    await fetch(`${BASE_URL}/category/${this.currentCategory}/menu`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: menuName }),
    }).then((response) => {
      return response.json();
    });
    // 전체 메뉴 불러오기 요청
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
    render();
    $("#menu-name").value = "";
  };

  const updateMenuName = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $MenuName = e.target.closest("li").querySelector(".menu-name");
    const updateMenuName = prompt("메뉴를 수정하세요", $MenuName.innerText);
    this.menu[this.currentCategory][menuId].name = updateMenuName;
    store.setLocalStorage(this.menu);
    render();
  };

  const removeMenuName = (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      this.menu[this.currentCategory].splice(menuId, 1);
      store.setLocalStorage(this.menu);
      render();
    }
  };
  const soldOutMenu = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    this.menu[this.currentCategory][menuId].soldOut =
      !this.menu[this.currentCategory][menuId].soldOut;
    store.setLocalStorage(this.menu);
    render();
  };
  const initEventListener = () => {
    // form 태그 자동 전송 막기
    $("#menu-form").addEventListener("submit", (e) => {
      e.preventDefault();
    });
    // add Menu with buttton
    $("#menu-submit-button").addEventListener("click", addMenu);
    // add Menu with Enter
    $("#menu-name").addEventListener("keypress", (e) => {
      if (e.key !== "Enter") {
        return;
      }
      addMenu();
    });
    // click edit , remove button
    $("#menu-list").addEventListener("click", (e) => {
      if (e.target.classList.contains("menu-edit-button")) {
        updateMenuName(e);
        return;
      }
      if (e.target.classList.contains("menu-remove-button")) {
        removeMenuName(e);
        return;
      }
      if (e.target.classList.contains("menu-sold-out-button")) {
        soldOutMenu(e);
        console.log(this.menu[this.currentCategory]);
        return;
      }
    });

    $("nav").addEventListener("click", (e) => {
      const isCategoryButton =
        e.target.classList.contains("cafe-category-name");
      if (isCategoryButton) {
        const CategoryName = e.target.dataset.categoryName;
        this.currentCategory = CategoryName;
        $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`; //data 뒤에 것이 알아서 카멜케이스로 바뀜
        render();
      }
    });
  };
}

const app = new App();
app.init();
