(function () {
  "use strict";
  function load(mount) {
    var status = mount.previousElementSibling;
    var submit = mount.closest("form");
    submit = submit && submit.querySelector("[data-account-submit]");
    function message(text) { if (status) status.textContent = text; }
    fetch(mount.getAttribute("data-private-fragment"), {credentials: "same-origin", cache: "no-store"}).then(function (response) {
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) { mount.innerHTML = ""; mount.disabled = true; if (submit) submit.disabled = true; }
        throw new Error("정보를 불러오지 못했습니다. 다시 시도해 주세요.");
      }
      return response.text();
    }).then(function (html) {
      mount.innerHTML = html;
      mount.disabled = false;
      if (submit) submit.disabled = false;
      message("");
      if (window.MirtypeShellLocale) window.MirtypeShellLocale.apply();
    }).catch(function (error) {
      message(error.message);
      if (status) {
        var retry = document.createElement("button");
        retry.type = "button"; retry.className = "site-menu-action"; retry.textContent = "다시 시도";
        retry.addEventListener("click", function () { message("불러오는 중입니다."); load(mount); });
        status.appendChild(retry);
      }
    });
  }
  document.querySelectorAll("[data-private-fragment]").forEach(load);
  var menus = document.querySelectorAll("[data-session-shell]");
  if (!menus.length) return;
  fetch("/account/ajax_get_userinfo/", {credentials: "same-origin", cache: "no-store"}).then(function (response) {
    if (!response.ok) throw new Error("session unavailable");
    return response.json();
  }).then(function (user) {
    if (!user.uuid) return;
    menus.forEach(function (menu) {
      menu.innerHTML = "";
      function link(href, text, key) {
        var node = document.createElement("a");
        node.href = href; node.textContent = text; node.className = "site-menu-action"; menu.appendChild(node);
        if (key) node.setAttribute("data-shell-i18n", key);
      }
      link("/myinfo/", user.name || "내 정보");
      if (user.is_admin) link("/admin/", "Admin");
      link("/account/logout/", "로그아웃", "account.logout");
    });
    if (window.MirtypeShellLocale) window.MirtypeShellLocale.apply();
  }).catch(function () {});
})();
