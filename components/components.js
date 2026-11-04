const componentScriptUrl = document.currentScript.src;
const components = [
    {
        selector: "#site-header",
        renderedSelector: "body > header",
        url: new URL("header.html", componentScriptUrl),
        cacheKey: "milo_component_header"
    },
    {
        selector: "#site-footer",
        renderedSelector: "body > footer.footer-moi",
        url: new URL("footer.html", componentScriptUrl),
        cacheKey: "milo_component_footer"
    }
];

function capNhatGiaoDien() {
    const trangHienTai = window.location.pathname.split("/").pop() || "trang-chu.html";
    document.querySelectorAll(".menu-chinh a").forEach(function (lienKet) {
        const href = lienKet.getAttribute("href");
        if (
            href === trangHienTai ||
            (trangHienTai === "chi-tiet-san-pham.html" && href === "san-pham.html")
        ) {
            lienKet.classList.add("active");
        }
    });
    document.dispatchEvent(new Event("siteComponentsLoaded"));
}
function hienThiComponent(component, html) {
    const viTri = document.querySelector(component.selector)
        || document.querySelector(component.renderedSelector);

    if (!viTri) {
        console.error(`Không tìm thấy vị trí chèn ${component.url.pathname}.`);
        return false;
    }

    viTri.outerHTML = html;
    capNhatGiaoDien();
    return true;
}

async function taiComponent(component) {
    let daHienThiCache = false;

    try {
        const htmlDaLuu = localStorage.getItem(component.cacheKey);
        if (htmlDaLuu) {
            daHienThiCache = hienThiComponent(component, htmlDaLuu);
        }
    } catch (error) {
        console.error(`Không thể đọc cache ${component.cacheKey}.`, error);
    }

    try {
        const phanHoi = await fetch(component.url);
        if (!phanHoi.ok) {
            throw new Error(`HTTP ${phanHoi.status}`);
        }

        const html = await phanHoi.text();
        try {
            localStorage.setItem(component.cacheKey, html);
        } catch (error) {
            console.error(`Không thể lưu cache ${component.cacheKey}.`, error);
        }

        hienThiComponent(component, html);
    } catch (error) {
        console.error(`Không thể tải ${component.url.href}.`, error);
        if (!daHienThiCache) {
            const viTri = document.querySelector(component.selector);
            if (viTri) {
                viTri.textContent = "Không thể tải nội dung trang.";
            }
        }
    }
}

Promise.all(components.map(taiComponent));
