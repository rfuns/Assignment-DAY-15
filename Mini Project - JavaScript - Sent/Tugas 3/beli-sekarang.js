(function () {

  //*  Konstanta harga (dalam Rupiah)
  const UNIT_PRICE = 45000; //?  Harga satuan Kaos Kaki Premium Combed (Belum dibuatkan masing-masing Ukuran Berbeda Harga)
  const SHIPPING = 10000; //?  DEMO Simulasi Ongkos kirim (Jika ingin benar-benar menggunakan destination pengiriman harus dibuatkan drop down khusus Kurir)
  const MEMBER_DISCOUNT_RATE = 0.1; //?  Diskon 10% khusus member

  const MIN_QTY = 1; //? Mengikuti ketentuan minimal 1 
  const MAX_QTY = 15; //? Mengikuti ketentuan maximal 15 

  //*  Cek status member dari localStorage (diset di LoginMember.html)
  function isMember() {
    return localStorage.getItem("isMember") === "true";
  }

  //*  Format angka menjadi "Rp45.000"
  function formatRupiah(value) {
    return "Rp" + value.toLocaleString("id-ID");
  }

  //*  Ambil quantity dari query string (?qty=...), lalu batasi 1..15
  function getQtyFromUrl() {
    const params = new URLSearchParams(window.location.search);
    let qty = parseInt(params.get("qty"), 10);
    if (isNaN(qty)) qty = MIN_QTY;
    if (qty < MIN_QTY) qty = MIN_QTY;
    if (qty > MAX_QTY) qty = MAX_QTY;
    return qty;
  }

  //*  Ambil warna & ukuran dari query string (opsional)
  function getParam(name, fallback) {
    const params = new URLSearchParams(window.location.search);
    const value = params.get(name);
    return value && value.trim() !== "" ? value : fallback;
  }

  function render() {
    const qty = getQtyFromUrl();
    const color = getParam("color", "Hitam");
    const size = getParam("size", "M");

    //*  Hitung nilai
    const subtotal = UNIT_PRICE * qty;

    //*  Diskon 10% hanya untuk member, selain itu tidak ada diskon
    const member = isMember();
    const discount = member ? Math.round(subtotal * MEMBER_DISCOUNT_RATE) : 0;

    const total = subtotal + SHIPPING - discount;

    //*  Perbarui ringkasan pesanan (warna, ukuran, jumlah)
    const summaryVariant = document.getElementById("summaryVariant");
    if (summaryVariant) {
      summaryVariant.innerHTML =
        "Warna: " + color + " &middot; Ukuran: " + size;
    }

    const summaryQty = document.getElementById("summaryQty");
    if (summaryQty) {
      summaryQty.textContent = "Jumlah: " + qty;
    }

    //*  Perbarui subtotal dan total
    const subtotalEl = document.getElementById("subtotalValue");
    if (subtotalEl) {
      subtotalEl.textContent = formatRupiah(subtotal);
    }

    const totalEl = document.getElementById("totalValue");
    if (totalEl) {
      totalEl.textContent = formatRupiah(total);
    }

    //*  Perbarui baris diskon
    const discountRow = document.getElementById("discountRow");
    const discountEl = document.getElementById("discountValue");
    if (discountEl) {
      discountEl.textContent = "-" + formatRupiah(discount);
    }
    if (discountRow) {
    
      //*  Sembunyikan baris diskon jika bukan member (diskon = 0)
      discountRow.style.display = member ? "flex" : "none";
    }

    //*  Perbarui status member (badge info di ringkasan)
    const memberStatusEl = document.getElementById("memberStatus");
    if (memberStatusEl) {
      if (member) {
        memberStatusEl.textContent = "Member aktif - diskon 10% diterapkan";
        memberStatusEl.className =
          "mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700";
      } else {
        memberStatusEl.innerHTML =
          'Kamu belum member. <a href="../Tugas 3/LoginMember.html" class="font-semibold underline">Daftar member</a> untuk diskon 10%.';
        memberStatusEl.className =
          "mb-4 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700";
      }
    }
  }

  document.addEventListener("DOMContentLoaded", render);
})();


