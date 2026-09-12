document.addEventListener("DOMContentLoaded", async () => {

    const app = document.getElementById("app");

    if (!app) {
        console.error("找不到 #app 元素。");
        return;
    }

    // 先把「這個頁面自己的內容」抓出來、記下來，
    // 再把它從原本的位置移除，等一下要塞進 template 的 #page-content。
    const pageSource = document.getElementById("page-source");
    const pageContentHTML = pageSource ? pageSource.outerHTML : "";

    if (pageSource) {
        pageSource.remove();
    }

    try {

        // 載入 template.html
        const response = await fetch("template.html");

        if (!response.ok) {
            throw new Error(
                `無法載入 template.html（${response.status}）`
            );
        }

        const template = await response.text();

        // 將模板放入頁面
        app.innerHTML = template;

        // 把這個頁面自己的內容，放進模板裡的 #page-content
        const pageContentSlot = app.querySelector("#page-content");

        if (pageContentSlot) {
            pageContentSlot.innerHTML = pageContentHTML;
        } else {
            console.warn("template.html 裡找不到 #page-content。");
        }

        // 載入完成後啟用側邊選單
        setupSidebar();

    } catch (error) {

        console.error("模板載入失敗：", error);

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

    const menuButton = document.getElementById("menuButton");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");

    if (!menuButton || !sidebar || !overlay) {
        console.warn("找不到側邊選單所需的元素。");
        return;
    }


    // 點擊 ☰ 開啟／關閉側邊選單
    menuButton.addEventListener("click", () => {

        sidebar.classList.toggle("open");
        overlay.classList.toggle("show");

    });


    // 點擊背景區域關閉側邊選單
    overlay.addEventListener("click", () => {

        closeSidebar();

    });


    // 按下 ESC 關閉側邊選單
    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {
            closeSidebar();
        }

    });


    function closeSidebar() {

        sidebar.classList.remove("open");
        overlay.classList.remove("show");

    }
}
