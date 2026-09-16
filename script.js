
document.addEventListener("DOMContentLoaded", async function () {

    // Ambil elemen dari halaman yang sedang dibuka
    const pageContent = document.getElementById("page-content");

    if (!pageContent) {
        console.error("Elemen #page-content tidak ditemukan.");
        return;
    }

    try {

        // Ambil template desain
        const response = await fetch("template.html");

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

        // Ambil CSS dari template
        const templateStyle = templateDoc.querySelector("style");

        if (templateStyle) {

            const style = document.createElement("style");
            style.textContent = templateStyle.textContent;

            document.head.appendChild(style);
        }

        // Ambil header dan footer dari template
        const header = templateDoc.querySelector(".topbar");
        const footer = templateDoc.querySelector(".footer");

        if (!header || !footer) {
            throw new Error(
                "Header atau footer tidak ditemukan di template.html"
            );
        }

        // Masukkan header ke halaman
        document.body.prepend(
            document.importNode(header, true)
        );

        // Masukkan footer ke halaman
        document.body.appendChild(
            document.importNode(footer, true)
        );

        // Aktifkan menu hamburger
        initMenu();

        // Tandai halaman yang sedang dibuka
        setActiveMenu();

    } catch (error) {

        console.error("Template gagal dimuat:", error);

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

            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuButton.setAttribute(
                "aria-label",
                isOpen ? "關閉選單" : "開啟選單"
            );

            menuButton.textContent =
                isOpen ? "✕" : "☰";

        });

        // Tutup menu setelah link diklik
        navLinks.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", function () {

                navLinks.classList.remove("open");

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuButton.setAttribute(
                    "aria-label",
                    "開啟選單"
                );

                menuButton.textContent = "☰";

            });

        });

        // Tutup menu saat kembali ke tampilan desktop
        window.addEventListener("resize", function () {

            if (window.innerWidth > 850) {

                navLinks.classList.remove("open");

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

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
                    link.getAttribute("href");

                if (linkPage === currentPage) {

                    link.classList.add("active");

                    link.setAttribute(
                        "aria-current",
                        "page"
                    );

                }

            });

    }

});
