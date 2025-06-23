import { useState, useRef } from 'react'
import jsPDF from 'jspdf'
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

  const generatePDF = () => {
    const pdf = new jsPDF('p', 'mm', 'a4')
    let yPos = 20
    
    // Türkçe karakter desteği için font
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(14)
    pdf.setTextColor(0, 0, 0)
    
    // Başlık - iki satırda
    const title1 = 'ICRA DOSYASI TAHSIL KABILIYETI'
    const title2 = 'DEGERLENDIRME FORMU'
    
    pdf.text(title1, 105, yPos, { align: 'center' })
    yPos += 6
    pdf.text(title2, 105, yPos, { align: 'center' })
    yPos += 10
    
    // Çizgi
    pdf.setLineWidth(0.5)
    pdf.line(15, yPos, 195, yPos)
    yPos += 10
    
    // Helper functions - Türkçe karakter desteği
    const turkishToEnglish = (text) => {
      if (typeof text !== 'string' || !text) return ''
      return text
        .replace(/ç/g, 'c').replace(/Ç/g, 'C')
        .replace(/ğ/g, 'g').replace(/Ğ/g, 'G')
        .replace(/ı/g, 'i').replace(/I/g, 'I')
        .replace(/İ/g, 'I').replace(/i/g, 'i')
        .replace(/ö/g, 'o').replace(/Ö/g, 'O')
        .replace(/ş/g, 's').replace(/Ş/g, 'S')
        .replace(/ü/g, 'u').replace(/Ü/g, 'U')
    }
    
    const addSection = (title, addSpace = true) => {
      if (addSpace) yPos += 2  // Üste biraz boşluk ekle
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(9)
      pdf.text(turkishToEnglish(title), 15, yPos)
      yPos += 5
    }
    
    const addField = (label, value, width = 85) => {
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(8)
      pdf.text(turkishToEnglish(label) + ':', 15, yPos)
      pdf.rect(45, yPos - 2.5, width, 4)
      if (value) {
        const cleanValue = turkishToEnglish(String(value)).substring(0, 35)
        pdf.text(cleanValue, 47, yPos)
      }
      yPos += 5
    }
    
    const addFieldInline = (label1, value1, label2, value2) => {
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(8)
      pdf.text(turkishToEnglish(label1) + ':', 15, yPos)
      pdf.rect(45, yPos - 2.5, 65, 4)
      if (value1) {
        pdf.text(turkishToEnglish(String(value1)).substring(0, 20), 47, yPos)
      }
      
      pdf.text(turkishToEnglish(label2) + ':', 115, yPos)
      pdf.rect(145, yPos - 2.5, 50, 4)
      if (value2) {
        pdf.text(turkishToEnglish(String(value2)).substring(0, 15), 147, yPos)
      }
      yPos += 5
    }
    
    const addTable = (headers, rows) => {
      const tableWidth = 180
      const colWidths = {
        5: [36, 36, 36, 36, 36],  // 5 kolon
        4: [45, 45, 45, 45],      // 4 kolon
        3: [60, 60, 60],          // 3 kolon
      }
      const widths = colWidths[headers.length] || Array(headers.length).fill(tableWidth / headers.length)
      
      // Headers
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(7)
      
      let xPos = 15
      headers.forEach((header, i) => {
        pdf.setFillColor(80, 80, 80)
        pdf.setTextColor(255, 255, 255)
        pdf.setDrawColor(0, 0, 0)
        pdf.rect(xPos, yPos, widths[i], 5, 'FD')
        const cleanHeader = turkishToEnglish(header).substring(0, 20)
        pdf.text(cleanHeader, xPos + 1, yPos + 3.5)
        xPos += widths[i]
      })
      yPos += 5
      
      // Rows
      pdf.setTextColor(0, 0, 0)
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(7)
      
      rows.forEach(row => {
        xPos = 15
        row.forEach((cell, i) => {
          pdf.rect(xPos, yPos, widths[i], 5)
          if (cell && String(cell).trim()) {
            const cleanCell = turkishToEnglish(String(cell)).substring(0, 25)
            pdf.text(cleanCell, xPos + 1, yPos + 3.5)
          }
          xPos += widths[i]
        })
        yPos += 5
      })
      yPos += 3
    }
    
    const checkNewPage = (space = 25) => {
      if (yPos > 270 - space) {
        pdf.addPage()
        yPos = 20
      }
    }
    
    // 1. Genel Bilgiler
    addSection('GENEL BILGILER', false)
    addFieldInline('Alacakli Adi', formData.alacakliAdi, 'Borclu Adi', formData.borcluAdi)
    addFieldInline('Icra Dairesi', formData.icraDairesi, 'Dosya Numarasi', formData.dosyaNumarasi)
    addField('Alacak Miktari', formData.alacakMiktari, 140)
    yPos += 2
    
    // 2. Borçlu Tebligat Durumu
    addSection('1. BORCLU TEBLIGAT DURUMU BILGILERI')
    const tebligatHeaders = ['Borclu', 'MERSIS/MERNIS', 'TK/35', 'TK/21', 'Not']
    const tebligatData = [
      ['Borclu 1', formData.borclu1Mersis ? 'X' : '', formData.borclu1TK35 ? 'X' : '', formData.borclu1TK21 ? 'X' : '', formData.borclu1Not],
      ['Borclu 2', formData.borclu2Mersis ? 'X' : '', formData.borclu2TK35 ? 'X' : '', formData.borclu2TK21 ? 'X' : '', formData.borclu2Not],
      ['Borclu 3', formData.borclu3Mersis ? 'X' : '', formData.borclu3TK35 ? 'X' : '', formData.borclu3TK21 ? 'X' : '', formData.borclu3Not]
    ]
    addTable(tebligatHeaders, tebligatData)
    
    // 3. UYAP Sorguları
    addSection('2. UYAP UZERINDEN GERCEKLESTIRILEN SORGULAR')
    addTable(
      ['Sorgu Konusu', 'Sonuc', 'Haciz Uygulama', 'Onceki Hacizler'],
      [
        ['Tasinmaz Mal Varligi', formData.tasinmazVarlik, formData.tasinmazHaciz, formData.tasinmazOncekiHaciz],
        ['Arac Kaydi', formData.aracKaydi, formData.aracHaciz, formData.aracOncekiHaciz],
        ['Alacakli Icra Takip', formData.alacakliTakip, formData.alacakliHaciz, formData.alacakliOncekiHaciz],
        ['SGK Tescil/Hizmet', formData.sgkKaydi, formData.sgkHaciz, formData.sgkOncekiHaciz]
      ]
    )
    
    // 4. Fiili Haciz
    addSection('3. FİİLİ HACİZ (TAŞINIR HACZİ) SÜRECİ')
    addTable(
      ['İşlem Türü', 'Süreç/Aşamalar', 'Durum', 'Açıklama'],
      [
        ['Adres Tespiti', 'Resmi Adres', formData.resmiAdresDurum, formData.resmiAdresNot],
        ['', 'Sanal Ofis', formData.sanalOfisDurum, formData.sanalOfisNot],
        ['', 'Alternatif Adres', formData.alternatifAdresDurum, formData.alternatifAdresNot],
        ['Haciz Süreci', 'Talep Yazısı', formData.talepYazisiDurum, formData.talepYazisiNot],
        ['', 'İcra Kararı', formData.icraKarariDurum, formData.icraKarariNot],
        ['', 'Adres Ziyareti', formData.adresZiyaretiDurum, formData.adresZiyaretiNot],
        ['', 'Haciz Tutanağı', formData.hacizTutanagiDurum, formData.hacizTutanagiNot],
        ['Satış Değerlendirme', 'Satış Kabiliyeti', formData.satisNotiDurum, formData.satisNotiNot]
      ]
    )
    
    if (formData.hukukiDegerlendirme) {
      addField('Genel Hukuki Değerlendirme', formData.hukukiDegerlendirme, 150)
    }
    
    // 5. Banka Haciz
    addSection('4. BANKA HACİZ SÜRECİ BİLGİLERİ')
    addTable(
      ['İşlem ve Açıklama', 'Durum', 'Not'],
      [
        ['Haciz Müzekkeresi Talebi', formData.bankaMuzekkereDurum, formData.bankaMuzekkereNot],
        ['İcra Müzekkere Gönderimi', formData.icraGonderimDurum, formData.icraGonderimNot],
        ['Banka Geri Bildirimleri', formData.bankaGeriDonuşDurum, formData.bankaGeriDonuşNot],
        ['Para Tespit ve Blokeler', formData.paraBlokedurum, formData.paraBokeNot]
      ]
    )
    
    if (formData.bankaHukukiDegerlendirme) {
      addField('Genel Hukuki Değerlendirme', formData.bankaHukukiDegerlendirme, 150)
    }
    
    // 6. Özet
    addSection('İCRA DOSYASI TAHSİL KABİLİYETİ DEĞERLENDİRME ÖZETİ')
    addField('Tebligat Süreçleri', formData.tebligatSurecOzet, 150)
    addField('Taşınmaz ve Araç Varlığı', formData.tasinmazAracOzet, 150)
    addField('SGK ve Gelir Durumu', formData.sgkGelirOzet, 150)
    addField('Fiili Haciz İmkanı', formData.hacizImkanOzet, 150)
    addField('Fiili Haciz Uygulaması', formData.hacizUygulamaOzet, 150)
    addField('Banka Varlıkları', formData.bankaVarlikOzet, 150)
    addField('Genel Tahsil Kabiliyeti', formData.genelTahsilOzet, 150)
    
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
