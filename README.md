## 🚋 Kayseri Tramvay & 🌦️ Günlük Hava Durumu Uygulaması

Bu proje, **Kayseri ili** için özel olarak hazırlanmış **tramvay bilgileri** ve **günlük hava durumu** verilerini web arayüzünde gösteren bir uygulamadır.

---

## ⚙️ Kurulum ve Çalıştırma

### Konsolu Açma
Proje klasöründeyken konsolu açmak için:

Ctrl + Shift + "

### Node.js Uygulamasını Başlatma
Açılan konsola aşağıdaki komutu yazıp çalıştırın:

node app.js

---

### Web Sayfasını Açma
- `index.html` dosyasını tarayıcıda açın.
- Açılan web sayfasında:
  - Günlük hava durumu
  - Kayseri tramvay bilgileri

görüntülenecektir.

---

## ℹ️ Önemli Notlar

- 🚋 Tramvay bilgileri **Kayseri iline özel** olarak geliştirilmiş bir entegrasyondur.  
  Farklı bir şehirdeyseniz tramvay bilgileri görüntülenmeyebilir.

- 🌦️ Hava durumu verileri genel olarak tüm şehirler için çalışır.  
  Farklı bir şehir için hava durumu almak isterseniz:
  - `index.html` dosyası içerisinde bulunan `fetchWeather()` fonksiyonundaki endpoint alanına şehir adını yazmanız yeterlidir.
  - Dönen veriler seçilen şehre ait olacaktır.

---

## 🛠️ Kullanılan Teknolojiler

- Node.js  
- JavaScript  
- HTML / CSS  
- Fetch API
