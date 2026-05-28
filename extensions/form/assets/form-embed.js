(function () {
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function getRatingSvg(type, filled, color, size = 32) {
    const stroke = filled ? color : "#2e4a3f";
    const fill = filled ? color : "none";
    if (type === "heart") {
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill}" stroke="${stroke}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="cursor: pointer; transition: all 0.15s ease;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>`;
    } else if (type === "smile") {
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill}" stroke="${stroke}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="cursor: pointer; transition: all 0.15s ease;"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>`;
    } else if (type === "thumb") {
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill}" stroke="${stroke}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="cursor: pointer; transition: all 0.15s ease;"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>`;
    } else {
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill}" stroke="${stroke}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="cursor: pointer; transition: all 0.15s ease;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>`;
    }
  }

  function renderField(field, data) {
    const id = "fb-" + field.id;
    const required = field.required ? "required" : "";
    const minLengthAttr = field.limitCharacters && field.minCharacters ? `minlength="${field.minCharacters}"` : "";
    const maxLengthAttr = field.limitCharacters && field.maxCharacters ? `maxlength="${field.maxCharacters}"` : "";
    const limits = `${minLengthAttr} ${maxLengthAttr}`;
    const reqMark = field.required
      ? ' <span class="form-builder-embed__required">*</span>'
      : "";
    const placeholder = escapeHtml(field.placeholder || "");

    const br = data.borderRadius || "8px";
    const labelColor = data.labelColor || "#202223";
    const labelFontSize = data.labelFontSize || "14px";
    const inputBgColor = data.inputBgColor || "#ffffff";
    const inputTextColor = data.inputTextColor || "#202223";
    const inputBorderColor = data.inputBorderColor || "#bbc3c9";
    const fontFamily = data.fontFamily || "inherit";

    const labelHtml = `<label class="form-builder-embed__label" for="${id}" style="display:${field.hideLabel ? 'none' : 'block'}; font-weight:500; margin-bottom:5px; font-size:${labelFontSize}; color:${labelColor}; font-family:${fontFamily};">${escapeHtml(field.label)}${reqMark}</label>`;

    const inputStyle = `width:100%; padding:10px 12px; border:1px solid ${inputBorderColor}; border-radius:${br}; box-sizing:border-box; font-size:${labelFontSize}; background:${inputBgColor}; color:${inputTextColor}; outline:none; font-family:${fontFamily};`;

    let input = "";
    switch (field.type) {
      case "checkboxes": {
        const opts = (field.options || ["Option 1", "Option 2"])
          .map(
            (o) =>
              `<label style="display:flex; align-items:center; gap:8px; margin-bottom:6px; font-size:${labelFontSize}; color:${inputTextColor}; cursor:pointer;"><input type="checkbox" name="${field.id}" value="${escapeHtml(o)}" ${required} style="accent-color:${data.primaryColor || "#008060"}; width:16px; height:16px;" /> ${escapeHtml(o)}</label>`
          )
          .join("");
        input = `<div class="form-builder-embed__choices" style="display:flex; flex-direction:column; gap:4px; padding:4px 0;">${opts}</div>`;
        break;
      }
      case "radio": {
        const opts = (field.options || ["Option 1", "Option 2"])
          .map(
            (o) =>
              `<label style="display:flex; align-items:center; gap:8px; margin-bottom:6px; font-size:${labelFontSize}; color:${inputTextColor}; cursor:pointer;"><input type="radio" name="${field.id}" value="${escapeHtml(o)}" ${required} style="accent-color:${data.primaryColor || "#008060"}; width:16px; height:16px;" /> ${escapeHtml(o)}</label>`
          )
          .join("");
        input = `<div class="form-builder-embed__choices" style="display:flex; flex-direction:column; gap:4px; padding:4px 0;">${opts}</div>`;
        break;
      }
      case "consent": {
        const consentText = escapeHtml(field.placeholder || "I agree to the terms and conditions");
        input = `<div class="form-builder-embed__consent" style="display:flex; align-items:center; gap:8px; padding:4px 0; font-size:${labelFontSize}; color:${inputTextColor};">
          <label style="display:flex; align-items:flex-start; gap:8px; cursor:pointer;">
            <input type="checkbox" id="${id}" name="${field.id}" value="yes" ${required} style="accent-color:${data.primaryColor || "#008060"}; width:16px; height:16px; margin-top:2px;" />
            <span>${consentText}</span>
          </label>
        </div>`;
        break;
      }
      case "rating": {
        const iconType = field.ratingIcon || "star";
        const primaryColor = (data && data.primaryColor) || "#008060";
        const hasNumbers = !!field.showNumberUnderIcon;
        const iconSize = iconType === "star" ? 34 : 32;
        
        let starsHtml = "";
        for (let i = 1; i <= 5; i++) {
          const numberHtml = hasNumbers ? `<span style="font-size: 11px; color: #6b7280; font-weight: 550; margin-top: 4px;">${i}</span>` : "";
          starsHtml += `
            <div class="form-builder-embed__rating-item" data-value="${i}" style="display: flex; flex-direction: column; align-items: center; cursor: pointer; gap: 4px;">
              <span class="form-builder-embed__rating-icon-container">${getRatingSvg(iconType, false, primaryColor, iconSize)}</span>
              ${numberHtml}
            </div>
          `;
        }
        
        input = `
          <div class="form-builder-embed__rating-container" data-field-id="${field.id}" data-icon-type="${iconType}" data-color="${primaryColor}" data-size="${iconSize}" style="display: flex; gap: 14px; align-items: center; padding: 6px 0; margin-top: 2px;">
            ${starsHtml}
            <input type="hidden" id="${id}" name="${field.id}" value="" ${required} />
          </div>
        `;
        break;
      }
      case "feedback": {
        const hasNumbers = !!field.showNumberUnderIcon;
        const emojis = [
          { emoji: "😠", label: "Very Bad" },
          { emoji: "🙁", label: "Bad" },
          { emoji: "😐", label: "Neutral" },
          { emoji: "🙂", label: "Good" },
          { emoji: "😄", label: "Excellent" }
        ];
        
        let emojisHtml = "";
        emojis.forEach((item, idx) => {
          const val = idx + 1;
          const numberHtml = hasNumbers ? `<span class="form-builder-embed__feedback-number" style="font-size: 11px; color: #6b7280; font-weight: 550; margin-top: 4px; transition: all 0.2s ease;">${val}</span>` : "";
          emojisHtml += `
            <div class="form-builder-embed__feedback-item" data-value="${val}" style="display: flex; flex-direction: column; align-items: center; cursor: pointer; gap: 4px; filter: grayscale(100%); opacity: 0.4; transition: all 0.2s ease; transform: scale(1);">
              <span style="font-size: 32px; line-height: 1;">${item.emoji}</span>
              ${numberHtml}
            </div>
          `;
        });
        
        input = `
          <div class="form-builder-embed__feedback-container" data-field-id="${field.id}" style="display: flex; gap: 18px; align-items: center; padding: 6px 0; margin-top: 2px;">
            ${emojisHtml}
            <input type="hidden" id="${id}" name="${field.id}" value="" ${required} />
          </div>
        `;
        break;
      }
      
      case "textarea":
        input = `<textarea class="form-builder-embed__textarea" id="${id}" name="${field.id}" placeholder="${placeholder}" ${required} ${limits} style="${inputStyle} min-height:100px; resize:vertical;"></textarea>`;
        break;
      case "select":
      case "dropdown": {
        const opts = (field.options || [])
          .map(
            (o) =>
              `<option value="${escapeHtml(o)}">${escapeHtml(o)}</option>`
          )
          .join("");
        input = `<select class="form-builder-embed__select" id="${id}" name="${field.id}" ${required} style="${inputStyle}"><option value="">Select…</option>${opts}</select>`;
        break;
      }
      case "email":
        input = `<input class="form-builder-embed__input" type="email" id="${id}" name="${field.id}" placeholder="${placeholder}" ${required} style="${inputStyle}" ${limits} />`;
        break;
      case "tel":
      case "phone":
        input = `<input class="form-builder-embed__input" type="tel" id="${id}" name="${field.id}" placeholder="${placeholder}" ${required} style="${inputStyle}" ${limits} />`;
        break;
      case "url":
        input = `<input class="form-builder-embed__input" type="url" id="${id}" name="${field.id}" placeholder="${placeholder}" ${required} style="${inputStyle}" ${limits} />`;
        break;
      case "number":
        input = `<input class="form-builder-embed__input" type="number" id="${id}" name="${field.id}" placeholder="${placeholder}" ${required} style="${inputStyle}" />`;
        break;
      case "file":
        input = `<input class="form-builder-embed__input" type="file" id="${id}" name="${field.id}" ${required} style="${inputStyle}" />`;
        break;
      case "heading":
        return `<div style="margin-bottom:16px; grid-column:span 6;"><h3 style="margin:0; color:${data.titleColor || "#202223"}; font-family:${fontFamily};">${escapeHtml(field.label)}</h3></div>`;
      case "paragraph":
        return `<div style="margin-bottom:16px; color:${data.descriptionColor || "#6d7175"}; font-size:${data.descriptionFontSize || "14px"}; font-family:${fontFamily}; grid-column:span 6;">${escapeHtml(field.label)}</div>`;
      case "divider":
        return `<hr style="border:none; border-top:1px solid ${inputBorderColor}; margin:16px 0; grid-column:span 6;">`;
      case "range":
        input = `<input style="width:100%; accent-color:${data.primaryColor || "#008060"};" type="range" name="${field.id}" ${required}>`;
        break;
      case "color":
        input = `<input style="width:60px; height:36px; border:1px solid ${inputBorderColor}; border-radius:${br}; padding:2px; background:${inputBgColor}; cursor:pointer;" type="color" name="${field.id}">`;
        break;
      case "switch":
        input = `<label style="display:flex; align-items:center; gap:10px; cursor:pointer;"><input type="checkbox" name="${field.id}" style="accent-color:${data.primaryColor || "#008060"}; width:18px; height:18px;"> <span style="font-size:${labelFontSize}; color:${inputTextColor};">${escapeHtml(field.placeholder || "Toggle")}</span></label>`;
        break;
      default:
        input = `<input class="form-builder-embed__input" type="text" id="${id}" name="${field.id}" placeholder="${placeholder}" ${required} style="${inputStyle}" ${limits} />`;
    }

    const isNaturallyFull = [
      "file",
      "select",
      "dropdown",
      "textarea",
      "heading",
      "paragraph",
      "divider",
      "button",
      "repeater",
      "matrix",
      "html",
      "image-options",
      "signature",
      "product",
      "feedback",
      "hidden",
    ].includes(field.type);

    let gridSpan = "span 6";
    if (field.columnWidth === "33%") {
      gridSpan = "span 2";
    } else if (field.columnWidth === "50%") {
      gridSpan = "span 3";
    } else if (field.columnWidth === "100%") {
      gridSpan = "span 6";
    } else {
      gridSpan = isNaturallyFull ? "span 6" : "span 3";
    }

    return `<div class="form-builder-embed__field" style="grid-column:${gridSpan}; margin-bottom:8px;">${labelHtml}${input}</div>`;
  }

  function renderForm(container, data, proxyUrl) {
    const color = data.primaryColor || "#008060";
    const br = data.borderRadius || "8px";
    const fontFamily = data.fontFamily || "inherit";
    const backgroundColor = data.backgroundColor || "#ffffff";
    const titleColor = data.titleColor || "#202223";
    const titleFontSize = data.titleFontSize || "26px";
    const descriptionColor = data.descriptionColor || "#6d7175";
    const descriptionFontSize = data.descriptionFontSize || "14px";
    const btnTextColor = data.btnTextColor || "#ffffff";
    const inputBorderColor = data.inputBorderColor || "#bbc3c9";

    const fieldsHtml = (data.fields || []).map(f => renderField(f, data)).join("");

    const submitText = data.footerSubmitText || "Submit";
    const showReset = !!data.footerShowReset;
    const fullWidth = !!data.footerFullWidth;

    let buttonsStyle = `display: flex; gap: 12px; margin-top: 16px; align-items: center; flex-wrap: wrap; grid-column: span 6;`;
    if (fullWidth) {
      buttonsStyle = `display: flex; flex-direction: column; gap: 8px; margin-top: 16px; width: 100%; grid-column: span 6;`;
    }

    const submitBtnStyle = `background:${escapeHtml(color)}; color:${escapeHtml(btnTextColor)}; padding: 12px 28px; border: none; border-radius: ${br}; font-size: 16px; font-weight: 600; cursor: pointer; text-align: center; width: ${fullWidth ? "100%" : "auto"}; font-family: ${fontFamily}; transition: opacity 0.2s;`;
    const resetBtnStyle = `background: #f1f3f4; border: none; color: #202223; padding: 12px 28px; border-radius: ${br}; font-size: 16px; font-weight: 600; cursor: pointer; text-align: center; width: ${fullWidth ? "100%" : "auto"}; font-family: ${fontFamily};`;

    const buttonsHtml = `
      <div class="fb-submit-container" style="${buttonsStyle}">
        ${showReset ? `<button type="reset" class="form-builder-embed__reset" style="${resetBtnStyle}">Reset</button>` : ""}
        <button type="submit" class="form-builder-embed__submit" style="${submitBtnStyle}">${escapeHtml(submitText)}</button>
      </div>
    `;

    const footerTextHtml = data.footerText ? `<div class="form-builder-embed__footer-text" style="font-size: 13px; color: ${descriptionColor}; margin-top: 16px; line-height: 1.5; grid-column: span 6; font-family: ${fontFamily};">${data.footerText}</div>` : "";

    const containerStyle = `font-family:${fontFamily}; max-width:620px; margin:0 auto; padding:32px; border-radius:${br}; background:${backgroundColor}; box-sizing:border-box;`;

    const gridStyleBlock = `
      <style>
        .form-builder-embed__form {
          display: grid !important;
          grid-template-columns: repeat(6, 1fr) !important;
          gap: 16px !important;
          width: 100% !important;
        }
        @media (max-width: 600px) {
          .form-builder-embed__form {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .form-builder-embed__field {
            grid-column: span 1 !important;
          }
        }
      </style>
    `;

    container.innerHTML = `
      ${gridStyleBlock}
      <div class="form-builder-embed__wrapper" style="${containerStyle}">
        <form class="form-builder-embed__form" novalidate>
          <h2 class="form-builder-embed__title" style="margin: 0 0 8px; color: ${titleColor}; font-size: ${titleFontSize}; font-family: ${fontFamily}; grid-column: span 6;">${escapeHtml(data.title)}</h2>
          ${data.description ? `<p class="form-builder-embed__description" style="color: ${descriptionColor}; font-size: ${descriptionFontSize}; margin: 0 0 24px; font-family: ${fontFamily}; grid-column: span 6;">${escapeHtml(data.description)}</p>` : ""}
          ${fieldsHtml}
          ${footerTextHtml}
          ${buttonsHtml}
        </form>
      </div>
      <div class="form-builder-embed__success" style="display: none; text-align: center; padding: 40px 20px; border: 1px solid ${inputBorderColor}; background: ${backgroundColor}; border-radius: ${br}; color: ${color}; margin: 0 auto; max-width: 620px; font-family: ${fontFamily};">
        <h3 style="margin-top:0; font-size: 20px; font-weight: 600; color: ${titleColor}; font-family: ${fontFamily};">${escapeHtml(data.successTitle || "Thank you!")}</h3>
        <p style="color: ${descriptionColor}; margin-bottom: 0; font-family: ${fontFamily};">${data.successMessage || "Your submission has been received successfully."}</p>
      </div>
    `;


    // Add interactive rating handlers
    container.querySelectorAll(".form-builder-embed__rating-container").forEach((ratingContainer) => {
      const fieldId = ratingContainer.dataset.fieldId;
      const iconType = ratingContainer.dataset.iconType;
      const color = ratingContainer.dataset.color;
      const iconSize = parseInt(ratingContainer.dataset.size || "32", 10);
      const hiddenInput = ratingContainer.querySelector("input[type='hidden']");
      const items = ratingContainer.querySelectorAll(".form-builder-embed__rating-item");
      
      items.forEach((item) => {
        const itemVal = parseInt(item.dataset.value, 10);
        
        // On Click
        item.addEventListener("click", () => {
          hiddenInput.value = itemVal;
          // Highlight active icons up to clicked value
          items.forEach((subItem) => {
            const subVal = parseInt(subItem.dataset.value, 10);
            const containerSpan = subItem.querySelector(".form-builder-embed__rating-icon-container");
            containerSpan.innerHTML = getRatingSvg(iconType, subVal <= itemVal, color, iconSize);
          });
        });
        
        // On Hover (Mouse Enter)
        item.addEventListener("mouseenter", () => {
          items.forEach((subItem) => {
            const subVal = parseInt(subItem.dataset.value, 10);
            const containerSpan = subItem.querySelector(".form-builder-embed__rating-icon-container");
            containerSpan.innerHTML = getRatingSvg(iconType, subVal <= itemVal, color, iconSize);
          });
        });
      });
      
      // On Mouse Leave: reset to currently selected value
      ratingContainer.addEventListener("mouseleave", () => {
        const currentVal = parseInt(hiddenInput.value || "0", 10);
        items.forEach((subItem) => {
          const subVal = parseInt(subItem.dataset.value, 10);
          const containerSpan = subItem.querySelector(".form-builder-embed__rating-icon-container");
          containerSpan.innerHTML = getRatingSvg(iconType, subVal <= currentVal, color, iconSize);
        });
      });
    });

    // Add interactive feedback handlers
    container.querySelectorAll(".form-builder-embed__feedback-container").forEach((feedbackContainer) => {
      const hiddenInput = feedbackContainer.querySelector("input[type='hidden']");
      const items = feedbackContainer.querySelectorAll(".form-builder-embed__feedback-item");
      
      items.forEach((item) => {
        const itemVal = parseInt(item.dataset.value, 10);
        
        // On Click
        item.addEventListener("click", () => {
          hiddenInput.value = itemVal;
          // Update visual active state: only the selected emoji is colorful and scaled up
          items.forEach((subItem) => {
            const subVal = parseInt(subItem.dataset.value, 10);
            if (subVal === itemVal) {
              subItem.style.filter = "grayscale(0%)";
              subItem.style.opacity = "1";
              subItem.style.transform = "scale(1.2)";
            } else {
              subItem.style.filter = "grayscale(100%)";
              subItem.style.opacity = "0.4";
              subItem.style.transform = "scale(1)";
            }
          });
        });
        
        // On Hover (Mouse Enter)
        item.addEventListener("mouseenter", () => {
          items.forEach((subItem) => {
            const subVal = parseInt(subItem.dataset.value, 10);
            if (subVal === itemVal) {
              subItem.style.filter = "grayscale(0%)";
              subItem.style.opacity = "1";
              subItem.style.transform = "scale(1.2)";
            } else {
              subItem.style.filter = "grayscale(100%)";
              subItem.style.opacity = "0.4";
              subItem.style.transform = "scale(1)";
            }
          });
        });
      });
      
      // On Mouse Leave: reset to currently selected value
      feedbackContainer.addEventListener("mouseleave", () => {
        const currentVal = parseInt(hiddenInput.value || "0", 10);
        items.forEach((subItem) => {
          const subVal = parseInt(subItem.dataset.value, 10);
          if (subVal === currentVal) {
            subItem.style.filter = "grayscale(0%)";
            subItem.style.opacity = "1";
            subItem.style.transform = "scale(1.2)";
          } else {
            subItem.style.filter = "grayscale(100%)";
            subItem.style.opacity = "0.4";
            subItem.style.transform = "scale(1)";
          }
        });
      });
    });
    const form = container.querySelector("form");
    const wrapper = container.querySelector(".form-builder-embed__wrapper");
    const successDiv = container.querySelector(".form-builder-embed__success");

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      const btn = form.querySelector("button");
      btn.disabled = true;
      btn.innerText = "Submitting...";

      // Validate fields before submitting since form has novalidate
      let isValid = true;
      const validationInputs = form.querySelectorAll("input, textarea, select");
      for (const input of Array.from(validationInputs)) {
        if (input.name) {
          const fieldId = "fb-" + input.name;
          const labelEl = form.querySelector(`label[for="${fieldId}"]`) || form.querySelector(`label[for="${input.id}"]`);
          const labelText = labelEl ? labelEl.textContent.replace(/\s*\*$/, "").trim() : input.name;

          // 1. Required validation
          if (input.hasAttribute("required")) {
            if (input.type === "checkbox" || input.type === "radio") {
              const group = form.querySelectorAll(`[name="${input.name}"]`);
              const oneChecked = Array.from(group).some(i => i.checked);
              if (!oneChecked) {
                alert(`${labelText} is required.`);
                isValid = false;
                break;
              }
            } else if (!input.value.trim()) {
              alert(`${labelText} is required.`);
              isValid = false;
              break;
            }
          }

          // 2. Character limit validation
          const isTextInput = ["text", "textarea", "email", "url", "password", "tel"].includes(input.type || "text");
          if (isTextInput && input.value.trim()) {
            const minLen = input.getAttribute("minlength");
            const maxLen = input.getAttribute("maxlength");
            const valLen = input.value.length;

            if (minLen && valLen < parseInt(minLen, 10)) {
              alert(`${labelText} must be at least ${minLen} characters.`);
              isValid = false;
              break;
            }
            if (maxLen && valLen > parseInt(maxLen, 10)) {
              alert(`${labelText} cannot exceed ${maxLen} characters.`);
              isValid = false;
              break;
            }
          }
        }
      }

      if (!isValid) {
        btn.disabled = false;
        btn.innerText = "Submit";
        return;
      }

      // Get values of all fields inside the form mapped to their labels
      const payload = {};
      const inputs = form.querySelectorAll("input, textarea, select");
      inputs.forEach((input) => {
        if (input.name) {
          const fieldId = "fb-" + input.name;
          const labelEl = form.querySelector(`label[for="${fieldId}"]`) || form.querySelector(`label[for="${input.id}"]`);
          const labelText = labelEl ? labelEl.textContent.replace(/\s*\*$/, "").trim() : input.name;

          if (input.type === "checkbox") {
            if (input.checked) {
              if (payload[labelText]) {
                if (Array.isArray(payload[labelText])) {
                  payload[labelText].push(input.value);
                } else {
                  payload[labelText] = [payload[labelText], input.value];
                }
              } else {
                payload[labelText] = input.value;
              }
            } else {
              if (payload[labelText] === undefined) {
                payload[labelText] = "";
              }
            }
          } else if (input.type === "radio") {
            if (input.checked) {
              payload[labelText] = input.value;
            }
          } else {
            payload[labelText] = input.value;
          }
        }
      });

      try {
        const response = await fetch(proxyUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const action = data.afterSubmitAction || "successful";
          if (action === "redirect" && data.redirectUrl) {
            window.location.href = data.redirectUrl;
          } else if (action === "clear") {
            form.reset();
            btn.disabled = false;
            btn.innerText = "Submit";
            
            // Create premium, non-blocking floating toast message
            const toast = document.createElement("div");
            toast.style.cssText = "position: fixed; bottom: 24px; right: 24px; background: #202223; color: #fff; padding: 12px 24px; border-radius: 8px; font-size: 14px; z-index: 10000; box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-family: inherit;";
            toast.innerText = data.successTitle || "Success!";
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 4000);
          } else if (action === "hide") {
            wrapper.style.display = "none";
          } else {
            // successful
            wrapper.style.display = "none";
            successDiv.style.display = "block";
          }
        } else {
          const errData = await response.json().catch(() => ({}));
          alert(errData.error || "There was an error submitting the form. Please try again.");
          btn.disabled = false;
          btn.innerText = "Submit";
        }
      } catch (err) {
        console.error(err);
        alert("Failed to submit form. Please check your connection.");
        btn.disabled = false;
        btn.innerText = "Submit";
      }
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
          renderForm(container, data, proxyUrl);
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
