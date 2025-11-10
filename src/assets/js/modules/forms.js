const encodeFormData = (formData) => {
  const params = new URLSearchParams();
  formData.forEach((value, key) => {
    params.append(key, value);
  });
  return params.toString();
};

const setupForm = (form, successId, errorId) => {
  if (!form) return null;

  const submitButton = form.querySelector('button[type="submit"]');
  const successMessage = successId ? document.getElementById(successId) : null;
  const errorMessage = errorId ? document.getElementById(errorId) : null;
  const defaultButtonHTML = submitButton ? submitButton.innerHTML : "";

  const setSubmittingState = (isSubmitting) => {
    if (!submitButton) return;
    submitButton.disabled = isSubmitting;
    submitButton.classList.toggle("is-loading", isSubmitting);
    submitButton.innerHTML = isSubmitting ? "Sending…" : defaultButtonHTML;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (successMessage) successMessage.hidden = true;
    if (errorMessage) errorMessage.hidden = true;

    const formData = new FormData(form);
    if (!formData.has("form-name")) {
      formData.append("form-name", form.getAttribute("name") || "lead-form");
    }

    try {
      setSubmittingState(true);
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodeFormData(formData)
      });

      if (!response.ok) {
        throw new Error(`Form submission failed: ${response.status}`);
      }

      form.reset();
      if (successMessage) successMessage.hidden = false;
    } catch (error) {
      console.error("Form submission failed", error);
      if (errorMessage) errorMessage.hidden = false;
    } finally {
      setSubmittingState(false);
    }
  };

  form.addEventListener("submit", handleSubmit);
  return () => form.removeEventListener("submit", handleSubmit);
};

export const initLeadForm = () => setupForm(document.getElementById("lead-form"), "lead-success", "lead-error");
export const initContactForm = () => setupForm(document.getElementById("contact-form"), "form-success", "form-error");

const initForms = () => {
  initLeadForm();
  initContactForm();
};

export default initForms;
