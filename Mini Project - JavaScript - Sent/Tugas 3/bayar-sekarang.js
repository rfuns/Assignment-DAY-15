(function () {
  const OWNER = "Mohammad Erfan Suprihadi";

  const ICONS = {
    BSI: "../assets/BSI.webp",
    BNI: "../assets/BNI.webp",
    BCA: "../assets/BCA.webp",
    OVO: "../assets/OVO.webp",
    GoPay: "../assets/GoPay.webp",
    Dana: "../assets/Dana.webp",
  };

  const params = new URLSearchParams(window.location.search);
  const method = params.get("method") || "bank";
  const provider = params.get("provider") || "BSI";
  const total = params.get("total") || "Rp0";

  const providerIcon = document.getElementById("providerIcon");
  const detailBox = document.getElementById("detailBox");
  const statusBox = document.getElementById("statusBox");
  const countdownBox = document.getElementById("countdownBox");
  const countdownEl = document.getElementById("countdown");
  const simulateBtn = document.getElementById("simulatePaidBtn");

  //*  Hanya utk DEMO: Buat nomor Virtual Account acak berdasarkan bank (prefix + angka)
  //*  Jika ingin menggunakan Pembuatan VA yang sebenarnya harus meng-konfigurasikan dengan MIDTRANS Facilities
  function makeVirtualAccount(bankCode) {
    const prefix = {
      BSI: "900",
      BNI: "988",
      BCA: "012",
    };
    let digits = "";
    for (let i = 0; i < 11; i++) {
      digits += Math.floor(Math.random() * 10);
    }
    return (prefix[bankCode] || "000") + digits;
  }

  //*  Penulisan baris detail (label + nilai yang bisa dicopy)
  function detailRow(label, value, bold) {
    return (
      '<div class="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">' +
      '<span class="text-slate-500">' +
      label +
      "</span>" +
      '<span class="' +
      (bold ? "font-bold text-slate-900" : "font-medium text-slate-700") +
      '">' +
      value +
      "</span>" +
      "</div>"
    );
  }

  function renderBank() {
    const account = params.get("account") || "";
    const va = makeVirtualAccount(provider);
    providerIcon.src = ICONS[provider] || "";
    providerIcon.alt = "Ikon " + provider;

    detailBox.innerHTML =
      '<p class="text-center text-slate-600">Transfer Bank <strong>' +
      provider +
      "</strong></p>" +
      detailRow("Nomor Virtual Account", va, true) +
      detailRow("Rekening Tujuan", account, false) +
      detailRow("Atas Nama", OWNER, false) +
      detailRow("Jumlah", total, true) +
      '<p class="text-xs text-slate-500">Gunakan Virtual Account di atas pada aplikasi/ATM ' +
      provider +
      ". Pembayaran akan terverifikasi otomatis.</p>";
  }

  //* DEMO SIMULASI: Pembayaran E-Wallet
  function renderEwallet() {
    const number = params.get("number") || "";
    providerIcon.src = ICONS[provider] || "";
    providerIcon.alt = "Ikon " + provider;

    detailBox.innerHTML =
      '<p class="text-center text-slate-600">E-Wallet <strong>' +
      provider +
      "</strong></p>" +
      detailRow("Nomor " + provider, number, true) +
      detailRow("Atas Nama", OWNER, false) +
      detailRow("Jumlah", total, true) +
      '<p class="text-xs text-slate-500">Buka aplikasi ' +
      provider +
      ", transfer ke nomor di atas sesuai jumlah. Pembayaran akan terverifikasi otomatis.</p>";
  }

  function renderCod() {
    providerIcon.style.display = "none";
    countdownBox.style.display = "none";
    detailBox.innerHTML =
      '<p class="text-center text-slate-600">Bayar di Tempat (COD)</p>' +
      detailRow("Jumlah Dibayar ke Kurir", total, true) +
      '<p class="text-xs text-slate-500">Siapkan uang pas. Bayar langsung ke kurir saat pesanan tiba.</p>';
    simulateBtn.textContent = "Konfirmasi Pesanan COD";
  }

  //*  DEMO Simulasi pembayaran dianggap berhasil
  let paid = false;
  function markPaid() {
    if (paid) return;
    paid = true;

    statusBox.textContent =
      method === "cod" ? "Pesanan COD Dikonfirmasi" : "Pembayaran Berhasil";
    statusBox.className =
      "mb-6 rounded-xl bg-emerald-50 px-4 py-3 text-center text-sm font-semibold text-emerald-700";

    if (countdownBox) countdownBox.style.display = "none";
    simulateBtn.textContent = "Selesai";
    simulateBtn.disabled = true;
    simulateBtn.className =
      "mt-6 w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white cursor-default";
  }

  //*  Countdown 24 jam (format HH:MM:SS)
  function startCountdown() {
    let remaining = 24 * 60 * 60; //*  24 jam dalam detik

    function pad(n) {
      return String(n).padStart(2, "0");
    }

    function tick() {
      if (paid) return;
      if (remaining <= 0) {
        countdownEl.textContent = "00:00:00";
        statusBox.textContent = "Waktu Pembayaran Habis";
        statusBox.className =
          "mb-6 rounded-xl bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-600";
        clearInterval(timer);
        return;
      }
      const h = Math.floor(remaining / 3600);
      const m = Math.floor((remaining % 3600) / 60);
      const s = remaining % 60;
      countdownEl.textContent = pad(h) + ":" + pad(m) + ":" + pad(s);
      remaining--;
    }

    tick();
    const timer = setInterval(tick, 1000);
  }

  //*  Inisialisasi berdasarkan metode
  if (method === "bank") {
    renderBank();
    startCountdown();
  } else if (method === "ewallet") {
    renderEwallet();
    startCountdown();
  } else {
    renderCod();
  }

  //*  DEMO Simulasi: klik tombol -> langsung berhasil
  simulateBtn.addEventListener("click", markPaid);

  //*  Demo: auto-update "pembayaran berhasil" setelah 8 detik
  //*  (mewakili verifikasi otomatis dalam jendela waktu 24 jam)
  if (method !== "cod") {
    setTimeout(markPaid, 30000);
  }
})();
