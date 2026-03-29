// Article full HTML content extracted from mock-articles.ts
// Separated to keep seed.ts manageable

export const articleContent: Record<string, { content: string; specs: { icon: string; label: string; value: string }[] }> = {
    "panduan-identifikasi-hybrid-philodendron": {
        specs: [
            { icon: "psychiatry", label: "Genus", value: "Philodendron" },
            { icon: "thermostat", label: "Suhu Ideal", value: "18-28°C" },
            { icon: "water_drop", label: "Kelembaban", value: "60-80%" },
            { icon: "wb_sunny", label: "Cahaya", value: "Indirect Bright" },
        ],
        content: `<h2>Pendahuluan</h2>
<p>Philodendron adalah salah satu genus terbesar dalam famili Araceae, dengan lebih dari 480 spesies yang diakui secara ilmiah. Keragaman morfologi yang luar biasa membuat identifikasi spesies — apalagi hybrid — menjadi tantangan bahkan bagi kolektor berpengalaman.</p>
<p>Dalam panduan ini, kami akan membahas metode identifikasi visual yang dapat Anda gunakan untuk membedakan hybrid Philodendron yang umum diperdagangkan di Indonesia.</p>
<h2>Morfologi Daun: Kunci Utama Identifikasi</h2>
<p>Bentuk daun (leaf shape) adalah karakteristik pertama yang harus diamati. Philodendron memiliki variasi bentuk daun yang sangat luas: dari sagitate (berbentuk panah) pada P. hastatum, cordate (berbentuk hati) pada P. gloriosum, hingga pinnatifid (berjari) pada P. bipinnatifidum.</p>
<p>Perhatikan juga tekstur permukaan daun — apakah glossy (mengkilap) seperti pada P. melanochrysum, atau velvety (beludru) seperti pada P. verrucosum. Tekstur ini adalah indikator kuat untuk identifikasi.</p>
<h3>Pola Venasi (Vein Pattern)</h3>
<p>Venasi atau pola urat daun memberikan petunjuk penting. P. gloriosum dikenal dengan venasi putih yang sangat kontras, sementara P. melanochrysum memiliki venasi yang lebih halus dan menyatu dengan permukaan daun.</p>
<h3>Cataphyll: Penanda Identitas</h3>
<p>Cataphyll — selubung pelindung yang menutupi daun muda — memiliki warna dan tekstur yang khas pada setiap spesies. P. verrucosum memiliki cataphyll merah cerah, sedangkan P. gloriosum berwarna merah muda pucat.</p>
<h2>Analisis Batang dan Petiole</h2>
<p>Bentuk dan tekstur batang sangat informatif. Perhatikan apakah batang memiliki verucae (tonjolan kecil) seperti pada P. verrucosum, atau smooth (halus) seperti P. melanochrysum. Panjang dan sudut petiole juga berbeda antar spesies.</p>
<h2>Hybrid Populer dan Cara Identifikasinya</h2>
<p>Beberapa hybrid populer di pasar Indonesia:</p>
<ul>
<li><strong>P. gloriosum × melanochrysum:</strong> Menghasilkan daun cordate dengan venasi putih dan permukaan semi-velvety. Ukuran daun bisa mencapai 40cm.</li>
<li><strong>P. verrucosum × melanochrysum:</strong> Dikenal sebagai "Splendid" dengan tekstur beludru gelap dan kilau metalik.</li>
<li><strong>P. mamei × plowmanii:</strong> Daun besar silver-blue dengan pola quilting yang unik.</li>
</ul>
<h2>Kesimpulan</h2>
<p>Identifikasi hybrid memerlukan observasi menyeluruh terhadap multiple karakteristik. Jangan bergantung pada satu fitur saja — kombinasi bentuk daun, tekstur, venasi, cataphyll, dan batang akan memberikan identifikasi yang lebih akurat.</p>
<p>Untuk konsultasi identifikasi lebih lanjut, hubungi tim ahli BMJ melalui WhatsApp.</p>`,
    },
    "taksonomi-araceae": {
        specs: [
            { icon: "psychiatry", label: "Famili", value: "Araceae" },
            { icon: "eco", label: "Genus Utama", value: "114+" },
            { icon: "public", label: "Distribusi", value: "Pantropical" },
            { icon: "forest", label: "Spesies", value: "3.750+" },
        ],
        content: `<h2>Apa itu Araceae?</h2>
<p>Araceae (sering disebut "aroids") adalah famili tumbuhan berbunga yang mencakup sekitar 114 genus and 3.750+ spesies. Famili ini tersebar di seluruh wilayah tropis dan subtropis dunia, dengan pusat keragaman di hutan hujan Amerika Selatan dan Asia Tenggara.</p>
<h2>Genus Utama untuk Kolektor</h2>
<h3>Monstera</h3>
<p>Genus populer dengan ciri khas daun berfenestrasi (berlubang). M. deliciosa dan M. adansonii adalah spesies paling umum, namun varietas variegata seperti Thai Constellation sangat dicari kolektor.</p>
<h3>Philodendron</h3>
<p>Genus terbesar kedua dalam Araceae dengan 480+ spesies. Terkenal dengan keragaman bentuk daun dari cordate hingga pinnatifid. Banyak hybrid baru terus bermunculan di pasar.</p>
<h3>Anthurium</h3>
<p>Genus terbesar dalam Araceae dengan 1.000+ spesies. Dari Anthurium crystallinum yang beludru hingga A. warocqueanum yang memanjang, genus ini menawarkan variasi luar biasa.</p>
<h2>Sistem Klasifikasi Modern</h2>
<p>Klasifikasi Araceae telah mengalami banyak revisi berkat analisis molekuler DNA. Saat ini, famili ini dibagi menjadi 8 subfamili utama, termasuk Aroideae (yang mencakup sebagian besar genus populer untuk kolektor).</p>
<h2>Tips Identifikasi di Lapangan</h2>
<p>Perhatikan spathe dan spadix (struktur bunga khas aroid), tipe pertumbuhan (climbing vs terrestrial), dan bentuk serta tekstur daun untuk identifikasi genus yang akurat.</p>`,
    },
    "inspeksi-kesehatan-tanaman": {
        specs: [
            { icon: "health_and_safety", label: "Fokus", value: "Quality Control" },
            { icon: "visibility", label: "Metode", value: "Visual Inspection" },
            { icon: "bug_report", label: "Cakupan", value: "Hama & Penyakit" },
            { icon: "verified", label: "Level", value: "Pemula-Lanjut" },
        ],
        content: `<h2>Mengapa Inspeksi Penting?</h2>
<p>Membeli tanaman tanpa inspeksi menyeluruh adalah resep untuk masalah. Tanaman yang terinfeksi bisa menularkan penyakit ke seluruh koleksi Anda dalam hitungan hari.</p>
<h2>Checklist Inspeksi Visual</h2>
<h3>1. Periksa Daun</h3>
<p>Cari tanda-tanda: bercak kuning atau coklat, lubang, tepi daun keriting, perubahan warna abnormal, atau lapisan tepung putih (powdery mildew).</p>
<h3>2. Periksa Batang</h3>
<p>Batang harus kokoh dan bebas dari soft spots (area lunak yang mengindikasikan busuk). Periksa juga keberadaan scale insects yang sering bersembunyi di node.</p>
<h3>3. Periksa Akar</h3>
<p>Jika memungkinkan, periksa akar. Akar sehat berwarna putih atau krem. Akar coklat kehitaman dan berbau busuk menandakan root rot.</p>
<h2>Red Flags yang Harus Dihindari</h2>
<p>Jangan pernah membeli tanaman dengan: banyak daun kuning, batang yang lembek, serangga visible, atau media tanam yang berbau asam.</p>`,
    },
    "variegasi-monstera": {
        specs: [
            { icon: "wb_sunny", label: "Cahaya", value: "Bright Indirect" },
            { icon: "water_drop", label: "Penyiraman", value: "Moderate" },
            { icon: "thermostat", label: "Suhu", value: "20-28°C" },
            { icon: "science", label: "Media", value: "Chunky Aroid Mix" },
        ],
        content: `<h2>Memahami Variegasi</h2>
<p>Variegasi pada tanaman disebabkan oleh mutasi sel yang menghasilkan area tanpa klorofil. Pada Monstera, ada dua jenis utama: chimeral (tidak stabil, seperti Albo) dan tissue culture stable (stabil, seperti Thai Constellation).</p>
<h2>Faktor yang Mempengaruhi Stabilitas</h2>
<h3>Cahaya</h3>
<p>Cahaya adalah faktor terpenting. Cahaya terlalu rendah akan mendorong tanaman memproduksi lebih banyak klorofil (menjadi lebih hijau), sementara cahaya terlalu tinggi bisa membakar area putih yang tidak memiliki klorofil.</p>
<h3>Nutrisi</h3>
<p>Pemupukan yang tepat membantu tanaman mempertahankan keseimbangan antara pertumbuhan area hijau dan variegata. Gunakan pupuk balanced NPK 20-20-20 dengan dosis setengah dari rekomendasi.</p>
<h2>Teknik Pruning untuk Variegasi</h2>
<p>Jika tanaman mulai menghasilkan daun full green, pangkas di atas node yang memiliki variegasi baik. Ini mendorong pertumbuhan baru dari titik yang masih memiliki sel variegata.</p>`,
    },
    "cutting-vs-tanaman-utuh": {
        specs: [
            { icon: "payments", label: "Harga Cutting", value: "30-50% lebih murah" },
            { icon: "schedule", label: "Waktu Tumbuh", value: "3-12 bulan" },
            { icon: "trending_up", label: "Potensi ROI", value: "Tinggi" },
            { icon: "warning", label: "Risiko", value: "Medium" },
        ],
        content: `<h2>Cutting: Kelebihan & Kekurangan</h2>
<p>Cutting menawarkan harga masuk yang jauh lebih terjangkau — biasanya 30-50% lebih murah dari tanaman dewasa. Namun, Anda perlu kesabaran dan skill rooting yang baik.</p>
<h2>Tanaman Utuh: Kapan Harus Pilih Ini?</h2>
<p>Tanaman dewasa cocok untuk Anda yang ingin hasil instan, tidak mau ambil risiko gagal rooting, atau membutuhkan specimen display untuk koleksi.</p>
<h2>Faktor Keputusan</h2>
<p>Pertimbangkan: budget Anda, pengalaman dengan propagasi, ketersediaan lingkungan tumbuh (grow tent, greenhouse), dan tujuan Anda — koleksi personal atau investasi untuk breeding.</p>`,
    },
    "interior-tanaman-ruang-gelap": {
        specs: [
            { icon: "wb_sunny", label: "Cahaya", value: "Low–Medium" },
            { icon: "palette", label: "Style", value: "Minimalist" },
            { icon: "potted_plant", label: "Tanaman", value: "8 Rekomendasi" },
            { icon: "home", label: "Area", value: "Indoor" },
        ],
        content: `<h2>Tanaman untuk Low Light</h2>
<p>Tidak semua tanaman membutuhkan sinar matahari langsung. Beberapa spesies justru berkembang baik di area dengan pencahayaan minimal.</p>
<h2>Rekomendasi Top 8</h2>
<p>1. Zamioculcas zamiifolia (ZZ Plant) — Hampir indestructible. 2. Sansevieria — Toleransi rendah cahaya + low maintenance. 3. Pothos — Trailing plant yang cantik di area gelap. 4. Aglaonema — Varietas Silver Bay tahan low light.</p>
<h2>Tips Styling</h2>
<p>Gunakan pot berwarna terang untuk kontras. Pilih tanaman dengan daun mengkilap yang memantulkan cahaya. Grouping 3-5 tanaman menciptakan impact visual yang lebih besar.</p>`,
    },
    "tropical-garden-modern": {
        specs: [
            { icon: "park", label: "Style", value: "Tropical Modern" },
            { icon: "straighten", label: "Luas Min", value: "50 m²" },
            { icon: "eco", label: "Tanaman", value: "15+ Spesies" },
            { icon: "payments", label: "Budget", value: "Medium-High" },
        ],
        content: `<h2>Konsep Tropical Modern</h2>
<p>Tropical modern menggabungkan garis-garis bersih hardscape minimalis dengan kesuburan tanaman tropis. Hasilnya: taman yang terasa seperti resort tetapi tetap low-maintenance.</p>
<h2>Elemen Kunci</h2>
<p>Stepping stones dari batu alam, border tanaman groundcover, focal point berupa palm atau heliconia besar, dan pencahayaan landscape yang dramatis di malam hari.</p>
<h2>Tanaman Rekomendasi</h2>
<p>Palem kuning (Dypsis lutescens), Heliconia, Philodendron bipinnatifidum, Bird of Paradise, dan berbagai groundcover seperti Tradescantia dan Mondo grass.</p>`,
    },
    "anthurium-hybrid-market-2024": {
        specs: [
            { icon: "trending_up", label: "Demand", value: "↑ 35% YoY" },
            { icon: "public", label: "Market", value: "Global" },
            { icon: "payments", label: "Range", value: "$50-$500" },
            { icon: "eco", label: "Supply", value: "Limited" },
        ],
        content: `<h2>Tren Pasar Anthurium 2024</h2>
<p>Pasar Anthurium dark hybrid terus menunjukkan pertumbuhan yang solid di 2024, dengan peningkatan permintaan 35% dibanding tahun lalu. A. papillilaminum dan hybridanya — terutama dengan A. crystallinum — menjadi primadona.</p>
<h2>Analisis Harga</h2>
<p>Harga specimen mature berkisar $150-$500 tergantung kualitas venasi dan ukuran. Seedling hybrid berkualitas mulai dari $50-$100. Pasar Asia Tenggara, terutama Indonesia dan Thailand, masih mendominasi supply global.</p>`,
    },
    "dormansi-alocasia": {
        specs: [
            { icon: "thermostat", label: "Suhu Min", value: "18°C" },
            { icon: "water_drop", label: "Penyiraman", value: "Minimal" },
            { icon: "wb_sunny", label: "Cahaya", value: "Grow Light" },
            { icon: "schedule", label: "Durasi", value: "2-4 bulan" },
        ],
        content: `<h2>Apa itu Dormansi?</h2>
<p>Dormansi adalah fase istirahat alami pada Alocasia, biasanya terjadi saat suhu turun atau intensitas cahaya berkurang. Tanaman akan menggugurkan daun dan fokus menyimpan energi di umbi.</p>
<h2>Strategi Pencahayaan Buatan</h2>
<p>Gunakan grow light LED full spectrum dengan intensitas 200-400 PPFD selama 12-14 jam per hari. Ini bisa menunda atau memperpendek masa dormansi secara signifikan.</p>
<h2>Pengelolaan Air</h2>
<p>Kurangi penyiraman drastis. Biarkan media tanam hampir kering sepenuhnya antara penyiraman. Over-watering saat dormansi adalah penyebab utama busuk umbi.</p>`,
    },
    "gloriosum-vs-melanochrysum": {
        specs: [
            { icon: "compare", label: "Perbandingan", value: "2 Spesies" },
            { icon: "psychiatry", label: "Genus", value: "Philodendron" },
            { icon: "trending_up", label: "Popularitas", value: "Tinggi" },
            { icon: "eco", label: "Hybrid", value: "Glorious" },
        ],
        content: `<h2>P. Gloriosum</h2>
<p>Crawler (menjalar di tanah) dengan daun cordate besar, venasi putih prominan, dan tekstur semi-velvety. Pertumbuhan relatif lambat. Harga stabil di pasar kolektor.</p>
<h2>P. Melanochrysum</h2>
<p>Climber (merambat) dengan daun elongated dan permukaan velvety dengan kilau emas gelap. Pertumbuhan lebih cepat dengan support (tiang lumut). Lebih toleran terhadap variasi cahaya.</p>
<h2>Head-to-Head</h2>
<p>Gloriosum unggul di venasi dan bentuk daun. Melanochrysum menang di tekstur dan kecepatan tumbuh. Hybrid keduanya — "Glorious" — menggabungkan yang terbaik dari keduanya.</p>`,
    },
    "sertifikasi-cites-ekspor": {
        specs: [
            { icon: "gavel", label: "Regulasi", value: "CITES" },
            { icon: "description", label: "Dokumen", value: "5 Jenis" },
            { icon: "schedule", label: "Proses", value: "2-4 Minggu" },
            { icon: "public", label: "Tujuan", value: "Internasional" },
        ],
        content: `<h2>Apa itu CITES?</h2>
<p>CITES (Convention on International Trade in Endangered Species) adalah perjanjian internasional yang mengatur perdagangan flora dan fauna langka. Banyak spesies tanaman hias, terutama anggrek dan beberapa aroid, masuk dalam lampiran CITES.</p>
<h2>Dokumen yang Diperlukan</h2>
<p>1. Surat Izin CITES dari KLHK. 2. Sertifikat Kesehatan Tanaman (SHT). 3. Phytosanitary Certificate. 4. Invoice dan packing list. 5. Dokumen karantina.</p>
<h2>Prosedur Ekspor</h2>
<p>Proses lengkap memakan waktu 2-4 minggu. Dimulai dari pengajuan CITES permit, inspeksi karantina, packaging sesuai standar ISPM-15, hingga pengiriman via cargo udara.</p>`,
    },
};
