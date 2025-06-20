import { useState, useRef } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import './App.css'

function App() {
  const formRef = useRef()
  
  // Form state
  const [formData, setFormData] = useState({
    // Genel Bilgiler
    alacakliAdi: '',
    borcluAdi: '',
    icraDairesi: '',
    dosyaNumarasi: '',
    alacakMiktari: '',
    
    // Borçlu Tebligat Durumu
    borclu1Mersis: false,
    borclu1TK35: false,
    borclu1TK21: false,
    borclu1Not: '',
    borclu2Mersis: false,
    borclu2TK35: false,
    borclu2TK21: false,
    borclu2Not: '',
    borclu3Mersis: false,
    borclu3TK35: false,
    borclu3TK21: false,
    borclu3Not: '',
    
    // UYAP Sorguları
    tasinmazVarlik: 'yok',
    tasinmazHaciz: '',
    tasinmazOncekiHaciz: '',
    aracKaydi: 'yok',
    aracHaciz: '',
    aracOncekiHaciz: '',
    alacakliTakip: 'yok',
    alacakliHaciz: '',
    alacakliOncekiHaciz: '',
    sgkKaydi: 'yok',
    sgkHaciz: '',
    sgkOncekiHaciz: '',
    
    // Fiili Haciz
    resmiAdres: '',
    resmiAdresDurum: '',
    resmiAdresNot: '',
    sanalOfis: '',
    sanalOfisDurum: '',
    sanalOfisNot: '',
    alternatifAdres: '',
    alternatifAdresDurum: '',
    alternatifAdresNot: '',
    talepYazisi: '',
    talepYazisiDurum: '',
    talepYazisiNot: '',
    icraKarari: '',
    icraKarariDurum: '',
    icraKarariNot: '',
    adresZiyareti: '',
    adresZiyaretiDurum: '',
    adresZiyaretiNot: '',
    hacizTutanagi: '',
    hacizTutanagiDurum: '',
    hacizTutanagiNot: '',
    satisNoti: '',
    satisNotiDurum: '',
    satisNotiNot: '',
    hukukiDegerlendirme: '',
    
    // Banka Haciz
    bankaMuzekkere: '',
    bankaMuzekkereDurum: '',
    bankaMuzekkereNot: '',
    icraGonderim: '',
    icraGonderimDurum: '',
    icraGonderimNot: '',
    bankaGeriDonuş: '',
    bankaGeriDonuşDurum: '',
    bankaGeriDonuşNot: '',
    paraBloke: '',
    paraBlokedurum: '',
    paraBokeNot: '',
    bankaHukukiDegerlendirme: '',
    
    // Özet
    tebligatSurecOzet: '',
    tasinmazAracOzet: '',
    sgkGelirOzet: '',
    hacizImkanOzet: '',
    hacizUygulamaOzet: '',
    bankaVarlikOzet: '',
    genelTahsilOzet: ''
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // Dosya ismi oluşturma fonksiyonu
  const createFileName = (borcluAdi) => {
    if (!borcluAdi || borcluAdi.trim() === '') {
      return 'icra-dosyasi-tahsil-kabiliyeti-formu.pdf'
    }
    
    // Türkçe karakterleri İngilizce'ye çevir
    const turkishMap = {
      'ç': 'c', 'Ç': 'c',
      'ğ': 'g', 'Ğ': 'g', 
      'ı': 'i', 'I': 'i',
      'İ': 'i', 'i': 'i',
      'ö': 'o', 'Ö': 'o',
      'ş': 's', 'Ş': 's',
      'ü': 'u', 'Ü': 'u'
    }
    
    let fileName = borcluAdi
      .toLowerCase()
      .split('')
      .map(char => turkishMap[char] || char)
      .join('')
      .replace(/[^a-z0-9\s-]/g, '') // Özel karakterleri kaldır
      .replace(/\s+/g, '-') // Boşlukları tire ile değiştir
      .replace(/-+/g, '-') // Çoklu tireleri tek tire yap
      .replace(/^-|-$/g, '') // Başındaki ve sonundaki tireleri kaldır
    
    return `${fileName}-icra-tahsil-kabiliyeti-formu.pdf`
  }

  const generatePDF = async () => {
    const element = formRef.current
    
    // PDF için özel styling
    element.classList.add('pdf-mode')
    element.style.background = 'white'
    
    // DOM'un güncellenmesini bekle
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const canvas = await html2canvas(element, {
      scale: 1.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight,
      removeContainer: true
    })
    
    // Styling'i eski haline getir
    element.classList.remove('pdf-mode')
    element.style.background = ''
    
    const imgData = canvas.toDataURL('image/png', 0.95)
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgWidth = 210   // Tam sayfa genişliği
    const pageHeight = 297 // Tam sayfa yüksekliği
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    
    // Tek sayfaya sığdırmaya çalış
    if (imgHeight <= pageHeight) {
      // Tek sayfa - tam boyut
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, '', 'FAST')
    } else {
      // Çok uzunsa scale down yap - tam sayfa kullan
      const scaleFactor = pageHeight / imgHeight
      const scaledWidth = imgWidth * scaleFactor
      const scaledHeight = pageHeight
      const xPosition = (210 - scaledWidth) / 2
      
      pdf.addImage(imgData, 'PNG', xPosition, 0, scaledWidth, scaledHeight, '', 'FAST')
    }
    
    // Dinamik dosya ismi oluştur
    const fileName = createFileName(formData.borcluAdi)
    pdf.save(fileName)
  }

  return (
    <div className="app">
      <div className="container">
        <div className="form-wrapper" ref={formRef}>
          <div className="form-header">
            <h1>İcra Dosyası Tahsil Kabiliyeti Değerlendirme Formu</h1>
          </div>

          {/* Genel Bilgiler */}
          <section className="form-section">
            <h2>Genel Bilgiler</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Alacaklı Adı:</label>
                <input
                  type="text"
                  name="alacakliAdi"
                  value={formData.alacakliAdi}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Borçlu Adı:</label>
                <input
                  type="text"
                  name="borcluAdi"
                  value={formData.borcluAdi}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>İcra Dairesi:</label>
                <input
                  type="text"
                  name="icraDairesi"
                  value={formData.icraDairesi}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Dosya Numarası:</label>
                <input
                  type="text"
                  name="dosyaNumarasi"
                  value={formData.dosyaNumarasi}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group full-width">
                <label>Alacak Miktarı:</label>
                <input
                  type="text"
                  name="alacakMiktari"
                  value={formData.alacakMiktari}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </section>

          {/* Borçlu Tebligat Durumu */}
          <section className="form-section">
            <h2>1. Borçlu Tebligat Durumu Bilgileri</h2>
            
            <div className="tebligat-table">
              <div className="table-header">
                <div>Borçlu</div>
                <div>MERSİS/MERNİS Adresine Tebligat</div>
                <div>TK/35'e Göre Tebligat</div>
                <div>TK/21'e Göre Tebligat</div>
                <div>Not</div>
              </div>
              
              <div className="table-row">
                <div>Borçlu 1</div>
                <div>
                  <input
                    type="checkbox"
                    name="borclu1Mersis"
                    checked={formData.borclu1Mersis}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <input
                    type="checkbox"
                    name="borclu1TK35"
                    checked={formData.borclu1TK35}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <input
                    type="checkbox"
                    name="borclu1TK21"
                    checked={formData.borclu1TK21}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="borclu1Not"
                    value={formData.borclu1Not}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="table-row">
                <div>Borçlu 2</div>
                <div>
                  <input
                    type="checkbox"
                    name="borclu2Mersis"
                    checked={formData.borclu2Mersis}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <input
                    type="checkbox"
                    name="borclu2TK35"
                    checked={formData.borclu2TK35}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <input
                    type="checkbox"
                    name="borclu2TK21"
                    checked={formData.borclu2TK21}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="borclu2Not"
                    value={formData.borclu2Not}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="table-row">
                <div>Borçlu 3</div>
                <div>
                  <input
                    type="checkbox"
                    name="borclu3Mersis"
                    checked={formData.borclu3Mersis}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <input
                    type="checkbox"
                    name="borclu3TK35"
                    checked={formData.borclu3TK35}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <input
                    type="checkbox"
                    name="borclu3TK21"
                    checked={formData.borclu3TK21}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="borclu3Not"
                    value={formData.borclu3Not}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* UYAP Sorguları */}
          <section className="form-section">
            <h2>2. UYAP Üzerinden Gerçekleştirilen Sorgular ve Haciz Bilgileri</h2>
            
            <div className="uyap-table">
              <div className="table-header">
                <div>Sorgu Konusu</div>
                <div>Sonuç</div>
                <div>Haciz Uygulama Bilgisi</div>
                <div>Haczimizden Önce Konulmuş Hacizler/Rehinler</div>
              </div>
              
              <div className="table-row">
                <div>Taşınmaz Mal Varlığı</div>
                <div>
                  <select
                    name="tasinmazVarlik"
                    value={formData.tasinmazVarlik}
                    onChange={handleInputChange}
                  >
                    <option value="yok">Yok</option>
                    <option value="var">Var</option>
                  </select>
                </div>
                <div>
                  <textarea
                    name="tasinmazHaciz"
                    value={formData.tasinmazHaciz}
                    onChange={handleInputChange}
                    rows="2"
                  />
                </div>
                <div>
                  <textarea
                    name="tasinmazOncekiHaciz"
                    value={formData.tasinmazOncekiHaciz}
                    onChange={handleInputChange}
                    rows="2"
                  />
                </div>
              </div>
              
              <div className="table-row">
                <div>Araç Kaydı</div>
                <div>
                  <select
                    name="aracKaydi"
                    value={formData.aracKaydi}
                    onChange={handleInputChange}
                  >
                    <option value="yok">Yok</option>
                    <option value="var">Var</option>
                  </select>
                </div>
                <div>
                  <textarea
                    name="aracHaciz"
                    value={formData.aracHaciz}
                    onChange={handleInputChange}
                    rows="2"
                  />
                </div>
                <div>
                  <textarea
                    name="aracOncekiHaciz"
                    value={formData.aracOncekiHaciz}
                    onChange={handleInputChange}
                    rows="2"
                  />
                </div>
              </div>
              
              <div className="table-row">
                <div>Alacaklı Olduğu İcra Takip Dosyaları</div>
                <div>
                  <select
                    name="alacakliTakip"
                    value={formData.alacakliTakip}
                    onChange={handleInputChange}
                  >
                    <option value="yok">Yok</option>
                    <option value="var">Var</option>
                  </select>
                </div>
                <div>
                  <textarea
                    name="alacakliHaciz"
                    value={formData.alacakliHaciz}
                    onChange={handleInputChange}
                    rows="2"
                  />
                </div>
                <div>
                  <textarea
                    name="alacakliOncekiHaciz"
                    value={formData.alacakliOncekiHaciz}
                    onChange={handleInputChange}
                    rows="2"
                  />
                </div>
              </div>
              
              <div className="table-row">
                <div>SGK Tescil / Hizmet Kaydı</div>
                <div>
                  <select
                    name="sgkKaydi"
                    value={formData.sgkKaydi}
                    onChange={handleInputChange}
                  >
                    <option value="yok">Yok</option>
                    <option value="var">Var</option>
                  </select>
                </div>
                <div>
                  <textarea
                    name="sgkHaciz"
                    value={formData.sgkHaciz}
                    onChange={handleInputChange}
                    rows="2"
                    placeholder="Maaş haczi imkanı"
                  />
                </div>
                <div>
                  <textarea
                    name="sgkOncekiHaciz"
                    value={formData.sgkOncekiHaciz}
                    onChange={handleInputChange}
                    rows="2"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Fiili Haciz */}
          <section className="form-section">
            <h2>3. Fiili Haciz (Taşınır Haczi) Süreci Bilgileri</h2>
            
            <div className="haciz-table">
              <div className="table-header">
                <div>İşlem Türü</div>
                <div>Süreç/Aşamalar</div>
                <div>İşlem Durumu</div>
                <div>Açıklama / Not</div>
              </div>
              
              <div className="table-row">
                <div rowSpan="3">Adres Tespiti</div>
                <div>Resmi Adres</div>
                <div>
                  <input
                    type="text"
                    name="resmiAdresDurum"
                    value={formData.resmiAdresDurum}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <textarea
                    name="resmiAdresNot"
                    value={formData.resmiAdresNot}
                    onChange={handleInputChange}
                    rows="2"
                  />
                </div>
              </div>
              
              <div className="table-row">
                <div></div>
                <div>Sanal Ofis Durumu</div>
                <div>
                  <input
                    type="text"
                    name="sanalOfisDurum"
                    value={formData.sanalOfisDurum}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <textarea
                    name="sanalOfisNot"
                    value={formData.sanalOfisNot}
                    onChange={handleInputChange}
                    rows="2"
                  />
                </div>
              </div>
              
              <div className="table-row">
                <div></div>
                <div>Alternatif/ Şube vs. Adresleri</div>
                <div>
                  <input
                    type="text"
                    name="alternatifAdresDurum"
                    value={formData.alternatifAdresDurum}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <textarea
                    name="alternatifAdresNot"
                    value={formData.alternatifAdresNot}
                    onChange={handleInputChange}
                    rows="2"
                  />
                </div>
              </div>
              
              <div className="table-row">
                <div rowSpan="4">Haciz Süreci</div>
                <div>Fiili Haciz Talep Yazısının Hazırlanması</div>
                <div>
                  <input
                    type="text"
                    name="talepYazisiDurum"
                    value={formData.talepYazisiDurum}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <textarea
                    name="talepYazisiNot"
                    value={formData.talepYazisiNot}
                    onChange={handleInputChange}
                    rows="2"
                  />
                </div>
              </div>
              
              <div className="table-row">
                <div></div>
                <div>İcra Müdürlüğünün Talep Üzerine Verdiği Karar</div>
                <div>
                  <input
                    type="text"
                    name="icraKarariDurum"
                    value={formData.icraKarariDurum}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <textarea
                    name="icraKarariNot"
                    value={formData.icraKarariNot}
                    onChange={handleInputChange}
                    rows="2"
                  />
                </div>
              </div>
              
              <div className="table-row">
                <div></div>
                <div>Tespit Edilen Adreslere Gidilmesi</div>
                <div>
                  <input
                    type="text"
                    name="adresZiyaretiDurum"
                    value={formData.adresZiyaretiDurum}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <textarea
                    name="adresZiyaretiNot"
                    value={formData.adresZiyaretiNot}
                    onChange={handleInputChange}
                    rows="2"
                  />
                </div>
              </div>
              
              <div className="table-row">
                <div></div>
                <div>Haciz Tutanağı Düzenlenmesi</div>
                <div>
                  <input
                    type="text"
                    name="hacizTutanagiDurum"
                    value={formData.hacizTutanagiDurum}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <textarea
                    name="hacizTutanagiNot"
                    value={formData.hacizTutanagiNot}
                    onChange={handleInputChange}
                    rows="2"
                  />
                </div>
              </div>
              
              <div className="table-row">
                <div>Haczedilen Taşınırların Satış Değerlendirmesi</div>
                <div>Borcun ne kadarını karşıladığı ve satış kabiliyeti</div>
                <div>
                  <input
                    type="text"
                    name="satisNotiDurum"
                    value={formData.satisNotiDurum}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <textarea
                    name="satisNotiNot"
                    value={formData.satisNotiNot}
                    onChange={handleInputChange}
                    rows="2"
                  />
                </div>
              </div>
              
              <div className="table-row">
                <div>Genel Hukuki Değerlendirme</div>
                <div></div>
                <div></div>
                <div>
                  <textarea
                    name="hukukiDegerlendirme"
                    value={formData.hukukiDegerlendirme}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Banka Haciz */}
          <section className="form-section">
            <h2>4. Banka Haciz Süreci Bilgileri</h2>
            
            <div className="banka-table">
              <div className="table-header">
                <div>İşlem ve Açıklama</div>
                <div>Durum</div>
                <div>Not</div>
              </div>
              
              <div className="table-row">
                <div>Bankalara Haciz Müzekkeresi Gönderilmesi Talebi</div>
                <div>
                  <input
                    type="text"
                    name="bankaMuzekkereDurum"
                    value={formData.bankaMuzekkereDurum}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <textarea
                    name="bankaMuzekkereNot"
                    value={formData.bankaMuzekkereNot}
                    onChange={handleInputChange}
                    rows="2"
                  />
                </div>
              </div>
              
              <div className="table-row">
                <div>İcra Daireleri tarafından Bankalara Müzekkere Gönderilmesi</div>
                <div>
                  <input
                    type="text"
                    name="icraGonderimDurum"
                    value={formData.icraGonderimDurum}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <textarea
                    name="icraGonderimNot"
                    value={formData.icraGonderimNot}
                    onChange={handleInputChange}
                    rows="2"
                  />
                </div>
              </div>
              
              <div className="table-row">
                <div>Bankalardan Gelen Geri Bildirimler</div>
                <div>
                  <input
                    type="text"
                    name="bankaGeriDonuşDurum"
                    value={formData.bankaGeriDonuşDurum}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <textarea
                    name="bankaGeriDonuşNot"
                    value={formData.bankaGeriDonuşNot}
                    onChange={handleInputChange}
                    rows="2"
                  />
                </div>
              </div>
              
              <div className="table-row">
                <div>Para tespit edilen bankalar ve Hesap Üzerine konulan Blokeler</div>
                <div>
                  <input
                    type="text"
                    name="paraBlokedurum"
                    value={formData.paraBlokedurum}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <textarea
                    name="paraBokeNot"
                    value={formData.paraBokeNot}
                    onChange={handleInputChange}
                    rows="2"
                  />
                </div>
              </div>
              
              <div className="table-row">
                <div>Genel Hukuki Değerlendirme</div>
                <div></div>
                <div>
                  <textarea
                    name="bankaHukukiDegerlendirme"
                    value={formData.bankaHukukiDegerlendirme}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Özet */}
          <section className="form-section">
            <h2>İcra Dosyası Tahsil Kabiliyeti Değerlendirme Özeti</h2>
            
            <div className="ozet-table">
              <div className="table-header">
                <div>Değerlendirme Alanı</div>
                <div>Sonuç / Açıklama</div>
              </div>
              
              <div className="table-row">
                <div>Tebligat Süreçleri</div>
                <div>
                  <textarea
                    name="tebligatSurecOzet"
                    value={formData.tebligatSurecOzet}
                    onChange={handleInputChange}
                    rows="2"
                    placeholder="Hangi usulle tebligat yapılmış."
                  />
                </div>
              </div>
              
              <div className="table-row">
                <div>Taşınmaz ve Araç Varlığı</div>
                <div>
                  <textarea
                    name="tasinmazAracOzet"
                    value={formData.tasinmazAracOzet}
                    onChange={handleInputChange}
                    rows="2"
                    placeholder="Araç mevcut, taşınmaz tespiti yok. vs."
                  />
                </div>
              </div>
              
              <div className="table-row">
                <div>SGK ve Gelir Durumu</div>
                <div>
                  <textarea
                    name="sgkGelirOzet"
                    value={formData.sgkGelirOzet}
                    onChange={handleInputChange}
                    rows="2"
                    placeholder="Kayıt mevcut, çalışmakta."
                  />
                </div>
              </div>
              
              <div className="table-row">
                <div>Fiili Haciz İmkanı</div>
                <div>
                  <textarea
                    name="hacizImkanOzet"
                    value={formData.hacizImkanOzet}
                    onChange={handleInputChange}
                    rows="2"
                    placeholder="Adres bilgileri mevcut, hacze elverişli"
                  />
                </div>
              </div>
              
              <div className="table-row">
                <div>Fiili Haciz Uygulaması</div>
                <div>
                  <textarea
                    name="hacizUygulamaOzet"
                    value={formData.hacizUygulamaOzet}
                    onChange={handleInputChange}
                    rows="2"
                    placeholder="Fiili hacze gidildi, sonuçsuz kaldı."
                  />
                </div>
              </div>
              
              <div className="table-row">
                <div>Banka Varlıkları</div>
                <div>
                  <textarea
                    name="bankaVarlikOzet"
                    value={formData.bankaVarlikOzet}
                    onChange={handleInputChange}
                    rows="2"
                    placeholder="Haciz talebi gönderildi, cevap bekleniyor / yahut olumsuz dönüşler mevcut."
                  />
                </div>
              </div>
              
              <div className="table-row">
                <div>Genel Tahsil Kabiliyeti</div>
      <div>
                  <textarea
                    name="genelTahsilOzet"
                    value={formData.genelTahsilOzet}
                    onChange={handleInputChange}
                    rows="2"
                    placeholder="Tahsil ihtimali var/yok"
                  />
                </div>
              </div>
            </div>
          </section>
      </div>

        <div className="form-actions">
          <button 
            onClick={generatePDF}
            className="pdf-button"
          >
            PDF İndir
        </button>
        </div>
      </div>
    </div>
  )
}

export default App
