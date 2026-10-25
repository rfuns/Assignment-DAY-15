      (function () {
        //* Wajib lewati halaman Login/Daftar Member dulu sebelum buka produk

        if (localStorage.getItem("visitedLogin") !== "true") {
          window.location.href = "../Tugas 3/LoginMember.html";
          return;
        }

        //* Diskon produk: member dapat 10%, non-member tanpa diskon
        const BASE_PRICE = 45000; //? Harga normal (tanpa diskon)
        const MEMBER_DISCOUNT_RATE = 0.1;

        function formatRupiah(value) {
          return "Rp" + value.toLocaleString("id-ID");
        }

        function applyMemberPrice() {
          const isMember = localStorage.getItem("isMember") === "true";
          const priceNow = document.getElementById("priceNow");
          const priceOld = document.getElementById("priceOld");
          const badge = document.getElementById("badgeDiscount");

          if (isMember) {
            const discounted = Math.round(
              BASE_PRICE * (1 - MEMBER_DISCOUNT_RATE),
            );
            priceNow.textContent = formatRupiah(discounted);
            priceOld.textContent = formatRupiah(BASE_PRICE);
            priceOld.style.display = "";
            badge.textContent = "-10%";
            badge.style.display = "";
          } else {
            // Bukan member: tidak ada diskon
            priceNow.textContent = formatRupiah(BASE_PRICE);
            priceOld.style.display = "none";
            badge.style.display = "none";
          }
        }

        applyMemberPrice();

        //* ====== Area akun: Daftar / Ikon member + profil + logout ======
        (function setupAccountArea() {
          const isMember = localStorage.getItem("isMember") === "true";
          const daftarBtn = document.getElementById("daftarBtn");
          const memberWrap = document.getElementById("memberWrap");
          const memberIconBtn = document.getElementById("memberIconBtn");
          const memberMenu = document.getElementById("memberMenu");
          const memberInitial = document.getElementById("memberInitial");
          const profileName = document.getElementById("profileName");
          const profileEmail = document.getElementById("profileEmail");
          const logoutBtn = document.getElementById("logoutBtn");

          if (isMember) {
            //* Member: sembunyikan Daftar, tampilkan ikon member
            daftarBtn.style.display = "none";
            memberWrap.style.display = "inline-block";

            const name = localStorage.getItem("memberName") || "Member";
            const email = localStorage.getItem("memberEmail") || "-";
            profileName.textContent = name;
            profileEmail.textContent = email;
            memberInitial.textContent = name.trim().charAt(0).toUpperCase() || "M";
          } else {
            //* Bukan member: tampilkan Daftar, sembunyikan ikon member
            daftarBtn.style.display = "inline-flex";
            memberWrap.style.display = "none";
          }

          //* Toggle menu profil
          if (memberIconBtn) {
            memberIconBtn.addEventListener("click", (e) => {
              e.stopPropagation();
              const willShow = memberMenu.hidden;
              memberMenu.hidden = !willShow;
              memberIconBtn.setAttribute("aria-expanded", String(willShow));
            });

            //* Klik di luar menu -> tutup
            document.addEventListener("click", (e) => {
              if (!memberWrap.contains(e.target)) {
                memberMenu.hidden = true;
                memberIconBtn.setAttribute("aria-expanded", "false");
              }
            });
          }

          //* Logout: hapus status member lalu kembali ke halaman login
          if (logoutBtn) {
            logoutBtn.addEventListener("click", () => {
              localStorage.removeItem("isMember");
              localStorage.removeItem("memberName");
              localStorage.removeItem("memberEmail");
              localStorage.removeItem("visitedLogin");
              window.location.href = "../Tugas 3/LoginMember.html";
            });
          }
        })();

        const mainImage = document.getElementById("mainImage");
        const mainCaption = document.querySelector(".gallery-caption");
        const thumbs = document.querySelectorAll(".ListGambar");
        const swatches = document.querySelectorAll(".color-swatch");
        const colorLabel = document.querySelector(".variant-label strong");

        //* Update the main gallery image + caption
        function setMainImage(src, caption, altText) {
          if (src) mainImage.src = src;
          if (caption) {
            mainCaption.textContent = caption;
            mainImage.alt = altText || caption;
          }
        }

        //* 1) Thumbnail click -> change gallery-main image
        thumbs.forEach((thumb) => {
          thumb.addEventListener("click", () => {
            thumbs.forEach((t) => t.classList.remove("is-active"));
            thumb.classList.add("is-active");
            setMainImage(
              thumb.dataset.full,
              thumb.dataset.caption,
              thumb.dataset.caption,
            );
          });
        });

        //* 2) Color swatch select -> change gallery-main image
        swatches.forEach((swatch) => {
          swatch.addEventListener("click", () => {
            swatches.forEach((s) => s.classList.remove("is-selected"));
            swatch.classList.add("is-selected");

            const color = swatch.dataset.color;
            if (colorLabel) colorLabel.textContent = color;

            setMainImage(
              swatch.dataset.full,
              swatch.dataset.caption,
              swatch.dataset.caption,
            );

            //* Sync active thumbnail to the matching color image
            thumbs.forEach((t) => {
              const match = t.dataset.full === swatch.dataset.full;
              t.classList.toggle("is-active", match);
            });
          });
        });

        //* 3) Size options -> selectable, styled when active
        const sizeOptions = document.querySelectorAll(".sizeoption");
        const sizeLabel = document.querySelector(".variant-label .muted");
        const sizeWarning = document.getElementById("sizeWarning");

        //* Ambil ukuran yang dipilih; null jika belum ada
        function getSelectedSize() {
          const selected = document.querySelector(".sizeoption.is-selected");
          return selected ? selected.textContent.trim() : null;
        }

        //* Tampilkan peringatan jika ukuran belum dipilih
        function showSizeWarning() {
          if (sizeWarning) sizeWarning.hidden = false;
        }
        function hideSizeWarning() {
          if (sizeWarning) sizeWarning.hidden = true;
        }

        sizeOptions.forEach((size) => {
          size.addEventListener("click", () => {
            sizeOptions.forEach((s) => s.classList.remove("is-selected"));
            size.classList.add("is-selected");
            if (sizeLabel) sizeLabel.textContent = size.textContent.trim();
            hideSizeWarning();
          });
        });

        //* 4) Quantity: min 1 (disable "-"), max 15 (disable "+")
        const MIN_QTY = 1;
        const MAX_QTY = 15;
        const qtyInput = document.querySelector(".qty-input");
        const qtyButtons = document.querySelectorAll(".qty-btn");
        const minusBtn = qtyButtons[0];
        const plusBtn = qtyButtons[1];

        function clampQty(value) {
          let n = parseInt(value, 10);
          if (isNaN(n)) n = MIN_QTY;
          if (n < MIN_QTY) n = MIN_QTY;
          if (n > MAX_QTY) n = MAX_QTY;
          return n;
        }

        function updateQty(value) {
          const n = clampQty(value);
          qtyInput.value = n;
          minusBtn.disabled = n <= MIN_QTY;
          plusBtn.disabled = n >= MAX_QTY;
        }

        minusBtn.addEventListener("click", () => {
          updateQty(parseInt(qtyInput.value, 10) - 1);
        });

        plusBtn.addEventListener("click", () => {
          updateQty(parseInt(qtyInput.value, 10) + 1);
        });

        qtyInput.addEventListener("input", () => {
          const digits = qtyInput.value.replace(/[^0-9]/g, "");
          qtyInput.value = digits;
        });

        qtyInput.addEventListener("change", () => {
          updateQty(qtyInput.value);
        });

        //* Initialize quantity button states
        updateQty(qtyInput.value);

        //* 5) Tabs: switch tab-content panel when a tab is clicked
        const tabs = document.querySelectorAll(".tab");
        const panels = document.querySelectorAll(".tab-panel");
        tabs.forEach((tab) => {
          tab.addEventListener("click", () => {
            tabs.forEach((t) => {
              t.classList.remove("is-active");
              t.setAttribute("aria-selected", "false");
            });
            tab.classList.add("is-active");
            tab.setAttribute("aria-selected", "true");

            const target = tab.dataset.tab;
            panels.forEach((panel) => {
              panel.classList.toggle(
                "is-active",
                panel.dataset.panel === target,
              );
            });
          });
        });

        //* 6) Tambah ke Keranjang -> buka halaman keranjang dengan pilihan saat ini
        const addToCartBtn = document.getElementById("addToCartBtn");
        addToCartBtn.addEventListener("click", () => {
          const selectedColor = document.querySelector(
            ".color-swatch.is-selected",
          );
          const color = selectedColor ? selectedColor.dataset.color : "Hitam";

          const size = getSelectedSize();
          if (!size) {
            showSizeWarning();
            return;
          }

          const qty = clampQty(qtyInput.value);

          const query = new URLSearchParams({
            color: color,
            size: size,
            qty: qty,
          }).toString();

          window.location.href = "../Tugas 3/tambah-keranjang.html?" + query;
        });

        //* 6b) Beli Sekarang -> buka halaman checkout dengan quantity terpilih
        const buyNowBtn = document.getElementById("buyNowBtn");
        buyNowBtn.addEventListener("click", () => {
          const selectedColor = document.querySelector(
            ".color-swatch.is-selected",
          );
          const color = selectedColor ? selectedColor.dataset.color : "Hitam";

          const size = getSelectedSize();
          if (!size) {
            showSizeWarning();
            return;
          }

          const qty = clampQty(qtyInput.value);

          const query = new URLSearchParams({
            color: color,
            size: size,
            qty: qty,
          }).toString();

          window.location.href = "../Tugas 2/beli-sekarang.html?" + query;
        });

        //* 7) Lightbox / Zoom: klik caption, tombol zoom, atau gambar utama
        const lightbox = document.getElementById("lightbox");
        const lightboxImage = document.getElementById("lightboxImage");
        const lightboxCaption = document.getElementById("lightboxCaption");
        const zoomBtn = document.querySelector(".zoom-btn");

        function openLightbox() {
          lightboxImage.src = mainImage.src;
          lightboxImage.alt = mainImage.alt;
          lightboxCaption.textContent = mainCaption.textContent.trim();
          lightbox.hidden = false;
          document.body.style.overflow = "hidden";
        }

        function closeLightbox() {
          lightbox.hidden = true;
          document.body.style.overflow = "";
        }

        //* Buka lightbox dari gambar utama, tombol zoom, dan caption
        mainImage.addEventListener("click", openLightbox);
        zoomBtn.addEventListener("click", openLightbox);
        mainCaption.style.cursor = "zoom-in";
        mainCaption.addEventListener("click", openLightbox);

        //* Tutup lightbox: klik backdrop / tombol close
        lightbox.querySelectorAll("[data-close]").forEach((el) => {
          el.addEventListener("click", closeLightbox);
        });

        //* Tutup lightbox dengan tombol Escape
        document.addEventListener("keydown", (e) => {
          if (e.key === "Escape" && !lightbox.hidden) {
            closeLightbox();
          }
        });
      })();