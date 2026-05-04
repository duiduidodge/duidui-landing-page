(function () {
  const ARTICLE_PASSWORD = "memberonly";
  const ARTICLE_ACCESS_KEY = "duidui-blog-access";

  function injectAccessStyles() {
    if (document.getElementById("duidui-access-styles")) return;

    const style = document.createElement("style");
    style.id = "duidui-access-styles";
    style.textContent = `
      .duidui-access-lock {
        overflow: hidden;
      }

      .duidui-access-lock > body > *:not(.duidui-access-gate) {
        filter: blur(10px) saturate(0.72);
        transform: scale(0.995);
        pointer-events: none;
        user-select: none;
      }

      .duidui-access-gate {
        position: fixed;
        inset: 0;
        z-index: 10000;
        display: grid;
        place-items: center;
        padding: 18px;
        background:
          radial-gradient(circle at 18% 16%, rgba(47, 184, 106, 0.24), transparent 28%),
          radial-gradient(circle at 82% 14%, rgba(212, 168, 50, 0.14), transparent 26%),
          linear-gradient(135deg, rgba(7, 17, 11, 0.92), rgba(24, 39, 30, 0.96));
        color: #dce8de;
        font-family: "Noto Sans Thai", "Sora", sans-serif;
      }

      .duidui-access-panel {
        width: min(100%, 460px);
        position: relative;
        overflow: hidden;
        border: 1px solid rgba(139, 206, 157, 0.28);
        border-radius: 28px;
        background:
          linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.055)),
          rgba(11, 26, 17, 0.86);
        box-shadow: 0 30px 90px rgba(0, 0, 0, 0.52);
      }

      .duidui-access-panel::before {
        content: "";
        position: absolute;
        inset: -1px;
        pointer-events: none;
        background:
          linear-gradient(90deg, transparent, rgba(126, 235, 176, 0.2), transparent) 0 0 / 220% 1px no-repeat,
          linear-gradient(180deg, rgba(255,255,255,0.12), transparent 32%);
      }

      .duidui-access-art {
        display: grid;
        grid-template-columns: 88px 1fr;
        gap: 18px;
        align-items: center;
        padding: 24px 24px 12px;
      }

      .duidui-access-mascot {
        width: 88px;
        height: 88px;
        border-radius: 24px;
        object-fit: cover;
        background: rgba(47, 184, 106, 0.1);
        box-shadow: inset 0 0 0 1px rgba(255,255,255,0.1), 0 18px 38px rgba(0,0,0,0.35);
      }

      .duidui-access-kicker {
        margin: 0 0 8px;
        color: #8bd99f;
        font: 700 10px/1 "IBM Plex Sans Thai", "DM Mono", monospace;
        letter-spacing: 0.16em;
        text-transform: uppercase;
      }

      .duidui-access-title {
        margin: 0;
        color: #f3f8f4;
        font-size: 34px;
        line-height: 1.02;
        letter-spacing: 0;
      }

      .duidui-access-body {
        padding: 8px 24px 24px;
      }

      .duidui-access-copy {
        margin: 0 0 18px;
        color: rgba(220, 232, 222, 0.72);
        font-size: 14px;
        line-height: 1.7;
      }

      .duidui-access-form {
        display: grid;
        gap: 12px;
      }

      .duidui-access-input {
        width: 100%;
        height: 52px;
        border: 1px solid rgba(255,255,255,0.16);
        border-radius: 16px;
        background: rgba(4, 14, 8, 0.55);
        color: #f3f8f4;
        padding: 0 16px;
        font: 600 16px/1 "Noto Sans Thai", "Sora", sans-serif;
        outline: none;
      }

      .duidui-access-input:focus {
        border-color: rgba(126, 235, 176, 0.68);
        box-shadow: 0 0 0 4px rgba(47, 184, 106, 0.14);
      }

      .duidui-access-actions {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 10px;
      }

      .duidui-access-button,
      .duidui-access-secondary {
        min-height: 48px;
        border: 0;
        border-radius: 15px;
        padding: 0 18px;
        font: 800 12px/1 "IBM Plex Sans Thai", "DM Mono", monospace;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        cursor: pointer;
      }

      .duidui-access-button {
        color: #07110b;
        background: linear-gradient(135deg, #7debb0, #d4bf64);
      }

      .duidui-access-secondary {
        color: rgba(243, 248, 244, 0.76);
        background: rgba(255,255,255,0.08);
        border: 1px solid rgba(255,255,255,0.12);
      }

      .duidui-access-error {
        min-height: 20px;
        margin: 0;
        color: #ffb2a6;
        font-size: 12px;
      }

      .duidui-access-panel.is-shaking {
        animation: duiduiAccessShake 240ms ease;
      }

      @keyframes duiduiAccessShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-8px); }
        75% { transform: translateX(8px); }
      }

      @media (max-width: 520px) {
        .duidui-access-art {
          grid-template-columns: 66px 1fr;
          padding: 20px 18px 8px;
        }

        .duidui-access-mascot {
          width: 66px;
          height: 66px;
          border-radius: 18px;
        }

        .duidui-access-body {
          padding: 8px 18px 20px;
        }

        .duidui-access-title {
          font-size: 24px;
        }

        .duidui-access-actions {
          grid-template-columns: 1fr;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function hasAccess() {
    return localStorage.getItem(ARTICLE_ACCESS_KEY) === ARTICLE_PASSWORD;
  }

  function grantAccess() {
    localStorage.setItem(ARTICLE_ACCESS_KEY, ARTICLE_PASSWORD);
  }

  function removeGate() {
    document.documentElement.classList.remove("duidui-access-lock");
    const gate = document.querySelector(".duidui-access-gate");
    if (gate) gate.remove();
  }

  function showGate(options) {
    injectAccessStyles();
    document.documentElement.classList.add("duidui-access-lock");

    const existing = document.querySelector(".duidui-access-gate");
    if (existing) existing.remove();

    const targetUrl = options && options.targetUrl;
    const gate = document.createElement("section");
    gate.className = "duidui-access-gate";
    gate.setAttribute("role", "dialog");
    gate.setAttribute("aria-modal", "true");
    gate.setAttribute("aria-labelledby", "duiduiAccessTitle");
    gate.innerHTML = `
      <div class="duidui-access-panel">
        <div class="duidui-access-art">
          <img class="duidui-access-mascot" src="assets/images/mascot/duidui-wink.png" alt="" />
          <div>
            <p class="duidui-access-kicker">Member memo</p>
            <h2 class="duidui-access-title" id="duiduiAccessTitle">ปลดล็อก DUIDUI Journal</h2>
          </div>
        </div>
        <div class="duidui-access-body">
          <p class="duidui-access-copy">ใส่รหัสสมาชิกเพื่ออ่านบทความเต็ม ระบบจะจำสิทธิ์ไว้ในเครื่องนี้สำหรับการอ่านครั้งถัดไป</p>
          <form class="duidui-access-form">
            <input class="duidui-access-input" type="password" autocomplete="current-password" placeholder="Access password" aria-label="Access password" />
            <div class="duidui-access-actions">
              <button class="duidui-access-button" type="submit">Unlock memo</button>
              <button class="duidui-access-secondary" type="button">กลับไป Blog</button>
            </div>
            <p class="duidui-access-error" aria-live="polite"></p>
          </form>
        </div>
      </div>
    `;

    document.body.appendChild(gate);

    const panel = gate.querySelector(".duidui-access-panel");
    const input = gate.querySelector(".duidui-access-input");
    const error = gate.querySelector(".duidui-access-error");
    const backButton = gate.querySelector(".duidui-access-secondary");

    gate.querySelector("form").addEventListener("submit", function (event) {
      event.preventDefault();
      if (input.value === ARTICLE_PASSWORD) {
        grantAccess();
        removeGate();
        if (targetUrl) window.location.href = targetUrl;
        return;
      }

      error.textContent = "รหัสยังไม่ถูก ต้องลองใหม่อีกครั้ง";
      panel.classList.remove("is-shaking");
      window.requestAnimationFrame(function () {
        panel.classList.add("is-shaking");
      });
      input.select();
    });

    backButton.addEventListener("click", function () {
      if (targetUrl) {
        removeGate();
        return;
      }
      window.location.href = "blog.html";
    });

    setTimeout(function () {
      input.focus();
    }, 60);
  }

  function requestAccess(targetUrl) {
    if (hasAccess()) {
      if (targetUrl) window.location.href = targetUrl;
      return true;
    }

    showGate({ targetUrl: targetUrl });
    return false;
  }

  window.DuiduiAccess = {
    hasAccess: hasAccess,
    request: requestAccess,
    lockArticle: function () {
      if (!hasAccess()) showGate();
    },
  };

  window.openProtectedArticle = function (url) {
    requestAccess(url);
  };

  window.handleProtectedArticleLink = function (event, url) {
    if (event) event.preventDefault();
    requestAccess(url);
    return false;
  };

  document.addEventListener("DOMContentLoaded", function () {
    const fileName = window.location.pathname.split("/").pop() || "index.html";
    if (fileName !== "blog.html") {
      window.DuiduiAccess.lockArticle();
    }
  });
})();
