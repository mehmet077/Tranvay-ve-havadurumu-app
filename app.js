const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const { wrapper } = require("axios-cookiejar-support");
const tough = require("tough-cookie");
const cors = require("cors");

const app = express();
app.use(cors()); // app tanımlandıktan hemen sonra ekle
const PORT = process.env.PORT || 3000;

// Axios yapılandırması (Her istekte taze bir jar kullanılabilir veya global tutulabilir)
const jar = new tough.CookieJar();
const client = wrapper(axios.create({ jar }));

// Veri çekme fonksiyonu (Logic)
async function getDurakVerisi(durakId) {
    try {
        // 1. Ana sayfayı ziyaret et ve Token al
        const page = await client.get("https://trafik.kayseri.bel.tr");
        const $ = cheerio.load(page.data);
        const token = $('input[name="__RequestVerificationToken"]').val();

        if (!token) throw new Error("Doğrulama tokeni alınamadı.");

        // 2. POST isteği gönder
        const response = await client.post(
            "https://trafik.kayseri.bel.tr/Home/DuragaYaklasanAraclar",
            new URLSearchParams({ p: durakId }).toString(),
            {
                headers: {
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "x-requested-with": "XMLHttpRequest",
                    "requestverificationtoken": token,
                    "referer": "https://trafik.kayseri.bel.tr/",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                }
            }
        );

        return response.data;
    } catch (error) {
        throw error;
    }
}

// --- ENDPOINTLER ---

// 1. Test Endpoint
app.get("/", (req, res) => {
    res.json({ mesaj: "Kayseri Ulaşım API Çalışıyor", status: "ok" });
});

// 2. Dinamik Durak Sorgulama Endpoint'i
// Kullanım: http://localhost:3000/api/durak/BURAYA_ID_GELECEK
app.get("/api/durak/:id", async (req, res) => {
    const durakId = req.params.id;
    try {
        const data = await getDurakVerisi(durakId);
        console.log(data);
        res.json({
            success: true,
            durakId: durakId,
            count: data.length,
            data: data
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Veri çekilirken hata oluştu",
            error: error.message
        });
    }
});
// 3. Hava Durumu Sorgulama Endpoint'i
// Kullanım: http://localhost:3000/api/hava/kayseri
app.get("/api/hava/:sehir", async (req, res) => {
    const sehir = req.params.sehir;
    try {
        // URL sonuna &lang=tr ekleyerek servisten Türkçe veri istiyoruz
        const response = await axios.get(`https://wttr.in/${sehir}?format=j1&lang=tr`);
        const data = response.data;

        const current = data.current_condition[0];
        
        // lang_tr dizisindeki değeri alıyoruz, eğer yoksa varsayılan açıklamaya düşüyoruz
        const weatherDesc = (current.lang_tr && current.lang_tr[0]) 
                            ? current.lang_tr[0].value 
                            : current.weatherDesc[0].value;

        res.json({
            success: true,
            sehir: sehir.toUpperCase(),
            derece: current.temp_C + "°C",
            hissedilen: current.FeelsLikeC + "°C",
            durum: weatherDesc, // Artık Türkçe gelecek
            nem: "%" + current.humidity,
            ruzgar: current.windspeedKmph + " km/h"
        });

    } catch (error) {
        console.error("Hava durumu hatası:", error.message);
        res.status(500).json({
            success: false,
            message: "Hava durumu bilgisi alınamadı",
            error: error.message
        });
    }
});
// Sunucuyu Başlat
app.listen(PORT, () => {
    console.log(`🚀 API Sunucusu hazır: http://localhost:${PORT}`);
});