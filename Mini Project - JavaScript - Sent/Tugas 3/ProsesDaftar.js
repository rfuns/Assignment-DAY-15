  (function () {
        const form = document.getElementById("memberForm");
        const nameInput = document.getElementById("nameInput");
        const emailInput = document.getElementById("emailInput");
        const passwordInput = document.getElementById("passwordInput");

        const nameError = document.getElementById("nameError");
        const emailError = document.getElementById("emailError");
        const passwordError = document.getElementById("passwordError");

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        function toggleError(input, errorEl, isValid) {
          if (isValid) {
            errorEl.classList.add("hidden");
            input.classList.remove("border-red-500");
          } else {
            errorEl.classList.remove("hidden");
            input.classList.add("border-red-500");
          }
        }

        form.addEventListener("submit", (e) => {
          e.preventDefault();

          const nameOk = nameInput.value.trim() !== "";
          const emailOk = emailPattern.test(emailInput.value.trim());
          const passwordOk = passwordInput.value.length >= 6;

          toggleError(nameInput, nameError, nameOk);
          toggleError(emailInput, emailError, emailOk);
          toggleError(passwordInput, passwordError, passwordOk);

          if (!nameOk || !emailOk || !passwordOk) {
            return;
          }

          //* Tandai sudah melewati halaman login + simpan status member
          localStorage.setItem("visitedLogin", "true");
          localStorage.setItem("isMember", "true");
          localStorage.setItem("memberName", nameInput.value.trim());
          localStorage.setItem("memberEmail", emailInput.value.trim());

          //* Pindah ke halaman produk (Kaos Kaki Premium Combed)
          window.location.href = "../Tugas 1/index.html";
        });

        //* Lewati: lanjut ke produk tanpa menjadi member (tidak dapat diskon)
        const skipBtn = document.getElementById("skipBtn");
        skipBtn.addEventListener("click", () => {
          localStorage.setItem("visitedLogin", "true");
          localStorage.setItem("isMember", "false");
          window.location.href = "../Tugas 1/index.html";
        });
      })();