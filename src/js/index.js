/* 오늘 얻은 인사이트
 1. 이벤트 위임에 대해 알게 되었다. (이벤트 위임은 여러 요소에게 이벤트를 할당하지 않고 공통되는 부모에게 이벤트 할당하는 방식. e.target으로 해당 타겟 객체로 감)
 2. 요구사항을 먼저 세세하게 나누고 코딩을 시작하는 것의 중요성을 알았다.
 3. DOM 요소를 가져올 떄, $표시를 써서 변수처럼 사용할 수 있는게 좋았다.
 4. 새롭게 알게된 메소드: form 태그 자동 전송 막기 e.preventDefault(), querySelector(All), innerText, innerHTML, e.target.classList.contains()
 insertAdjacentHTML(HTML 요소의 어디에, 무엇을 넣을 건지), e.target.closest(타겟에서 가장 가까운 css 요소를 찾음)
*/
//step1 요구사항 구현을 위한 전략
// TODO 메뉴 추가
// ㅇ 메뉴의 이름을 입력받고 나면 엔터키 입력으로 추가한다.
// ㅇ 메뉴의 이름을 입력받고 나면 확인버튼으로 추가한다.
// ㅇ 추가되는 메뉴의 아래 마크업은 <ul id="espresso-menu-list" class="mt-3 pl-0"></ul> 안에 삽입해야 한다.
// ㅇ 총 메뉴 갯수를 count하여 상단에 보여준다.
// ㅇ 메뉴가 추가되고 나면, input은 빈 값으로 초기화한다.
// ㅇ 사용자 입력값이 빈 값이라면 추가되지 않는다.

// TODO 메뉴 수정
// o 메뉴의 수정 버튼을 눌러 메뉴 이름 수정할 수 있다.
// o 메뉴 수정시 브라우저에서 제공하는 prompt 인터페이스를 활용한다.

// TODO 메뉴 삭제
// o 메뉴 삭제 버튼을 이용하여 메뉴 삭제할 수 있다.
// o 메뉴 삭제시 브라우저에서 제공하는 confirm 인터페이스를 활용한다.
function App() {
  const $ = (selector) => document.querySelector(selector);
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
    const menuNameTemplate = (menuName) => {
      return `
        <li class="menu-list-item d-flex items-center py-2">
        <span class="w-100 pl-2 menu-name">${menuName}</span>
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
    };
    $("#espresso-menu-list").insertAdjacentHTML(
      "beforeend",
      menuNameTemplate(menuName)
    );
    updateMenuCount();
    $("#espresso-menu-name").value = "";
  };

  const updateMenuName = (e) => {
    const $MenuName = e.target.closest("li").querySelector(".menu-name");
    const updateMenuName = prompt("메뉴를 수정하세요", $MenuName.innerText);
    $MenuName.innerText = updateMenuName;
  };

  const removeMenuName = (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
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

App();
