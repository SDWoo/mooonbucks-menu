// 회고
// 상태값의 중요성
// 스텝 1하고 스텝 2 하는데 상태 값을 사용해서  사용자 관점에서 페이지 렌더링 될 때 어떻게
// 렌더링 되는지 처음 제대로 보게 된 것 같음

/* step 2 요구사항
- TODO localStorage read & write
 [ㅇ] localStorage에 데이터를 저장한다. (메뉴 추가, 메뉴 수정, 메뉴 삭제)
 [ㅇ] localStorage에 있는 데이터를 읽어온다. (새로고침해도 데이터가 남아 있게 하기 위함)
  데이터를 변경하는 로직은 하나로만 정리하기. 여기 저기서 데이터 변경하면 꼬일 수 있기 때문.
  상태 관리를 하는 것이 중요한 이유 => 사용자의 interaction을 잘 반영한 웹 애플리케이션을 만들기 위헤.
  정적인 페이지가 아니고 동적인 페이지를 만들기 위해서 필요함. 

- TODO 카테고리 별 메뉴판 관리
 [o] 에스프레소 메뉴판 관리
 [o] 프라푸치노 메뉴판 관리
 [o] 블렌디드 메뉴판 관리
 [o] 티바나 메뉴판 관리
 [o] 디저트 메뉴판 관리

- TODO 페이지 최초 로딩 시 데이터 read & rendering
 [o] 페이지에 최초로 로딩할 떄, localStorage에서 에스프레소 메뉴를 읽어온다.
 [o] 그 후, 읽어온 에스프레소 데이터를 화면에 보여준다.

- TODO 품절 상태 관리
 [o] 품절 버튼을 추가한다.
 [o] 품절 버튼을 클릭하면 localStorage에 상태 값이 저장된다.
 [] 클릭 이벤트에서 가장 가까운 li 태그의 class 값에 sold-out 을 추가한다.*/
import { $ } from "./utils/dom.js";
import { store } from "./store/index.js";

function App() {
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };
  this.currentCategory = "espresso";

  this.init = () => {
    if (store.getLocalStorage()) {
      this.menu = store.getLocalStorage();
    }
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

  const addMenu = () => {
    if ($("#menu-name").value === "") {
      alert("값을 입력해주세여");
      return;
    }
    const menuName = $("#menu-name").value;
    this.menu[this.currentCategory].push({ name: menuName });
    store.setLocalStorage(this.menu);
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
