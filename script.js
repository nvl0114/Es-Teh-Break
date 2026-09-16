// =====================================
// LOKASI SCRIPT INI SENDIRI
//
// Diambil sekali saat script pertama kali
// dijalankan (masih synchronous), supaya
// kita tahu di folder mana script.js berada.
// template.html, logo.png, dan halaman lain
// dianggap berada di folder yang SAMA
// dengan script.js ini (biasanya folder root).
// =====================================

const scriptSrc =
    document.currentScript
        ? document.currentScript.src
        : "script.js";

const baseDir = new URL(".", scriptSrc);


document.addEventListener("DOMContentLoaded", async function () {

    // Kontainer kosong tempat template akan dipasang
    const appDiv = document.getElementById("app");

    // Isi asli halaman (ditulis manual di setiap halaman)
    const pageSource = document.getElementById("page-source");

    if (!appDiv) {
        console.error("Elemen #app tidak ditemukan.");
        return;
    }

    try {

        // Ambil template desain
        // Path dihitung dari lokasi script.js, jadi tetap benar
        // walau halaman ini ada di folder root ATAU folder lessons.
        const templateUrl = new URL("template.html", baseDir);

        const response = await fetch(templateUrl);

        if (!response.ok) {
            throw new Error("Gagal memuat template.html");
        }

        const html = await response.text();

        // Ubah HTML menjadi dokumen yang bisa dibaca
        const parser = new DOMParser();
        const templateDoc = parser.parseFromString(
            html,
            "text/html"
        );

        const header = templateDoc.querySelector(".topbar");
        const footer = templateDoc.querySelector(".footer");
        const pageContentSlot = templateDoc.querySelector("#page-content");

        if (!header || !footer || !pageContentSlot) {
            throw new Error(
                "Header, footer, atau #page-content tidak ditemukan di template.html"
            );
        }

        // Perbaiki path logo & link menu di header/footer
        // supaya tetap benar walau halaman dibuka dari folder lessons.
        fixRelativePaths(header);
        fixRelativePaths(footer);

        // Pindahkan isi asli halaman (#page-source) ke dalam slot
        // #page-content milik template. appendChild lintas-dokumen
        // otomatis meng-adopt node aslinya (bukan kloning), jadi
        // event listener yang sudah nempel tetap jalan.
        if (pageSource) {
            pageContentSlot.appendChild(pageSource);
        }

        // Susun semuanya ke dalam #app pada halaman yang sedang dibuka
        appDiv.appendChild(header);
        appDiv.appendChild(pageContentSlot);
        appDiv.appendChild(footer);

        // Aktifkan menu hamburger
        initMenu();

        // Tandai halaman yang sedang dibuka
        setActiveMenu();

    } catch (error) {

        console.error("Template gagal dimuat:", error);

    }


    // =====================================
    // PERBAIKAN PATH RELATIF (logo, link menu)
    // =====================================

    function fixRelativePaths(rootEl) {

        rootEl.querySelectorAll("img[src]").forEach(function (img) {

            const src = img.getAttribute("src");

            if (!/^https?:\/\//i.test(src)) {
                img.setAttribute("src", new URL(src, baseDir).href);
            }

        });

        rootEl.querySelectorAll("a[href]").forEach(function (link) {

            const href = link.getAttribute("href");

            if (
                href &&
                !/^https?:\/\//i.test(href) &&
                !href.startsWith("#")
            ) {
                link.setAttribute("href", new URL(href, baseDir).href);
            }

        });

    }


    // =====================================
    // MENU HAMBURGER
    // =====================================

    function initMenu() {

        const menuButton =
            document.getElementById("menuButton");

        const navLinks =
            document.getElementById("navLinks");

        if (!menuButton || !navLinks) return;

        menuButton.addEventListener("click", function () {

            const isOpen =
                navLinks.classList.toggle("open");

            menuButton.setAttribute("aria-expanded", String(isOpen));

            menuButton.setAttribute(
                "aria-label",
                isOpen ? "關閉選單" : "開啟選單"
            );

            menuButton.textContent = isOpen ? "✕" : "☰";

        });

        navLinks.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", function () {

                navLinks.classList.remove("open");
                menuButton.setAttribute("aria-expanded", "false");
                menuButton.setAttribute("aria-label", "開啟選單");
                menuButton.textContent = "☰";

            });

        });

        window.addEventListener("resize", function () {

            if (window.innerWidth > 850) {

                navLinks.classList.remove("open");
                menuButton.setAttribute("aria-expanded", "false");
                menuButton.textContent = "☰";

            }

        });

    }


    // =====================================
    // MENU HALAMAN AKTIF
    // =====================================

    function setActiveMenu() {

        const currentPage =
            window.location.pathname.split("/").pop()
            || "index.html";

        document.querySelectorAll(".nav-links a")
            .forEach(function (link) {

                const linkPage =
                    (link.getAttribute("href") || "")
                        .split("/").pop();

                if (linkPage === currentPage) {

                    link.classList.add("active");
                    link.setAttribute("aria-current", "page");

                }

            });

    }

});
