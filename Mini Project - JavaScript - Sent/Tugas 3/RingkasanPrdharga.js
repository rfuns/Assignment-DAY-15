      (function () {
        const params = new URLSearchParams(window.location.search);

        const color = params.get("color") || "Hitam";
        const size = params.get("size") || "M";
        let qty = parseInt(params.get("qty"), 10);
        if (isNaN(qty) || qty < 1) qty = 1;

        const UNIT_PRICE = 45000;
        const SHIPPING = 10000;
        const DISCOUNT = 15000;

        const images = {
          Hitam: "../assets/Kaos Kaki_Hitam.webp",
          "Abu-abu": "../assets/Kaos Kaki_AbuAbu.webp",
        };

        function formatRp(value) {
          return "Rp" + value.toLocaleString("id-ID");
        }

        //* Update ringkasan produk
        document.getElementById("cartColor").textContent = color;
        document.getElementById("cartSize").textContent = size;
        document.getElementById("cartQty").textContent = qty;
        document.getElementById("cartImage").src =
          images[color] || images["Hitam"];
        document.getElementById("cartImage").alt =
          "Kaos Kaki Premium Combed - " + color;

        //* Update ringkasan harga
        const subtotal = UNIT_PRICE * qty;
        const total = subtotal + SHIPPING - DISCOUNT;

        document.getElementById("sumQty").textContent = qty;
        document.getElementById("sumSubtotal").textContent = formatRp(subtotal);
        document.getElementById("sumTotal").textContent = formatRp(total);
      })();