document.addEventListener("DOMContentLoaded", () => {
  // ============================================
  // ELEMENTS
  // ============================================

  const description = document.getElementById("description");

  const enhanceButton = document.getElementById("enhanceDescription");

  const buttonText = document.getElementById("aiButtonText");

  const buttonIcon = document.getElementById("aiButtonIcon");

  const loading = document.getElementById("aiLoading");

  // ============================================
  // AI ENHANCE
  // ============================================

  enhanceButton.addEventListener("click", async () => {
    const text = description.value.trim();

    // ----------------------------------------
    // EMPTY DESCRIPTION
    // ----------------------------------------

    if (!text) {
      alert("Please write a description first.");

      description.focus();

      return;
    }

    // ----------------------------------------
    // MINIMUM LENGTH
    // ----------------------------------------

    if (text.length < 10) {
      alert("Please write at least 10 characters.");

      description.focus();

      return;
    }

    // ----------------------------------------
    // LOADING STATE
    // ----------------------------------------

    enhanceButton.disabled = true;

    buttonIcon.textContent = "⏳";

    buttonText.textContent = "Enhancing...";

    loading.style.display = "inline";

    try {
      // ------------------------------------
      // SEND TO BACKEND
      // ------------------------------------

      const response = await fetch("/listings/enhance-description", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          description: text,
        }),
      });

      const data = await response.json();

      // ------------------------------------
      // ERROR
      // ------------------------------------

      if (!response.ok) {
        throw new Error(data.error || "Failed to enhance description");
      }

      // ------------------------------------
      // PUT AI RESULT INTO TEXTAREA
      // ------------------------------------

      description.value = data.enhanced;

      console.log("AI Enhanced Description:", data.enhanced);
    } catch (error) {
      console.error("AI Enhancement Error:", error);

      alert("Unable to enhance description. Please try again.");
    } finally {
      // ------------------------------------
      // RESTORE BUTTON
      // ------------------------------------

      enhanceButton.disabled = false;

      buttonIcon.textContent = "✨";

      buttonText.textContent = "Enhance with AI";

      loading.style.display = "none";
    }
  });
});
