const fs = require('fs');
const https = require('https');
const path = require('path');

// API bilgileri
const API_KEY = '4d54f3eab89770c849fd9da97f724df0'; // buraya kendi API Key'ini koyacaksın
const CITY = 'Baku';
const URL = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric&lang=en`;

// JSON dosya yolu
const filePath = path.join(__dirname, 'oled.json');

// Hava durumu bilgisini çek
https.get(URL, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    const weather = JSON.parse(data);
    const description = `${weather.weather[0].description}, ${Math.round(weather.main.temp)}°C`;

    // oled.json'u oku
    let oledData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Alanları güncelle
    oledData.data.message = "Baku, AZ";
    oledData.data.description = description;

    // Dosyaya yaz
    fs.writeFileSync(filePath, JSON.stringify(oledData, null, 2));

    console.log('oled.json güncellendi:', oledData);
  });

}).on('error', (err) => {
  console.error('Hava durumu bilgisi alınamadı:', err.message);
});
