document.addEventListener("DOMContentLoaded", async () => {

    const app = document.getElementById("app");

    if (!app) {
        console.error("找不到 #app 元素。");
        return;
    }

    // =========================================
    // 自動判斷目前頁面是否在 /lessons/
    // =========================================

    const currentPath = window.location.pathname;

    const isLessonPage = currentPath.includes("/lessons/");

    // 根目錄 → template.html
    // /lessons/ → ../template.html
    const templatePath = isLessonPage
        ? "../template.html"
        : "template.html";


    // =========================================
    // 保存這個頁面自己的內容
    // =========================================

    const pageSource = document.getElementById("page-source");

    const pageContentHTML = pageSource
        ? pageSource.outerHTML
        : "";

    if (pageSource) {
        pageSource.remove();
    }


    // =========================================
    // 載入 template.html
    // =========================================

    try {

        const response = await fetch(templatePath);

        if (!response.ok) {
            throw new Error(
                `無法載入 template.html（${response.status}）`
            );
        }

        const template = await response.text();


        // 將模板放入 #app
        app.innerHTML = template;


        // =========================================
        // 將頁面自己的內容放入 #page-content
        // =========================================

        const pageContentSlot =
            app.querySelector("#page-content");

        if (pageContentSlot) {

            pageContentSlot.innerHTML =
                pageContentHTML;

        } else {

            console.warn(
                "template.html 裡找不到 #page-content。"
            );

        }


        // =========================================
        // 啟用側邊選單
        // =========================================

        setupSidebar();


    } catch (error) {

        console.error(
            "模板載入失敗：",
            error
        );

        app.innerHTML = `
            <div style="
                padding: 40px;
                text-align: center;
                color: #5c4033;
            ">
                <h2>🧊🍵</h2>
                <p>目前無法載入頁面模板。</p>
            </div>
        `;

    }

});



/* =========================================
   側邊選單
========================================= */

function setupSidebar() {

    const menuButton =
        document.getElementById("menuButton");

    const sidebar =
        document.getElementById("sidebar");

    const overlay =
        document.getElementById("overlay");


    if (
        !menuButton ||
        !sidebar ||
        !overlay
    ) {

        console.warn(
            "找不到側邊選單所需的元素。"
        );

        return;
    }


    // 點擊 ☰ 開啟／關閉側邊選單
    menuButton.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle("open");
            overlay.classList.toggle("show");

        }
    );


    // 點擊背景區域關閉側邊選單
    overlay.addEventListener(
        "click",
        () => {

            closeSidebar();

        }
    );


    // ESC 關閉側邊選單
    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Escape") {
                closeSidebar();
            }

        }
    );


    function closeSidebar() {

        sidebar.classList.remove("open");
        overlay.classList.remove("show");

    }

}