// Tüm hisseleri tutacağımız boş bir liste (dizi) oluşturuyoruz
let portfoy = [];

// 'Ekle' butonuna basıldığında çalışacak ana fonksiyon
function hisseEkle() {
    // HTML'deki input kutularına ulaşıp içindeki değerleri alıyoruz
    const sembolInput = document.getElementById('hisseSembol');
    const adetInput = document.getElementById('hisseAdet');

    const sembol = sembolInput.value.toUpperCase(); // Küçük yazılsa bile büyüğe çevirir (THYAO gibi)
    const adet = parseFloat(adetInput.value); // Yazıyı sayıya dönüştürür

    // Basit bir kontrol: Eğer kutular boş değilse işleme başla
    if (sembol && adet) {
        // Yeni bir 'obje' oluşturup hisse bilgilerini paketliyoruz
        const yeniHisse = {
            ad: sembol,
            miktar: adet,
            fiyat: 0 // Şimdilik 0, bir sonraki derste internetten çekeceğiz
        };

        // Bu yeni paketi 'portfoy' listemize ekliyoruz
        portfoy.push(yeniHisse);

        // Ekranı güncellemesi için diğer fonksiyonu çağırıyoruz
        tabloyuGuncelle();

        // Giriş yaptıktan sonra kutuları temizliyoruz
        sembolInput.value = '';
        adetInput.value = '';
    } else {
        alert("Lütfen tüm alanları doldurun!"); // Boş bırakılırsa uyarı verir
    }
}

// Portföy listesindeki verileri HTML tablosuna döken fonksiyon
function tabloyuGuncelle() {
    const liste = document.getElementById('hisseListesi');
    
    // Önce tablonun içini tamamen temizliyoruz ki veriler üst üste binmesin
    liste.innerHTML = '';

    // Portföydeki her bir hisse için döngü oluşturup tabloya satır ekliyoruz
    portfoy.forEach(hisse => {
        const satir = `
            <tr>
                <td>${hisse.ad}</td>
                <td>${hisse.miktar}</td>
                <td>$${hisse.fiyat}</td>
                <td>$${(hisse.miktar * hisse.fiyat).toFixed(2)}</td>
            </tr>
        `;
        // Oluşturduğumuz bu HTML satırını tablonun içine ekliyoruz
        liste.innerHTML += satir;
    });
}