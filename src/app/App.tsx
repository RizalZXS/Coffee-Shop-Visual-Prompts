import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const categories = ["Minuman Kopi", "Makanan Ringan", "Suasana Kedai"] as const;
type Category = (typeof categories)[number];

interface Item {
  id: number;
  name: string;
  subtitle: string;
  description: string;
  tag: string;
  image: string;
  imageAlt: string;
  category: Category;
  price: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const paymentMethods = [
  { id: "qris", label: "QRIS", detail: "Bayar cepat lewat e-wallet atau bank" },
  { id: "transfer", label: "Transfer Bank", detail: "BCA, BNI, atau Mandiri" },
  { id: "cod", label: "COD", detail: "Bayar saat pesanan sampai" },
] as const;

type PaymentMethodId = (typeof paymentMethods)[number]["id"];

function formatPrice(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getItemPrice(item: Item) {
  return Number(item.price.replace(/[^\d]/g, "")) || 0;
}

const items: Item[] = [
  {
    id: 1,
    name: "Es Kopi Latte",
    subtitle: "Segar & Menyegarkan",
    description:
      "Lapisan susu yang kaya bertemu kopi yang kuat, disajikan dengan es batu dalam gelas kaca bening di atas meja kayu yang hangat.",
    tag: "Bestseller",
    image:
      "https://images.unsplash.com/photo-1621221814951-fa755dd0c993?w=600&h=800&fit=crop&auto=format",
    imageAlt: "Es kopi latte dalam gelas kaca bening dengan es batu",
    category: "Minuman Kopi",
    price: "Rp 38.000",
  },
  {
    id: 2,
    name: "Es Latte Karamel",
    subtitle: "Close-up Signature",
    description:
      "Foam susu yang tebal dengan sirup karamel melingkar indah, disajikan dengan sedotan logam dan es batu dalam gelas kaca.",
    tag: "Favorit",
    image:
      "https://images.unsplash.com/photo-1620360289100-030b032e5a27?w=600&h=800&fit=crop&auto=format",
    imageAlt: "Es kopi latte close-up dengan es batu dan sedotan",
    category: "Minuman Kopi",
    price: "Rp 42.000",
  },
  {
    id: 3,
    name: "Cappuccino",
    subtitle: "Hangat & Mengundang",
    description:
      "Busa susu yang lembut dengan taburan bubuk cokelat, disajikan dalam cangkir keramik di atas meja marmer yang nyaman.",
    tag: "Klasik",
    image:
      "https://images.unsplash.com/photo-1710173472469-9d28e977914c?w=600&h=800&fit=crop&auto=format",
    imageAlt: "Cappuccino dengan latte art hati dalam cangkir keramik",
    category: "Minuman Kopi",
    price: "Rp 35.000",
  },
  {
    id: 4,
    name: "Cappuccino Art",
    subtitle: "Latte Art Spesial",
    description:
      "Latte art yang dibuat dengan tangan oleh barista kami, foam susu yang tebal sempurna dalam cangkir keramik estetik.",
    tag: "Spesial",
    image:
      "https://images.unsplash.com/photo-1489866492941-15d60bdaa7e0?w=600&h=800&fit=crop&auto=format",
    imageAlt: "Cappuccino dengan latte art dalam cangkir keramik",
    category: "Minuman Kopi",
    price: "Rp 38.000",
  },
  {
    id: 5,
    name: "Americano",
    subtitle: "Bold & Kaya Rasa",
    description:
      "Crema yang kaya di atas warna hitam pekat, disajikan dengan sendok kecil dan piring alas di kedai kopi minimalis.",
    tag: "Pure",
    image:
      "https://images.unsplash.com/photo-1579992357154-faf4bde95b3d?w=600&h=800&fit=crop&auto=format",
    imageAlt: "Americano hitam pekat dalam cangkir keramik putih",
    category: "Minuman Kopi",
    price: "Rp 28.000",
  },
  {
    id: 6,
    name: "Es Kopi Gula Aren",
    subtitle: "Manis & Creamy",
    description:
      "Lapisan gula aren yang kental berpadu susu yang kaya, menciptakan harmoni rasa manis alami yang tak tertandingi.",
    tag: "Lokal",
    image:
      "https://images.unsplash.com/photo-1642647391072-6a2416f048e5?w=600&h=800&fit=crop&auto=format",
    imageAlt: "Es kopi susu gula aren dalam gelas kaca dengan es batu",
    category: "Minuman Kopi",
    price: "Rp 40.000",
  },
  {
    id: 7,
    name: "Croissant",
    subtitle: "Renyah & Flaky",
    description:
      "Warna cokelat keemasan dengan tekstur flaky berlapis-lapis, disajikan dengan mentega dan selai di atas piring keramik.",
    tag: "Fresh Daily",
    image:
      "https://images.unsplash.com/photo-1661750646636-d9a565c6c55c?w=600&h=800&fit=crop&auto=format",
    imageAlt: "Croissant cokelat keemasan di atas piring keramik",
    category: "Makanan Ringan",
    price: "Rp 32.000",
  },
  {
    id: 8,
    name: "Donat Topping",
    subtitle: "Manis & Berwarna-warni",
    description:
      "Donat dengan topping cokelat dan taburan warna-warni yang menggoda, cocok menemani kopi latte di pagi hari.",
    tag: "Colorful",
    image:
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&h=800&fit=crop&auto=format",
    imageAlt: "Donat dengan topping warna-warni",
    category: "Makanan Ringan",
    price: "Rp 25.000",
  },
  {
    id: 9,
    name: "Pelanggan di Jendela",
    subtitle: "Momen Tenang",
    description:
      "Seorang pelanggan menikmati waktu santainya di tepi jendela besar, dengan cahaya siang yang hangat menerangi ruangan.",
    tag: "Atmosfer",
    image:
      "https://images.unsplash.com/photo-1718477322692-70499e74b968?w=600&h=800&fit=crop&auto=format",
    imageAlt: "Pelanggan duduk di meja dekat jendela kedai kopi",
    category: "Suasana Kedai",
    price: "",
  },
  {
    id: 10,
    name: "Barista Kami",
    subtitle: "Keahlian & Dedikasi",
    description:
      "Barista kami menyiapkan setiap cangkir dengan penuh perhatian, memastikan pengalaman kopi terbaik untuk setiap tamu.",
    tag: "Craftsman",
    image:
      "https://images.unsplash.com/photo-1595928642581-f50f4f3453a5?w=600&h=800&fit=crop&auto=format",
    imageAlt: "Barista menyiapkan kopi di mesin espresso",
    category: "Suasana Kedai",
    price: "",
  },
  {
    id: 11,
    name: "Interior Kedai",
    subtitle: "Hangat & Estetik",
    description:
      "Furnitur kayu yang nyaman, lampu gantung yang hangat, dan sentuhan hijau tanaman menciptakan ruang yang sempurna untuk bersantai.",
    tag: "Desain",
    image:
      "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=600&h=800&fit=crop&auto=format",
    imageAlt: "Interior kedai kopi dengan lampu gantung estetik",
    category: "Suasana Kedai",
    price: "",
  },
  {
    id: 12,
    name: "Mesin Espresso",
    subtitle: "Modern & Bersih",
    description:
      "Mesin espresso profesional kami yang selalu terawat, menjamin setiap tetes espresso yang keluar sempurna dan konsisten.",
    tag: "Equipment",
    image:
      "https://images.unsplash.com/photo-1620807773206-49c1f2957417?w=600&h=800&fit=crop&auto=format",
    imageAlt: "Mesin espresso hitam dan silver yang modern",
    category: "Suasana Kedai",
    price: "",
  },
];

function CategoryTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative px-6 py-3 text-sm tracking-wide transition-colors duration-200 font-medium
        ${active ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {label}
      {active && (
        <motion.div
          layoutId="tab-indicator"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </button>
  );
}

function ItemCard({
  item,
  index,
  onAddToCart,
}: {
  item: Item;
  index: number;
  onAddToCart: (item: Item) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group bg-card rounded-lg overflow-hidden border border-border flex flex-col hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative overflow-hidden bg-muted aspect-[3/4]">
        <img
          src={item.image}
          alt={item.imageAlt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <span
          className="absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full font-medium tracking-wider uppercase"
          style={{
            background: "rgba(250,246,239,0.92)",
            color: "#3d1f0a",
            fontFamily: "'DM Sans', sans-serif",
            backdropFilter: "blur(4px)",
          }}
        >
          {item.tag}
        </span>
        {item.price && (
          <span
            className="absolute bottom-3 right-3 text-sm px-3 py-1.5 rounded-full font-medium"
            style={{
              background: "#c07d3a",
              color: "#faf6ef",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {item.price}
          </span>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <p
          className="text-xs uppercase tracking-widest text-muted-foreground mb-1"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {item.subtitle}
        </p>
        <h3
          className="text-xl text-foreground mb-2 leading-snug"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}
        >
          {item.name}
        </h3>
        <p
          className="text-sm text-muted-foreground leading-relaxed flex-1"
          style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
        >
          {item.description}
        </p>
        <div className="mt-5 pt-4 border-t border-border">
          <button
            onClick={() => onAddToCart(item)}
            disabled={!item.price}
            className={`w-full rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
              item.price
                ? "bg-accent text-accent-foreground hover:opacity-90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            {item.price ? "Tambah ke Keranjang" : "Preview"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState<Category>("Minuman Kopi");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethodId>("qris");
  const [showPayment, setShowPayment] = useState(false);

  const filtered = items.filter((item) => item.category === activeCategory);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function handleAddToCart(item: Item) {
    if (!item.price) return;

    setCart((prev) => {
      const existing = prev.find((entry) => entry.id === item.id);
      if (existing) {
        return prev.map((entry) =>
          entry.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry
        );
      }

      return [...prev, { id: item.id, name: item.name, price: getItemPrice(item), quantity: 1 }];
    });
    setShowPayment(false);
  }

  function updateQuantity(itemId: number, delta: number) {
    setCart((prev) =>
      prev
        .map((entry) =>
          entry.id === itemId ? { ...entry, quantity: entry.quantity + delta } : entry
        )
        .filter((entry) => entry.quantity > 0)
    );
  }

  function handleCheckout() {
    if (cart.length === 0) return;

    setShowPayment(true);
    setTimeout(() => {
      document.getElementById("payment")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  return (
    <div
      className="min-h-screen bg-background"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Header */}
      <header className="border-b border-border bg-card/80 sticky top-0 z-40" style={{ backdropFilter: "blur(12px)" }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <span
              className="text-xl text-foreground tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontStyle: "italic" }}
            >
              Kedai Kita
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#menu" className="hover:text-foreground transition-colors">Menu</a>
            <a href="#suasana" className="hover:text-foreground transition-colors">Suasana</a>
            <a href="#" className="hover:text-foreground transition-colors">Tentang Kami</a>
          </nav>
          <button
            onClick={handleCheckout}
            className="text-sm px-4 py-2 rounded-full border border-foreground/20 text-foreground hover:bg-foreground hover:text-background transition-all duration-200"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {cart.length > 0 ? `Checkout (${cart.length})` : "Pesan Sekarang"}
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-12 grid md:grid-cols-[1fr_1.1fr] gap-12 items-center">
          <div>
            <p
              className="text-xs uppercase tracking-[0.2em] text-accent mb-4"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Sajian Terbaik
            </p>
            <h1
              className="text-5xl md:text-6xl leading-[1.05] text-foreground mb-6"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
            >
              Nikmati Setiap
              <br />
              <em>Tegukan</em>
            </h1>
            <p
              className="text-base text-muted-foreground leading-relaxed max-w-sm mb-8"
              style={{ fontWeight: 300 }}
            >
              Dari es kopi latte yang menyegarkan hingga cappuccino yang hangat — setiap cangkir adalah karya seni yang dibuat dengan cinta dan keahlian.
            </p>
            <div className="flex gap-3 flex-wrap">
              <button
                className="px-6 py-3 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Lihat Menu
              </button>
              <button
                className="px-6 py-3 border border-border text-foreground rounded-full text-sm font-medium hover:bg-secondary transition-colors"
              >
                Kunjungi Kami
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="grid grid-cols-2 gap-3 max-h-[480px]">
              <div className="rounded-xl overflow-hidden bg-muted h-64 row-span-2">
                <img
                  src="https://images.unsplash.com/photo-1621221814951-fa755dd0c993?w=400&h=600&fit=crop&auto=format"
                  alt="Es kopi latte signature"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-xl overflow-hidden bg-muted h-[118px]">
                <img
                  src="https://images.unsplash.com/photo-1710173472469-9d28e977914c?w=400&h=300&fit=crop&auto=format"
                  alt="Cappuccino latte art"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-xl overflow-hidden bg-muted h-[118px]">
                <img
                  src="https://images.unsplash.com/photo-1661750646636-d9a565c6c55c?w=400&h=300&fit=crop&auto=format"
                  alt="Croissant flaky"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div
              className="absolute -bottom-3 -left-3 text-xs px-3 py-2 rounded-lg shadow-sm border border-border"
              style={{ background: "#faf6ef", fontFamily: "'DM Sans', sans-serif" }}
            >
              <span className="text-accent font-medium">★ 4.9</span>
              <span className="text-muted-foreground ml-1.5">dari 2.400+ ulasan</span>
            </div>
          </div>
        </div>

        {/* Decorative divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </section>

      {/* Menu Section */}
      <section id="menu" className="max-w-6xl mx-auto px-6 py-14">
        {/* Section label */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p
              className="text-xs uppercase tracking-[0.2em] text-accent mb-2"
            >
              Menu Pilihan
            </p>
            <h2
              className="text-3xl text-foreground"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}
            >
              Koleksi Kami
            </h2>
          </div>
          <p className="text-sm text-muted-foreground hidden md:block max-w-xs text-right leading-relaxed" style={{ fontWeight: 300 }}>
            Dibuat segar setiap hari menggunakan bahan-bahan pilihan terbaik.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border mb-10 gap-1 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <CategoryTab
              key={cat}
              label={cat}
              active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            />
          ))}
        </div>

        {/* Cards grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filtered.map((item, i) => (
              <ItemCard key={item.id} item={item} index={i} onAddToCart={handleAddToCart} />
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      <section id="keranjang" className="max-w-6xl mx-auto px-6 pb-14">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-accent mb-2">Keranjang</p>
              <h3 className="text-2xl text-foreground" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>
                Pilih menu favorit Anda
              </h3>
            </div>
            <button
              onClick={handleCheckout}
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
            >
              {cart.length > 0 ? "Lanjut ke Pembayaran" : "Checkout"}
            </button>
          </div>

          {cart.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">
              Belum ada item di keranjang. Tambahkan minuman atau makanan favorit Anda untuk melanjutkan.
            </p>
          ) : (
            <div className="mt-6 space-y-3">
              {cart.map((entry) => (
                <div key={entry.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-border px-4 py-3">
                  <div>
                    <p className="font-medium text-foreground">{entry.name}</p>
                    <p className="text-sm text-muted-foreground">{formatPrice(entry.price)} / item</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(entry.id, -1)}
                      className="h-8 w-8 rounded-full border border-border text-foreground"
                    >
                      −
                    </button>
                    <span className="min-w-6 text-center font-medium text-foreground">{entry.quantity}</span>
                    <button
                      onClick={() => updateQuantity(entry.id, 1)}
                      className="h-8 w-8 rounded-full border border-border text-foreground"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between border-t border-border pt-4">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-lg font-semibold text-foreground">{formatPrice(subtotal)}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {showPayment && cart.length > 0 && (
        <section id="payment" className="max-w-6xl mx-auto px-6 pb-16">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-accent mb-2">Metode Pembayaran</p>
                <h3 className="text-2xl text-foreground" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>
                  Pilih cara bayar yang Anda suka
                </h3>
              </div>
              <div className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground">
                Total: {formatPrice(subtotal)}
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`rounded-2xl border px-4 py-4 text-left transition-colors ${
                    selectedPayment === method.id
                      ? "border-accent bg-accent/10"
                      : "border-border bg-background hover:bg-secondary"
                  }`}
                >
                  <p className="font-semibold text-foreground">{method.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{method.detail}</p>
                </button>
              ))}
            </div>

            <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t border-border pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Metode terpilih</p>
                <p className="font-semibold text-foreground">
                  {paymentMethods.find((method) => method.id === selectedPayment)?.label}
                </p>
              </div>
              <button className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity">
                Bayar Sekarang
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Atmosphere Banner */}
      <section id="suasana" className="bg-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p
              className="text-xs uppercase tracking-[0.2em] mb-4"
              style={{ color: "#c07d3a" }}
            >
              Tentang Kedai
            </p>
            <h2
              className="text-4xl leading-tight mb-5"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}
            >
              Tempat di Mana{" "}
              <em>Cerita</em>
              <br />
              Dimulai
            </h2>
            <p
              className="text-sm leading-relaxed mb-6"
              style={{ color: "rgba(245,240,232,0.7)", fontWeight: 300 }}
            >
              Sejak 2018, kami telah menjadi rumah kedua bagi ribuan pelanggan setia. Ruang kami dirancang untuk memberikan kenyamanan — tempat bekerja, membaca, atau sekadar menikmati kopi yang sempurna.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: "6+", label: "Tahun Berdiri" },
                { value: "50+", label: "Menu Tersedia" },
                { value: "2400+", label: "Pelanggan Setia" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div
                    className="text-2xl font-semibold mb-1"
                    style={{ color: "#c07d3a", fontFamily: "'Playfair Display', serif" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs" style={{ color: "rgba(245,240,232,0.6)" }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl overflow-hidden bg-muted/20 h-56">
              <img
                src="https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=400&h=500&fit=crop&auto=format"
                alt="Meja kayu dan kursi kedai kopi"
                className="w-full h-full object-cover opacity-90"
              />
            </div>
            <div className="rounded-xl overflow-hidden bg-muted/20 h-56 mt-6">
              <img
                src="https://images.unsplash.com/photo-1718477322692-70499e74b968?w=400&h=500&fit=crop&auto=format"
                alt="Pelanggan menikmati kopi di jendela"
                className="w-full h-full object-cover opacity-90"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Opening Hours + CTA */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-[1fr_auto] gap-12 items-start">
        <div>
          <p
            className="text-xs uppercase tracking-[0.2em] text-accent mb-3"
          >
            Jam Operasional
          </p>
          <h2
            className="text-2xl text-foreground mb-6"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}
          >
            Kami Selalu Ada
          </h2>
          <div className="space-y-2">
            {[
              { day: "Senin – Jumat", time: "07.00 – 22.00" },
              { day: "Sabtu", time: "08.00 – 23.00" },
              { day: "Minggu", time: "08.00 – 21.00" },
            ].map((row) => (
              <div
                key={row.day}
                className="flex justify-between items-center py-3 border-b border-border"
              >
                <span className="text-sm text-foreground">{row.day}</span>
                <span className="text-sm text-muted-foreground">{row.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          className="rounded-2xl p-8 border border-border max-w-sm w-full"
          style={{ background: "#faf6ef" }}
        >
          <p
            className="text-xs uppercase tracking-[0.2em] text-accent mb-3"
          >
            Reservasi
          </p>
          <h3
            className="text-xl text-foreground mb-3"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}
          >
            Pesan Meja Anda
          </h3>
          <p
            className="text-sm text-muted-foreground mb-6 leading-relaxed"
            style={{ fontWeight: 300 }}
          >
            Pastikan tempat duduk favorit Anda tersedia dengan membuat reservasi terlebih dahulu.
          </p>
          <button
            className="w-full py-3 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Hubungi Kami
          </button>
          <p className="text-xs text-center text-muted-foreground mt-3">
            atau telp. <strong style={{ color: "#2c1a0e" }}>+62 21 1234 5678</strong>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <span
            className="text-lg text-foreground"
            style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}
          >
            Kedai Kita
          </span>
          <p className="text-sm text-muted-foreground" style={{ fontWeight: 300 }}>
            Jl. Kopi Nikmat No. 12, Jakarta Selatan · 2024 Kedai Kita
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Instagram</a>
            <a href="#" className="hover:text-foreground transition-colors">TikTok</a>
            <a href="#" className="hover:text-foreground transition-colors">WhatsApp</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
