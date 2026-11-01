(function ($) {
    if (!$) {
        console.error("Không thể tải header/footer: jQuery chưa được nạp.");
        return;
    }

    const components = [
        {
            selector: "#site-header",
            renderedSelector: "body > header",
            url: "./components/header.html",
            cacheKey: "milo_component_header"
        },
        {
            selector: "#site-footer",
            renderedSelector: "body > footer.footer-moi",
            url: "./components/footer.html",
            cacheKey: "milo_component_footer"
        }
    ];

    function docCapNhatGiaoDien() {
        const trangHienTai = window.location.pathname.split("/").pop() || "trang-chu.html";

        $(".menu-chinh a").each(function () {
            const lienKet = $(this).attr("href");
            if (
                lienKet === trangHienTai ||
                (trangHienTai === "chi-tiet-san-pham.html" && lienKet === "san-pham.html")
            ) {
                $(this).addClass("active");
            }
        });

        document.dispatchEvent(new Event("siteComponentsLoaded"));
    }

    components.forEach(function (component) {
        const viTri = $(component.selector);
        if (!viTri.length) {
            return;
        }

        const htmlDaLuu = localStorage.getItem(component.cacheKey);
        if (htmlDaLuu) {
            viTri.replaceWith(htmlDaLuu);
            component.daHienThiCache = true;
        }
    });

    if (components.some(function (component) { return component.daHienThiCache; })) {
        docCapNhatGiaoDien();
    }

    const ketQuaTai = components.map(function (component) {
        if (!$(component.selector).length && !component.daHienThiCache) {
            return null;
        }

        return $.get(component.url)
            .done(function (html) {
                localStorage.setItem(component.cacheKey, html);
                const viTri = $(component.selector);
                if (viTri.length) {
                    viTri.replaceWith(html);
                } else if (!component.daHienThiCache) {
                    console.error(`Không tìm thấy vị trí chèn ${component.url}.`);
                    return;
                } else {
                    $(component.renderedSelector).replaceWith(html);
                }
                docCapNhatGiaoDien();
            })
            .fail(function (xhr, status, error) {
                console.error(`Không thể tải ${component.url}.`, status, error);
                if (!component.daHienThiCache) {
                    const viTri = $(component.selector);
                    if (!viTri.length) {
                        return;
                    }
                    viTri.text("Không thể tải nội dung trang.");
                }
            });
    }).filter(Boolean);

    if (!ketQuaTai.length && !components.some(function (component) { return component.daHienThiCache; })) {
        docCapNhatGiaoDien();
    }
})(window.jQuery);
