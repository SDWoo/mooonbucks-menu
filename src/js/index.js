/* step 2 요구사항
- TODO localStorage read & write
 [] localStorage에 데이터를 저장한다. (메뉴 추가, 메뉴 수정, 메뉴 삭제)
 [] localStorage에 있는 데이터를 읽어온다. (새로고침해도 데이터가 남아 있게 하기 위함)

- TODO 카테고리 별 메뉴판 관리
 [] 에스프레소 메뉴판 관리
 [] 프라푸치노 메뉴판 관리
 [] 블렌디드 메뉴판 관리
 [] 티바나 메뉴판 관리
 [] 디저트 메뉴판 관리

- TODO 페이지 최초 로딩 시 데이터 read & rendering
 [] 페이지에 최초로 로딩할 떄, localStorage에서 에스프레소 메뉴를 읽어온다.
 [] 그 후, 읽어온 에스프레소 데이터를 화면에 보여준다.

- 
 [] 품절 버튼을 추가한다.
 [] 품절 버튼을 클릭하면 localStorage에 상태 값이 저장된다.
 [] 클릭 이벤트에서 가장 가까운 li 태그의 class 값에 sold-out 을 추가한다.*/
const store = {
  setLocalStorage(menu) {
    localStorage.setItem("menu", JSON.stringify(menu));
  },
  getLocalStorage() {
    localStorage.getItem("menu");
  },
};
const $ = (selector) => document.querySelector(selector);

function App() {
  this.menu = [];

  const updateMenuCount = () => {
    const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;
    $(".menu-count").innerText = `총 ${menuCount} 개`;
  };

  const addMenu = () => {
    if ($("#espresso-menu-name").value === "") {
      alert("값을 입력해주세여");
      return;
    }
    const menuName = $("#espresso-menu-name").value;
    this.menu.push({ name: menuName });
    store.setLocalStorage(this.menu);
    const template = this.menu
      .map((item, index) => {
        return `
        <li data-menu-Id = "${index}"class="menu-list-item d-flex items-center py-2">
        <span class="w-100 pl-2 menu-name">${item.name}</span>
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

    $("#espresso-menu-list").innerHTML = template;
    updateMenuCount();
    $("#espresso-menu-name").value = "";
  };

  const updateMenuName = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $MenuName = e.target.closest("li").querySelector(".menu-name");
    const updateMenuName = prompt("메뉴를 수정하세요", $MenuName.innerText);
    this.menu[menuId].name = updateMenuName;
    store.setLocalStorage(this.menu);
    $MenuName.innerText = updateMenuName;
  };

  const removeMenuName = (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      this.menu.splice(menuId, 1);
      store.setLocalStorage(this.menu);
      e.target.closest("li").remove();
      updateMenuCount();
    }
  };
  // form 태그 자동 전송 막기
  $("#espresso-menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });
  // add Menu with buttton
  $("#espresso-menu-submit-button").addEventListener("click", addMenu);
  // add Menu with Enter
  $("#espresso-menu-name").addEventListener("keypress", (e) => {
    if (e.key !== "Enter") {
      return;
    }
    addMenu();
  });
  // click edit , remove button
  $("#espresso-menu-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("menu-edit-button")) {
      updateMenuName(e);
    }
    if (e.target.classList.contains("menu-remove-button")) {
      removeMenuName(e);
    }
  });
}

const app = new App();
