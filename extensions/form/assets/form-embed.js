(function () {
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderField(field) {
    const id = "fb-" + field.id;
    const required = field.required ? "required" : "";
    const reqMark = field.required
      ? ' <span class="form-builder-embed__required">*</span>'
      : "";
    const label = `<label class="form-builder-embed__label" for="${id}">${escapeHtml(field.label)}${reqMark}</label>`;
    const placeholder = escapeHtml(field.placeholder || "");

    let input = "";
    switch (field.type) {
      case "textarea":
        input = `<textarea class="form-builder-embed__textarea" id="${id}" name="${field.id}" placeholder="${placeholder}" ${required}></textarea>`;
        break;
      case "select":
      case "dropdown": {
        const opts = (field.options || [])
          .map(
            (o) =>
              `<option value="${escapeHtml(o)}">${escapeHtml(o)}</option>`
          )
          .join("");
        input = `<select class="form-builder-embed__select" id="${id}" name="${field.id}" ${required}><option value="">Select…</option>${opts}</select>`;
        break;
      }
      case "email":
        input = `<input class="form-builder-embed__input" type="email" id="${id}" name="${field.id}" placeholder="${placeholder}" ${required} />`;
        break;
      case "tel":
      case "phone":
        input = `<input class="form-builder-embed__input" type="tel" id="${id}" name="${field.id}" placeholder="${placeholder}" ${required} />`;
        break;
      case "url":
        input = `<input class="form-builder-embed__input" type="url" id="${id}" name="${field.id}" placeholder="${placeholder}" ${required} />`;
        break;
      case "number":
        input = `<input class="form-builder-embed__input" type="number" id="${id}" name="${field.id}" placeholder="${placeholder}" ${required} />`;
        break;
      case "file":
        input = `<input class="form-builder-embed__input" type="file" id="${id}" name="${field.id}" ${required} />`;
        break;
      default:
        input = `<input class="form-builder-embed__input" type="text" id="${id}" name="${field.id}" placeholder="${placeholder}" ${required} />`;
    }

    return `<div class="form-builder-embed__field">${label}${input}</div>`;
  }

  function renderForm(container, data) {
    const color = data.primaryColor || "#008060";
    const fieldsHtml = (data.fields || []).map(renderField).join("");

    container.innerHTML = `
      <form class="form-builder-embed__form" novalidate>
        <h2 class="form-builder-embed__title">${escapeHtml(data.title)}</h2>
        ${data.description ? `<p class="form-builder-embed__description">${escapeHtml(data.description)}</p>` : ""}
        ${fieldsHtml}
        <button type="submit" class="form-builder-embed__submit" style="background:${escapeHtml(color)}">Submit</button>
      </form>
    `;

    const form = container.querySelector("form");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("Thank you! Form submission will be connected soon.");
    });
  }

  function showError(container, message) {
    container.innerHTML = `<div class="form-builder-embed__error">${escapeHtml(message)}</div>`;
  }

  async function fetchForm(proxyUrl) {
    const res = await fetch(proxyUrl, {
      headers: { Accept: "application/json" },
      credentials: "same-origin",
    });

    const text = await res.text();

    if (!text || !text.trim()) {
      throw new Error(
        "Empty response from Form Builder. Restart the app (npm run dev) and reinstall the app on your store."
      );
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (_) {
      throw new Error(
        "Form Builder returned an invalid response. Confirm the app is running and the Form ID is correct."
      );
    }

    if (!res.ok) {
      throw new Error(data.error || "Failed to load form");
    }

    return data;
  }

  function init() {
    document.querySelectorAll("[data-form-builder]").forEach(function (container) {
      const formId = container.dataset.formId;
      const proxyUrl = container.dataset.proxyUrl;

      if (!formId || !proxyUrl) {
        showError(container, "Form ID is missing.");
        return;
      }

      fetchForm(proxyUrl)
        .then(function (data) {
          if (!data.fields || data.fields.length === 0) {
            showError(
              container,
              "This form has no fields. Open the form in Form Builder and click Continue again."
            );
            return;
          }
          renderForm(container, data);
        })
        .catch(function (err) {
          showError(container, err.message || "Could not load form.");
        });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
