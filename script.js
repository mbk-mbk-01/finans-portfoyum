// 1. AYARLAR VE DEĞİŞKENLER
const API_KEY = 'YOUR_FREE_API_KEY_HERE'; // Alpha Vantage'dan aldığın anahtar buraya!
const BASE_URL = 'https://www.alphavantage.co/query';

// Sayfa açıldığında tarayıcı hafızasına (LocalStorage) bakıyoruz.
// Kayıtlı veri varsa onu alıyoruz, yoksa boş bir liste [] başlatıyoruz.
let portfoy = JSON.parse(localStorage.getItem('portfoy')) || [];

// Sayfa ilk yüklendiğinde hafızadaki verileri ekrana basıyoruz.
tabloyuGuncelle();

// 2. ANA FONKSİYON: HİSSE EKLEME
async function hisseEkle() {
    const sembolInput = document.getElementById('hisseSembol');
    const adetInput = document.getElementById('hisseAdet');
    
    const sembol = sembolInput.value.toUpperCase().trim();
    const adet = parseFloat(adetInput.value);

    // Giriş kontrolü
    if (!sembol || isNaN(adet) || adet <= 0) {
        alert("Lütfen geçerli bir sembol ve adet girin.");
        return;
    }

    try {
        // Kullanıcıya işlemin başladığını hissettirelim
        console.log(`${sembol} aranıyor...`);

        // İnternetten fiyatı çekiyoruz (fiyatıGetir fonksiyonunu aşağıda tanımladık)
        const anlikFiyat = await fiyatıGetir(sembol);

        if (anlikFiyat) {
            const yeniHisse = {
                ad: sembol,
                miktar: adet,
                fiyat: anlikFiyat
            };

            // Listeye ekle
            portfoy.push(yeniHisse);
            
            // TARAYICIYA KAYDET (LocalStorage)
            localStorage.setItem('portfoy', JSON.stringify(portfoy));

            // Ekranı güncelle ve kutuları temizle
            tabloyuGuncelle();
            sembolInput.value = '';
            adetInput.value = '';
        } else {
            alert("Hisse bulunamadı veya API limiti doldu. (Ücretsiz API dakikada 5 istek sınırı koyar)");
        }

    } catch (hata) {
        console.error("Hata Detayı:", hata);
        alert("Hisse eklenirken teknik bir sorun oluştu.");
    }
}

// 3. API'DEN VERİ ÇEKME FONKSİYONU
async function fiyatıGetir(sembol) {
    const url = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${sembol}&apikey=${API_KEY}`;

    try {
        const cevap = await fetch(url);
        const veri = await cevap.json();

        // API'den gelen verinin yapısını kontrol ediyoruz
        if (veri["Global Quote"] && veri["Global Quote"]["05. price"]) {
            return parseFloat(veri["Global Quote"]["05. price"]);
        } 
        // Eğer API günlük/dakikalık limit uyarısı verirse konsola yazdırır
        else if (veri["Note"]) {
            console.warn("API Limit Uyarısı:", veri["Note"]);
            return null;
        }
        return null;
    } catch (hata) {
        console.error("Fetch hatası:", hata);
        throw hata; // Hatayı bir üst fonksiyona fırlat ki 'catch' bloğu yakalasın
    }
}

// 4. EKRANI GÜNCELLEME VE SİLME FONKSİYONLARI
function tabloyuGuncelle() {
    const liste = document.getElementById('hisseListesi');
    liste.innerHTML = '';

    // Portföydeki her hisse için bir satır oluşturuyoruz
    portfoy.forEach((hisse, index) => {
        const satir = `
            <tr>
                <td>${hisse.ad}</td>
                <td>${hisse.miktar}</td>
                <td>$${hisse.fiyat.toFixed(2)}</td>
                <td>$${(hisse.miktar * hisse.fiyat).toFixed(2)}</td>
                <td>
                    <button onclick="hisseSil(${index})" style="background-color: #e74c3c; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">
                        Sil
                    </button>
                </td>
            </tr>
        `;
        liste.innerHTML += satir;
    });
}

function hisseSil(index) {
    // Listeden ilgili sıradaki elemanı sil
    portfoy.splice(index, 1);
    
    // Güncel listeyi hafızaya (LocalStorage) kaydet
    localStorage.setItem('portfoy', JSON.stringify(portfoy));
    
    // Ekranı yeniden çiz
    tabloyuGuncelle();
}