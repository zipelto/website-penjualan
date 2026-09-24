/* ============================================================
   KONFIGURASI  — ubah di sini kalau ada yang berganti
   ============================================================ */
const WHATSAPP_NUMBER = "6281237576366";   // nomor admin, format internasional tanpa +
const BRAND = "KawaiiCraft";

/* Harga mengikuti Bab III proposal (Tabel 5: Rencana Keuntungan & Target Penjualan) */
const HARGA = {
  poster: 10000,   // Poster Anime A5   — HPP Rp5.833
  flanel: 15000,   // Semua Bingkai Foto Flanel — harga jual Rp15.000
  paket:  20000    // Paket Kombinasi 1 bingkai + 1 poster (hemat Rp2.000)
};

/* ============================================================
   DATA
   ============================================================ */
const THEMES = {
  teal:    {label:"Teal laut",   bg:"#EAF1F0", ink:"#1E5A66", acc:"#2F7C8C"},
  copper:  {label:"Copper",      bg:"#FAF1E7", ink:"#6B4322", acc:"#BE7A42"},
  blush:   {label:"Blush pink",  bg:"#FBEEEC", ink:"#6E3B39", acc:"#E0A49C"},
  sage:    {label:"Sage",        bg:"#EEF2EC", ink:"#35503F", acc:"#5C806B"},
  krem:    {label:"Krem polos",  bg:"#F7F2E8", ink:"#3B3630", acc:"#C2A77E"},
  gelap:   {label:"Navy gelap",  bg:"#22323A", ink:"#F1EFE8", acc:"#E0A49C"}
};

/* warna kain flanel yang tersedia (sesuai bahan baku di proposal) */
const FLANEL = {
  pink:   {label:"Pink",   bg:"#FBEEEC", ink:"#6E3B39", acc:"#E79AA2"},
  biru:   {label:"Biru",   bg:"#EAF1F5", ink:"#274B60", acc:"#7FB2D1"},
  hijau:  {label:"Hijau",  bg:"#EEF3EC", ink:"#30513C", acc:"#86B48C"},
  kuning: {label:"Kuning", bg:"#FBF5E6", ink:"#6B5420", acc:"#EFC75E"},
  merah:  {label:"Merah",  bg:"#FBECEA", ink:"#6B2B27", acc:"#D9635C"},
  putih:  {label:"Putih",  bg:"#FAF8F4", ink:"#4A463F", acc:"#E6E1D6"}
};

const HIASAN = ["Pita","Bunga","Bintang","Hati","Telinga kucing","Kancing warna-warni","Tanpa hiasan"];

const products = [
  {id:9, type:"flanel", name:"Bingkai Flanel Polos", category:"flanel", layout:"flanel", badge:"Unggulan", custom:true,
   theme:"pink", price:HARGA.flanel, maxPhotos:1,
   desc:"Bingkai photocard handmade dari kain flanel premium. Bisa berdiri di meja sekaligus digantung di tas lewat ring gantungan kunci."},

  {id:10, type:"flanel", name:"Bingkai Flanel Telinga Kucing", category:"flanel", layout:"flanel", custom:true,
   theme:"biru", price:HARGA.flanel, maxPhotos:1,
   desc:"Versi dengan hiasan timbul telinga kucing dan manik-manik di bagian depan."},

  {id:11, type:"flanel", name:"Bingkai Flanel Duo", category:"flanel", layout:"duoFlanel", badge:"Baru", custom:true,
   theme:"pink", price:HARGA.flanel, maxPhotos:2,
   desc:"Bingkai flanel handmade dengan dua slot foto vertikal berdampingan, cocok untuk sahabat atau pasangan."},

  {id:13, type:"flanel", name:"Bingkai Flanel Kolase 4 Foto", category:"flanel", layout:"grid4Flanel", badge:"Baru", custom:true,
   theme:"sage", price:HARGA.flanel, maxPhotos:4,
   desc:"Bingkai flanel handmade dengan empat slot foto dalam bentuk kolase, cocok untuk menyimpan banyak kenangan."},

  {id:7, type:"poster", name:"Poster Anime Ready Stock", category:"anime", layout:"band", badge:"Populer", custom:false, readyStock:true,
   theme:"gelap", price:HARGA.poster, maxPhotos:2,
   desc:"Poster karakter anime yang sedang tren, dicetak high resolution di art paper 260gsm."},

  {id:12, type:"paket", name:"Paket Kombinasi", category:"paket", layout:"flanel", badge:"Hemat", custom:true,
   theme:"merah", price:HARGA.paket, maxPhotos:2,
   desc:"1 Bingkai Foto Flanel 2-in-1 + 1 Poster A5 dalam satu paket, lebih murah daripada beli satuan."}
];

const CATS = [
  ["semua","Semua"],
  ["flanel","Bingkai flanel"],
  ["anime","Poster anime"],
  ["paket","Paket hemat"]
];

const SLOTS = {polaroid:1, band:1, grid2:2, strip3:3, collage4:4, flanel:1, duoFlanel:2, grid4Flanel:4};
const SIZES = {poster:"A5 (14,8 × 21 cm)", flanel:"Photocard (5,4 × 8,6 cm)", paket:"Bingkai photocard + poster A5"};

/* ============================================================
   STATE
   ============================================================ */
const state = {
  product:null, qty:1, name:"", title:"", quote:"",
  theme:"teal", font:"Poppins", hiasan:HIASAN[0], note:"", photos:[]
};
let cart = [];
try { cart = JSON.parse(localStorage.getItem("kawaii_cart_v1")) || []; } catch(e){ cart = []; }
function simpanCart(){ try{ localStorage.setItem("kawaii_cart_v1", JSON.stringify(cart)); }catch(e){} }

const rupiah = n => "Rp" + n.toLocaleString("id-ID");
const palette = p => (p && (p.type === "flanel" || p.type === "paket")) ? FLANEL : THEMES;
const warnaLabel = (p,key) => (palette(p)[key] || {label:key}).label;

/* ============================================================
   RENDER POSTER / BINGKAI
   ============================================================ */
function posterHTML(cfg){
  const pal = cfg.flanel ? FLANEL : THEMES;
  const t = pal[cfg.theme] || (cfg.flanel ? FLANEL.pink : THEMES.teal);
  const photo = i => {
    const src = cfg.photos && cfg.photos[i];
    return src
      ? `<div class="ph filled" style="background-image:url('${src}')"></div>`
      : `<div class="ph"><span>${cfg.layout === "flanel" ? "photocard" : "foto " + (i+1)}</span></div>`;
  };
  const name  = cfg.name  || (cfg.layout === "flanel" ? "Nama" : "Nama Kamu");
  const title = cfg.title || "";
  const quote = cfg.quote || "";
  const text = `<div class="ptxt">
      ${title ? `<div class="ptitle">${esc(title)}</div>` : ""}
      <div class="pname">${esc(name)}</div>
      <div class="rule"></div>
      ${quote ? `<div class="pquote">${esc(quote)}</div>` : ""}
    </div>`;

  let inner = "";
  if(cfg.layout === "grid4Flanel"){
    inner = `<span class="ring"></span><div class="grid4 flanel-grid4">${photo(0)}${photo(1)}${photo(2)}${photo(3)}</div>${text}`;
  } else if(cfg.layout === "duoFlanel"){
    inner = `<span class="ring"></span><div class="row duo-flanel">${photo(0)}${photo(1)}</div>${text}`;
  } else if(cfg.layout === "flanel"){
    inner = `<span class="ring"></span>${photo(0)}${text}`;
  } else if(cfg.layout === "polaroid"){
    inner = `<div class="polaroid">${photo(0)}</div>${text}`;
  } else if(cfg.layout === "grid2"){
    inner = `<div class="row">${photo(0)}${photo(1)}</div>${text}`;
  } else if(cfg.layout === "strip3"){
    inner = `<div class="col">${photo(0)}${photo(1)}${photo(2)}</div>${text}`;
  } else if(cfg.layout === "collage4"){
    inner = `<div class="grid4">${photo(0)}${photo(1)}${photo(2)}${photo(3)}</div>${text}`;
  } else {
    inner = `${photo(0)}${text}`;
  }
  const style = `--p-bg:${t.bg};--p-ink:${t.ink};--p-acc:${t.acc};--p-font:'${cfg.font||"Poppins"}'`;
  return {style, inner, cls:"lay-" + cfg.layout};
}
function paint(el, cfg){
  const p = posterHTML(cfg);
  el.className = "poster " + p.cls;
  el.setAttribute("style", p.style);
  el.innerHTML = p.inner;
}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));}

/* ============================================================
   KATALOG
   ============================================================ */
function cardHTML(p){
  const action = p.custom ? `openCustom(${p.id})` : `openDetail(${p.id})`;
  const label = p.custom ? "Kustom sekarang" : "Atur &amp; pesan";
  return `<article class="pcard">
    ${p.badge ? `<span class="tag">${p.badge}</span>` : ""}
    <div class="thumb"><div class="poster" data-poster="${p.id}"></div></div>
    <div class="body">
      <div class="cat">${catLabel(p.category)}</div>
      <h3>${p.name}</h3>
      <div class="price">${rupiah(p.price)}</div>
      <button class="btn sm" onclick="${action}">${label}</button>
    </div>
  </article>`;
}
const catLabel = c => (CATS.find(x=>x[0]===c)||[,c])[1];

function previewCfg(p, extra){
  return Object.assign({
    layout:p.layout, theme:p.theme, flanel:(p.type==="flanel"||p.type==="paket"),
    name:p.name.split(" ")[0], title:"", quote:"", font:"Poppins", photos:[]
  }, extra || {});
}
function fillPosters(root){
  root.querySelectorAll("[data-poster]").forEach(el=>{
    const p = products.find(x=>x.id === +el.dataset.poster);
    paint(el, previewCfg(p));
  });
}
function renderCatalog(filter){
  const box = document.getElementById("allProducts");
  const list = filter === "semua" ? products : products.filter(p=>p.category === filter);
  box.innerHTML = list.length ? list.map(cardHTML).join("")
    : `<p style="color:var(--ink-soft)">Belum ada produk di kategori ini. Pilih <b>Bingkai flanel</b> atau <b>Poster anime</b>, atau tanyakan langsung lewat WhatsApp.</p>`;
  fillPosters(box);
}
function renderChips(){
  const box = document.getElementById("chips");
  box.innerHTML = CATS.map(([v,l],i)=>`<button class="chip" aria-pressed="${i===0}" data-cat="${v}">${l}</button>`).join("");
  box.onclick = e => {
    const b = e.target.closest(".chip"); if(!b) return;
    box.querySelectorAll(".chip").forEach(c=>c.setAttribute("aria-pressed", c===b));
    renderCatalog(b.dataset.cat);
  };
}

/* ============================================================
   DETAIL PRODUK
   ============================================================ */
function specList(p){
  if(p.type === "flanel") return `
    <li><b>Bahan</b> Kain flanel premium + lapisan karton, jahitan tangan</li>
    <li><b>Ukuran</b> ${SIZES.flanel}, muat photocard / foto photobooth</li>
    <li><b>Fungsi</b> 2-in-1: pajangan meja dan gantungan tas/kunci</li>
    <li><b>Kustom</b> Warna kain, hiasan, dan nama bebas dipilih — gratis</li>
    <li><b>Pengerjaan</b> 2–3 hari kerja (handmade, made-to-order)</li>`;
  if(p.type === "paket") return `
    <li><b>Isi paket</b> 1 bingkai flanel 2-in-1 + 1 poster A5</li>
    <li><b>Hemat</b> ${rupiah(HARGA.flanel + HARGA.poster - HARGA.paket)} dibanding beli satuan</li>
    <li><b>Kustom</b> Warna kain, hiasan, dan gambar poster bisa diminta</li>
    <li><b>Pengerjaan</b> 2–3 hari kerja setelah desain disetujui</li>`;
  return `
    <li><b>Bahan</b> Art paper 260gsm, cetak high resolution</li>
    <li><b>Ukuran</b> ${SIZES.poster}</li>
    <li><b>Jumlah foto</b> ${SLOTS[p.layout]} slot utama, maksimal ${p.maxPhotos} foto</li>
    <li><b>Kustom</b> Nama, tulisan, warna, dan font bebas dipilih — gratis</li>
    <li><b>Pengerjaan</b> 2–3 hari kerja setelah desain disetujui</li>`;
}
function openDetail(id){
  window.location.href = `produk.html?id=${encodeURIComponent(id)}`;
}
function openCustom(id){
  const p = products.find(x=>x.id===id);
  if(!p) return;
  state.product = p;
  state.theme = p.theme; state.photos = []; state.qty = 1;
  state.name = ""; state.title = ""; state.quote = ""; state.note = ""; state.hiasan = HIASAN[0];
  go("custom");
}

/* ============================================================
   CUSTOMIZER
   ============================================================ */
function show(id, on){ document.getElementById(id).classList.toggle("hide", !on); }

function initCustom(){
  const p = state.product; if(!p) return;
  const isFlanel = p.type === "flanel" || p.type === "paket";
  const isPoster = p.type === "poster" || p.type === "paket";

  document.getElementById("custTitle").textContent =
    p.type === "flanel" ? "Atur bingkainya" : p.type === "paket" ? "Atur paketnya" : "Atur posternya";

  const pal = palette(p);
  const themeSel = document.getElementById("fTheme");
  themeSel.innerHTML = Object.entries(pal).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join("");
  if(!pal[state.theme]) state.theme = Object.keys(pal)[0];
  themeSel.value = state.theme;
  document.getElementById("themeLabel").textContent = isFlanel ? "Warna kain flanel" : "Warna poster";

  const hiasanSel = document.getElementById("fHiasan");
  hiasanSel.innerHTML = HIASAN.map(h=>`<option value="${h}">${h}</option>`).join("");
  hiasanSel.value = state.hiasan;

  const sizeSel = document.getElementById("fSize");
  sizeSel.innerHTML = `<option value="${SIZES[p.type]}">${SIZES[p.type]}</option>`;

  document.getElementById("fName").value = state.name;
  document.getElementById("fTitle").value = state.title;
  document.getElementById("fQuote").value = state.quote;
  document.getElementById("fFont").value = state.font;
  document.getElementById("fNote").value = state.note;
  document.getElementById("fQty").textContent = state.qty;

  show("wrapTitle", isPoster);
  show("wrapQuote", isPoster);
  show("wrapFont",  isPoster);
  show("wrapHiasan", isFlanel);

  document.getElementById("fName").previousSibling;
  document.querySelector("#wrapName label").innerHTML = isFlanel
    ? `Nama di bingkai <span class="help">— opsional, dijahit/ditempel di bawah jendela foto</span>`
    : `Nama di poster <span class="help">— nama kamu, pasangan, atau si penerima</span>`;

  refresh();
}
function readForm(){
  state.name  = document.getElementById("fName").value.trim();
  state.title = document.getElementById("fTitle").value.trim();
  state.quote = document.getElementById("fQuote").value.trim();
  state.theme = document.getElementById("fTheme").value;
  state.font  = document.getElementById("fFont").value;
  state.hiasan= document.getElementById("fHiasan").value;
  state.note  = document.getElementById("fNote").value.trim();
}
const WATCH = ["fName","fTitle","fQuote","fTheme","fFont","fHiasan","fNote"];
["input","change"].forEach(ev=>document.addEventListener(ev, e=>{
  if(WATCH.includes(e.target.id) && state.product){ readForm(); refresh(); }
}));
function setQty(d){
  state.qty = Math.min(50, Math.max(1, state.qty + d));
  document.getElementById("fQty").textContent = state.qty;
  refresh();
}
function refresh(){
  const p = state.product;
  const total = p.price * state.qty;
  document.getElementById("bill").innerHTML = `
    <div><span>${p.name}</span><span>${rupiah(p.price)}</span></div>
    <div><span>Jumlah</span><span>${state.qty} ${p.type === "paket" ? "paket" : "pcs"}</span></div>
    <div class="total"><span>Subtotal</span><span>${rupiah(total)}</span></div>`;
  paint(document.getElementById("preview"), previewCfg(p, {
    theme:state.theme, name:state.name, title:state.title, quote:state.quote,
    font:state.font, photos:state.photos
  }));
  document.getElementById("warnBox").innerHTML = "";
}

/* ============================================================
   KERANJANG
   ============================================================ */
const drawer = document.getElementById("drawer");
const scrim  = document.getElementById("scrim");
function openCart(){
  drawer.classList.add("open"); scrim.classList.add("open");
  drawer.setAttribute("aria-hidden","false");
  document.body.style.overflow = "hidden";
}
function closeCart(){
  drawer.classList.remove("open"); scrim.classList.remove("open");
  drawer.setAttribute("aria-hidden","true");
  document.body.style.overflow = "";
}
document.getElementById("cartBtn").onclick = openCart;
document.getElementById("closeCart").onclick = closeCart;
scrim.onclick = closeCart;
document.addEventListener("keydown", e => { if(e.key === "Escape") closeCart(); });

let toastTimer;
function toast(msg){
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("open");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove("open"), 2600);
}

function itemDetail(it){
  const bits = [];
  bits.push(SIZES[it.type]);
  bits.push("warna " + it.warna);
  if(it.type !== "flanel" && it.font) bits.push("font " + it.font);
  if(it.type !== "poster") bits.push("hiasan " + it.hiasan);
  if(it.name)  bits.push("nama “" + it.name + "”");
  if(it.title) bits.push("judul “" + it.title + "”");
  if(it.quote) bits.push("tulisan “" + it.quote + "”");
  if(it.readyStock) bits.push("ready stock");
  if(it.note)  bits.push("catatan: " + it.note);
  return bits;
}

document.getElementById("addBtn").onclick = () => {
  readForm();
  const p = state.product;
  cart.push({
    key: Date.now() + "-" + Math.random().toString(16).slice(2,7),
    pid:p.id, type:p.type, product:p.name, price:p.price, qty:state.qty,
    warna:warnaLabel(p, state.theme), themeKey:state.theme, font:state.font,
    hiasan:state.hiasan, name:state.name, title:state.title, quote:state.quote,
    note:state.note, photos:state.photos.length
  });
  simpanCart(); renderCart(); openCart();
  toast(p.name + " masuk keranjang.");
};
document.getElementById("openCartBtn").onclick = openCart;

function cartTotal(){ return cart.reduce((s,i)=>s + i.price * i.qty, 0); }
function cartCount(){ return cart.reduce((s,i)=>s + i.qty, 0); }

function renderCart(){
  const body = document.getElementById("cartBody");
  if(!cart.length){
    body.innerHTML = `<div class="cart-empty"><b>Keranjang masih kosong</b>Pilih bingkai flanel atau poster dulu, lalu atur isinya.</div>`;
  } else {
    body.innerHTML = cart.map((it,i)=>{
      return `<div class="ci">
        <div class="mini"><div class="poster" data-mini="${i}"></div></div>
        <div class="ci-main">
          <h4>${it.product}</h4>
          <div class="ci-meta">${itemDetail(it).join(" · ")}</div>
          <div class="ci-bottom">
            <div class="qty">
              <button type="button" onclick="cartQty(${i},-1)" aria-label="Kurangi">−</button>
              <output>${it.qty}</output>
              <button type="button" onclick="cartQty(${i},1)" aria-label="Tambah">+</button>
            </div>
            <span class="ci-price">${rupiah(it.price * it.qty)}</span>
          </div>
          <button class="ci-del" onclick="cartDel(${i})">Hapus</button>
        </div>
      </div>`;
    }).join("");
    body.querySelectorAll("[data-mini]").forEach(el=>{
      const it = cart[+el.dataset.mini];
      const p = products.find(x=>x.id === it.pid);
      if(p) paint(el, previewCfg(p, {theme:it.themeKey, name:it.name, title:"", quote:"", font:it.font, photos:[]}));
    });
  }
  document.getElementById("cartTotal").textContent = rupiah(cartTotal());
  document.getElementById("cartCount").textContent = cartCount();
  document.getElementById("cartOrder").disabled = cart.length === 0;
}
function cartQty(i,d){
  cart[i].qty += d;
  if(cart[i].qty < 1) cart.splice(i,1);
  simpanCart(); renderCart();
}
function cartDel(i){ cart.splice(i,1); simpanCart(); renderCart(); toast("Item dihapus."); }
document.getElementById("cartClear").onclick = () => {
  if(!cart.length) return;
  cart = []; simpanCart(); renderCart(); toast("Keranjang dikosongkan.");
};

/* ============================================================
   PESAN WHATSAPP
   ============================================================ */
function waLink(text){ return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`; }

function pesanOrder(){
  let t = `Halo Kak, saya mau pesan dari website ${BRAND}.\n\nDAFTAR PESANAN\n`;
  cart.forEach((it,i)=>{
    t += `\n${i+1}. ${it.product} — ${it.qty} ${it.type === "paket" ? "paket" : "pcs"}\n`;
    itemDetail(it).forEach(b => { t += `   - ${b}\n`; });
    t += `   Subtotal: ${rupiah(it.price * it.qty)}\n`;
  });
  t += `\nTOTAL: ${rupiah(cartTotal())} (belum termasuk ongkir)\n`;
  t += `\nFotonya saya kirim di chat ini ya. Mohon dikonfirmasi untuk proses selanjutnya. Terima kasih 🙏`;
  return t;
}
document.getElementById("cartOrder").onclick = () => {
  if(!cart.length) return;
  window.open(waLink(pesanOrder()), "_blank", "noopener");
};
const sapa = `Halo ${BRAND}, saya mau tanya soal bingkai flanel dan poster anime.`;
["navWa","footWa","fabWa"].forEach(id=>document.getElementById(id).href = waLink(sapa));

/* ============================================================
   NAVIGASI
   ============================================================ */
const VIEWS = ["home","katalog","custom","cara","tentang"];
function go(v){
  VIEWS.forEach(x=>document.getElementById("v"+"-"+x).classList.toggle("hide", x!==v));
  document.querySelectorAll("[data-nav]").forEach(b=>{
    if(b.dataset.nav===v) b.setAttribute("aria-current","page"); else b.removeAttribute("aria-current");
  });
  if(v==="custom") initCustom();
  if(v==="katalog" && !document.getElementById("allProducts").children.length) renderCatalog("semua");
  document.getElementById("nav").classList.add("closed");
  document.getElementById("burger").setAttribute("aria-expanded","false");
  window.scrollTo({top:0, behavior:"instant"});
}
document.getElementById("backDetail").onclick = () => go("katalog");
document.getElementById("burger").onclick = e => {
  const nav = document.getElementById("nav");
  const open = nav.classList.toggle("closed");
  e.currentTarget.setAttribute("aria-expanded", String(!open));
};

/* ============================================================
   INIT
   ============================================================ */
(function init(){
  const home = document.getElementById("homeProducts");
  home.innerHTML = products.map(cardHTML).join("");
  fillPosters(home);

  renderChips();
  renderCatalog("semua");
  renderCart();

  const customId = Number(new URLSearchParams(window.location.search).get("custom"));
  if(customId && products.find(p=>p.id===customId)) openCustom(customId);
  else go("home");
  if(window.location.hash === "#keranjang") setTimeout(openCart, 0);
})();
