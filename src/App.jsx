import { useState, useRef } from 'react'
import jsPDF from 'jspdf'
import './App.css'

const staticCellColor = [235, 238, 242]; // Light grayish blue

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
    borclu1eTebligat: false,
    borclu1Not: '',
    borclu2Mersis: false,
    borclu2TK35: false,
    borclu2TK21: false,
    borclu2eTebligat: false,
    borclu2Not: '',
    borclu3Mersis: false,
    borclu3TK35: false,
    borclu3TK21: false,
    borclu3eTebligat: false,
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
      .replace(/\s+/g, '-') // Boşltukları tire ile değiştir
      .replace(/-+/g, '-') // Çoklu ireleri tek tire yap
      .replace(/^-|-$/g, '') // Başındaki ve sonundaki tireleri kaldır
    
    return `${fileName}-icra-tahsil-kabiliyeti-formu.pdf`
  }

  const generatePDF = () => {
    const pdf = new jsPDF('p', 'mm', 'a4')
    let yPos = 20
    
    // Türkçe karakter desteği için font
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(12)
    pdf.setTextColor(0, 0, 0)
    
    // Başlık
    const title = 'ICRA DOSYASI TAHSIL KABILIYETI DEGERLENDIRME FORMU'
    pdf.text(title, 105, yPos, { align: 'center' })
    yPos += 8
    
    // Çizgi
    pdf.setLineWidth(0.5)
    pdf.line(15, yPos, 195, yPos)
    yPos += 8
    
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
      if (addSpace) yPos += 4
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(9)
      pdf.text(turkishToEnglish(title), 15, yPos)
      yPos += 4
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
        6: [30, 30, 30, 30, 30, 30],
        5: [36, 36, 36, 36, 36],
        4: [45, 45, 45, 45],
        3: [60, 60, 60],
        2: [50, 130],
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
        checkNewPage(20)

        let maxLines = 1
        row.forEach((cell, i) => {
          const text = cell.text ? String(cell.text) : ''
          const lines = pdf.splitTextToSize(turkishToEnglish(text), widths[i] - 2)
          if (lines.length > maxLines) {
            maxLines = lines.length
          }
        })

        const rowHeight = maxLines * 3.5 + 1.5
        checkNewPage(rowHeight)

        xPos = 15
        row.forEach((cell, i) => {
          if (cell.isStatic) {
            pdf.setFillColor(staticCellColor[0], staticCellColor[1], staticCellColor[2]);
          } else {
            pdf.setFillColor(255, 255, 255);
          }
          pdf.setDrawColor(0, 0, 0);
          pdf.rect(xPos, yPos, widths[i], rowHeight, 'FD')
          
          pdf.setTextColor(0, 0, 0);
          if (cell.text && String(cell.text).trim()) {
            const text = turkishToEnglish(String(cell.text))
            const textLines = pdf.splitTextToSize(text, widths[i] - 2)
            pdf.text(textLines, xPos + 1, yPos + 3.5)
          }
          xPos += widths[i]
        })
        yPos += rowHeight
      })
      yPos += 2
    }
    
    const checkNewPage = (space = 25) => {
      if (yPos > 285 - space) {
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
    const tebligatHeaders = ['Borclu', 'MERSIS/MERNIS', 'TK/35', 'TK/21', 'e-Tebligat', 'Not']
    const tebligatData = [
      [
        { text: 'Borclu 1', isStatic: true },
        { text: formData.borclu1Mersis ? 'X' : '' },
        { text: formData.borclu1TK35 ? 'X' : '' },
        { text: formData.borclu1TK21 ? 'X' : '' },
        { text: formData.borclu1eTebligat ? 'X' : '' },
        { text: formData.borclu1Not }
      ],
      [
        { text: 'Borclu 2', isStatic: true },
        { text: formData.borclu2Mersis ? 'X' : '' },
        { text: formData.borclu2TK35 ? 'X' : '' },
        { text: formData.borclu2TK21 ? 'X' : '' },
        { text: formData.borclu2eTebligat ? 'X' : '' },
        { text: formData.borclu2Not }
      ],
      [
        { text: 'Borclu 3', isStatic: true },
        { text: formData.borclu3Mersis ? 'X' : '' },
        { text: formData.borclu3TK35 ? 'X' : '' },
        { text: formData.borclu3TK21 ? 'X' : '' },
        { text: formData.borclu3eTebligat ? 'X' : '' },
        { text: formData.borclu3Not }
      ]
    ]
    addTable(tebligatHeaders, tebligatData)
    
    // 3. UYAP Sorguları
    addSection('2. UYAP UZERINDEN GERCEKLESTIRILEN SORGULAR')
    addTable(
      ['Sorgu Konusu', 'Sonuc', 'Haciz Uygulama', 'Onceki Hacizler'],
      [
        [{ text: 'Tasinmaz Mal Varligi', isStatic: true }, { text: formData.tasinmazVarlik }, { text: formData.tasinmazHaciz }, { text: formData.tasinmazOncekiHaciz }],
        [{ text: 'Arac Kaydi', isStatic: true }, { text: formData.aracKaydi }, { text: formData.aracHaciz }, { text: formData.aracOncekiHaciz }],
        [{ text: 'Alacakli Icra Takip', isStatic: true }, { text: formData.alacakliTakip }, { text: formData.alacakliHaciz }, { text: formData.alacakliOncekiHaciz }],
        [{ text: 'SGK Tescil/Hizmet', isStatic: true }, { text: formData.sgkKaydi }, { text: formData.sgkHaciz }, { text: formData.sgkOncekiHaciz }]
      ]
    )
    
    // 4. Fiili Haciz
    addSection('3. FİİLİ HACİZ (TAŞINIR HACZİ) SÜRECİ')
    addTable(
      ['İşlem Türü', 'Süreç/Aşamalar', 'Durum', 'Açıklama'],
      [
        [{ text: 'Adres Tespiti', isStatic: true }, { text: 'Resmi Adres', isStatic: true }, { text: formData.resmiAdresDurum }, { text: formData.resmiAdresNot }],
        [{ text: '', isStatic: true }, { text: 'Sanal Ofis', isStatic: true }, { text: formData.sanalOfisDurum }, { text: formData.sanalOfisNot }],
        [{ text: '', isStatic: true }, { text: 'Alternatif Adres', isStatic: true }, { text: formData.alternatifAdresDurum }, { text: formData.alternatifAdresNot }],
        [{ text: 'Haciz Süreci', isStatic: true }, { text: 'Talep Yazısı', isStatic: true }, { text: formData.talepYazisiDurum }, { text: formData.talepYazisiNot }],
        [{ text: '', isStatic: true }, { text: 'İcra Kararı', isStatic: true }, { text: formData.icraKarariDurum }, { text: formData.icraKarariNot }],
        [{ text: '', isStatic: true }, { text: 'Adres Ziyareti', isStatic: true }, { text: formData.adresZiyaretiDurum }, { text: formData.adresZiyaretiNot }],
        [{ text: '', isStatic: true }, { text: 'Haciz Tutanağı', isStatic: true }, { text: formData.hacizTutanagiDurum }, { text: formData.hacizTutanagiNot }],
        [{ text: 'Satış Değerlendirme', isStatic: true }, { text: 'Satış Kabiliyeti', isStatic: true }, { text: formData.satisNotiDurum }, { text: formData.satisNotiNot }],
        [{ text: 'Genel Hukuki Değerlendirme', isStatic: true }, { text: '', isStatic: true }, { text: '', isStatic: true }, { text: formData.hukukiDegerlendirme }]
      ]
    )
    
    // 5. Banka Haciz
    addSection('4. BANKA HACİZ SÜRECİ BİLGİLERİ')
    addTable(
      ['İşlem ve Açıklama', 'Durum', 'Not'],
      [
        [{ text: 'Haciz Müzekkeresi Talebi', isStatic: true }, { text: formData.bankaMuzekkereDurum }, { text: formData.bankaMuzekkereNot }],
        [{ text: 'İcra Müzekkere Gönderimi', isStatic: true }, { text: formData.icraGonderimDurum }, { text: formData.icraGonderimNot }],
        [{ text: 'Banka Geri Bildirimleri', isStatic: true }, { text: formData.bankaGeriDonuşDurum }, { text: formData.bankaGeriDonuşNot }],
        [{ text: 'Para Tespit ve Blokeler', isStatic: true }, { text: formData.paraBlokedurum }, { text: formData.paraBokeNot }],
        [{ text: 'Genel Hukuki Değerlendirme', isStatic: true }, { text: '', isStatic: true }, { text: formData.bankaHukukiDegerlendirme }]
      ]
    )
    
    // 6. Özet
    addSection('İCRA DOSYASI TAHSİL KABİLİYETİ DEĞERLENDİRME ÖZETİ')
    addTable(
      ['Değerlendirme Alanı', 'Sonuç / Açıklama'],
      [
        [{ text: 'Tebligat Süreçleri', isStatic: true }, { text: formData.tebligatSurecOzet }],
        [{ text: 'Taşınmaz ve Araç Varlığı', isStatic: true }, { text: formData.tasinmazAracOzet }],
        [{ text: 'SGK ve Gelir Durumu', isStatic: true }, { text: formData.sgkGelirOzet }],
        [{ text: 'Fiili Haciz İmkanı', isStatic: true }, { text: formData.hacizImkanOzet }],
        [{ text: 'Fiili Haciz Uygulaması', isStatic: true }, { text: formData.hacizUygulamaOzet }],
        [{ text: 'Banka Varlıkları', isStatic: true }, { text: formData.bankaVarlikOzet }],
        [{ text: 'Genel Tahsil Kabiliyeti', isStatic: true }, { text: formData.genelTahsilOzet }]
      ]
    )
    
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
                <div>e-Tebligat Durumu</div>
                <div>Not</div>
              </div>
              
              <div className="table-row">
                <div data-label="Borçlu">Borçlu 1</div>
                <div data-label="MERSİS/MERNİS Adresine Tebligat">
                  <input
                    type="checkbox"
                    name="borclu1Mersis"
                    checked={formData.borclu1Mersis}
                    onChange={handleInputChange}
                  />
                </div>
                <div data-label="TK/35'e Göre Tebligat">
                  <input
                    type="checkbox"
                    name="borclu1TK35"
                    checked={formData.borclu1TK35}
                    onChange={handleInputChange}
                  />
                </div>
                <div data-label="TK/21'e Göre Tebligat">
                  <input
                    type="checkbox"
                    name="borclu1TK21"
                    checked={formData.borclu1TK21}
                    onChange={handleInputChange}
                  />
                </div>
                <div data-label="e-Tebligat Durumu">
                  <input
                    type="checkbox"
                    name="borclu1eTebligat"
                    checked={formData.borclu1eTebligat}
                    onChange={handleInputChange}
                  />
                </div>
                <div data-label="Not">
                  <input
                    type="text"
                    name="borclu1Not"
                    value={formData.borclu1Not}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="table-row">
                <div data-label="Borçlu">Borçlu 2</div>
                <div data-label="MERSİS/MERNİS Adresine Tebligat">
                  <input
                    type="checkbox"
                    name="borclu2Mersis"
                    checked={formData.borclu2Mersis}
                    onChange={handleInputChange}
                  />
                </div>
                <div data-label="TK/35'e Göre Tebligat">
                  <input
                    type="checkbox"
                    name="borclu2TK35"
                    checked={formData.borclu2TK35}
                    onChange={handleInputChange}
                  />
                </div>
                <div data-label="TK/21'e Göre Tebligat">
                  <input
                    type="checkbox"
                    name="borclu2TK21"
                    checked={formData.borclu2TK21}
                    onChange={handleInputChange}
                  />
                </div>
                <div data-label="e-Tebligat Durumu">
                  <input
                    type="checkbox"
                    name="borclu2eTebligat"
                    checked={formData.borclu2eTebligat}
                    onChange={handleInputChange}
                  />
                </div>
                <div data-label="Not">
                  <input
                    type="text"
                    name="borclu2Not"
                    value={formData.borclu2Not}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="table-row">
                <div data-label="Borçlu">Borçlu 3</div>
                <div data-label="MERSİS/MERNİS Adresine Tebligat">
                  <input
                    type="checkbox"
                    name="borclu3Mersis"
                    checked={formData.borclu3Mersis}
                    onChange={handleInputChange}
                  />
                </div>
                <div data-label="TK/35'e Göre Tebligat">
                  <input
                    type="checkbox"
                    name="borclu3TK35"
                    checked={formData.borclu3TK35}
                    onChange={handleInputChange}
                  />
                </div>
                <div data-label="TK/21'e Göre Tebligat">
                  <input
                    type="checkbox"
                    name="borclu3TK21"
                    checked={formData.borclu3TK21}
                    onChange={handleInputChange}
                  />
                </div>
                <div data-label="e-Tebligat Durumu">
                  <input
                    type="checkbox"
                    name="borclu3eTebligat"
                    checked={formData.borclu3eTebligat}
                    onChange={handleInputChange}
                  />
                </div>
                <div data-label="Not">
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
                <div data-label="Sorgu Konusu">Taşınmaz Mal Varlığı</div>
                <div data-label="Sonuç">
                  <select
                    name="tasinmazVarlik"
                    value={formData.tasinmazVarlik}
                    onChange={handleInputChange}
                  >
                    <option value="yok">Yok</option>
                    <option value="var">Var</option>
                  </select>
                </div>
                <div data-label="Haciz Uygulama Bilgisi">
                  <textarea
                    name="tasinmazHaciz"
                    value={formData.tasinmazHaciz}
                    onChange={handleInputChange}
                    rows="2"
                  />
                </div>
                <div data-label="Haczimizden Önce Konulmuş Hacizler/Rehinler">
                  <textarea
                    name="tasinmazOncekiHaciz"
                    value={formData.tasinmazOncekiHaciz}
                    onChange={handleInputChange}
                    rows="2"
                  />
                </div>
              </div>
              
              <div className="table-row">
                <div data-label="Sorgu Konusu">Araç Kaydı</div>
                <div data-label="Sonuç">
                  <select
                    name="aracKaydi"
                    value={formData.aracKaydi}
                    onChange={handleInputChange}
                  >
                    <option value="yok">Yok</option>
                    <option value="var">Var</option>
                  </select>
                </div>
                <div data-label="Haciz Uygulama Bilgisi">
                  <textarea
                    name="aracHaciz"
                    value={formData.aracHaciz}
                    onChange={handleInputChange}
                    rows="2"
                  />
                </div>
                <div data-label="Haczimizden Önce Konulmuş Hacizler/Rehinler">
                  <textarea
                    name="aracOncekiHaciz"
                    value={formData.aracOncekiHaciz}
                    onChange={handleInputChange}
                    rows="2"
                  />
                </div>
              </div>
              
              <div className="table-row">
                <div data-label="Sorgu Konusu">Alacaklı Olduğu İcra Takip Dosyaları</div>
                <div data-label="Sonuç">
                  <select
                    name="alacakliTakip"
                    value={formData.alacakliTakip}
                    onChange={handleInputChange}
                  >
                    <option value="yok">Yok</option>
                    <option value="var">Var</option>
                  </select>
                </div>
                <div data-label="Haciz Uygulama Bilgisi">
                  <textarea
                    name="alacakliHaciz"
                    value={formData.alacakliHaciz}
                    onChange={handleInputChange}
                    rows="2"
                  />
                </div>
                <div data-label="Haczimizden Önce Konulmuş Hacizler/Rehinler">
                  <textarea
                    name="alacakliOncekiHaciz"
                    value={formData.alacakliOncekiHaciz}
                    onChange={handleInputChange}
                    rows="2"
                  />
                </div>
              </div>
              
              <div className="table-row">
                <div data-label="Sorgu Konusu">SGK Tescil / Hizmet Kaydı</div>
                <div data-label="Sonuç">
                  <select
                    name="sgkKaydi"
                    value={formData.sgkKaydi}
                    onChange={handleInputChange}
                  >
                    <option value="yok">Yok</option>
                    <option value="var">Var</option>
                  </select>
                </div>
                <div data-label="Haciz Uygulama Bilgisi">
                  <textarea
                    name="sgkHaciz"
                    value={formData.sgkHaciz}
                    onChange={handleInputChange}
                    rows="2"
                    placeholder="Maaş haczi imkanı"
                  />
                </div>
                <div data-label="Haczimizden Önce Konulmuş Hacizler/Rehinler">
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
                <div data-label="İşlem Türü">Adres Tespiti</div>
                <div data-label="Süreç/Aşamalar">Resmi Adres</div>
                <div data-label="İşlem Durumu">
                  <input
                    type="text"
                    name="resmiAdresDurum"
                    value={formData.resmiAdresDurum}
                    onChange={handleInputChange}
                  />
                </div>
                <div data-label="Açıklama / Not">
                  <textarea
                    name="resmiAdresNot"
                    value={formData.resmiAdresNot}
                    onChange={handleInputChange}
                    rows="2"
                  />
                </div>
              </div>
              
              <div className="table-row">
                <div data-label="İşlem Türü">Adres Tespiti</div>
                <div data-label="Süreç/Aşamalar">Sanal Ofis Durumu</div>
                <div data-label="İşlem Durumu">
                  <input
                    type="text"
                    name="sanalOfisDurum"
                    value={formData.sanalOfisDurum}
                    onChange={handleInputChange}
                  />
                </div>
                <div data-label="Açıklama / Not">
                  <textarea
                    name="sanalOfisNot"
                    value={formData.sanalOfisNot}
                    onChange={handleInputChange}
                    rows="2"
                  />
                </div>
              </div>
              
              <div className="table-row">
                <div data-label="İşlem Türü">Adres Tespiti</div>
                <div data-label="Süreç/Aşamalar">Alternatif/ Şube vs. Adresleri</div>
                <div data-label="İşlem Durumu">
                  <input
                    type="text"
                    name="alternatifAdresDurum"
                    value={formData.alternatifAdresDurum}
                    onChange={handleInputChange}
                  />
                </div>
                <div data-label="Açıklama / Not">
                  <textarea
                    name="alternatifAdresNot"
                    value={formData.alternatifAdresNot}
                    onChange={handleInputChange}
                    rows="2"
                  />
                </div>
              </div>
              
              <div className="table-row">
                <div data-label="İşlem Türü">Haciz Süreci</div>
                <div data-label="Süreç/Aşamalar">Fiili Haciz Talep Yazısının Hazırlanması</div>
                <div data-label="İşlem Durumu">
                  <input
                    type="text"
                    name="talepYazisiDurum"
                    value={formData.talepYazisiDurum}
                    onChange={handleInputChange}
                  />
                </div>
                <div data-label="Açıklama / Not">
                  <textarea
                    name="talepYazisiNot"
                    value={formData.talepYazisiNot}
                    onChange={handleInputChange}
                    rows="2"
                  />
                </div>
              </div>
              
              <div className="table-row">
                <div data-label="İşlem Türü">Haciz Süreci</div>
                <div data-label="Süreç/Aşamalar">İcra Müdürlüğünün Talep Üzerine Verdiği Karar</div>
                <div data-label="İşlem Durumu">
                  <input
                    type="text"
                    name="icraKarariDurum"
                    value={formData.icraKarariDurum}
                    onChange={handleInputChange}
                  />
                </div>
                <div data-label="Açıklama / Not">
                  <textarea
                    name="icraKarariNot"
                    value={formData.icraKarariNot}
                    onChange={handleInputChange}
                    rows="2"
                  />
                </div>
              </div>
              
              <div className="table-row">
                <div data-label="İşlem Türü">Haciz Süreci</div>
                <div data-label="Süreç/Aşamalar">Tespit Edilen Adreslere Gidilmesi</div>
                <div data-label="İşlem Durumu">
                  <input
                    type="text"
                    name="adresZiyaretiDurum"
                    value={formData.adresZiyaretiDurum}
                    onChange={handleInputChange}
                  />
                </div>
                <div data-label="Açıklama / Not">
                  <textarea
                    name="adresZiyaretiNot"
                    value={formData.adresZiyaretiNot}
                    onChange={handleInputChange}
                    rows="2"
                  />
                </div>
              </div>
              
              <div className="table-row">
                <div data-label="İşlem Türü">Haciz Süreci</div>
                <div data-label="Süreç/Aşamalar">Haciz Tutanağı Düzenlenmesi</div>
                <div data-label="İşlem Durumu">
                  <input
                    type="text"
                    name="hacizTutanagiDurum"
                    value={formData.hacizTutanagiDurum}
                    onChange={handleInputChange}
                  />
                </div>
                <div data-label="Açıklama / Not">
                  <textarea
                    name="hacizTutanagiNot"
                    value={formData.hacizTutanagiNot}
                    onChange={handleInputChange}
                    rows="2"
                  />
                </div>
              </div>
              
              <div className="table-row">
                <div data-label="İşlem Türü">Haczedilen Taşınırların Satış Değerlendirmesi</div>
                <div data-label="Süreç/Aşamalar">Borcun ne kadarını karşıladığı ve satış kabiliyeti</div>
                <div data-label="İşlem Durumu">
                  <input
                    type="text"
                    name="satisNotiDurum"
                    value={formData.satisNotiDurum}
                    onChange={handleInputChange}
                  />
                </div>
                <div data-label="Açıklama / Not">
                  <textarea
                    name="satisNotiNot"
                    value={formData.satisNotiNot}
                    onChange={handleInputChange}
                    rows="2"
                  />
                </div>
              </div>
              
              <div className="table-row">
                <div data-label="İşlem Türü">Genel Hukuki Değerlendirme</div>
                <div data-label="Süreç/Aşamalar"></div>
                <div data-label="İşlem Durumu"></div>
                <div data-label="Açıklama / Not">
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
                <div data-label="İşlem ve Açıklama">Bankalara Haciz Müzekkeresi Gönderilmesi Talebi</div>
                <div data-label="Durum">
                  <input
                    type="text"
                    name="bankaMuzekkereDurum"
                    value={formData.bankaMuzekkereDurum}
                    onChange={handleInputChange}
                  />
                </div>
                <div data-label="Not">
                  <textarea
                    name="bankaMuzekkereNot"
                    value={formData.bankaMuzekkereNot}
                    onChange={handleInputChange}
                    rows="2"
                  />
                </div>
              </div>
              
              <div className="table-row">
                <div data-label="İşlem ve Açıklama">İcra Daireleri tarafından Bankalara Müzekkere Gönderilmesi</div>
                <div data-label="Durum">
                  <input
                    type="text"
                    name="icraGonderimDurum"
                    value={formData.icraGonderimDurum}
                    onChange={handleInputChange}
                  />
                </div>
                <div data-label="Not">
                  <textarea
                    name="icraGonderimNot"
                    value={formData.icraGonderimNot}
                    onChange={handleInputChange}
                    rows="2"
                  />
                </div>
              </div>
              
              <div className="table-row">
                <div data-label="İşlem ve Açıklama">Bankalardan Gelen Geri Bildirimler</div>
                <div data-label="Durum">
                  <input
                    type="text"
                    name="bankaGeriDonuşDurum"
                    value={formData.bankaGeriDonuşDurum}
                    onChange={handleInputChange}
                  />
                </div>
                <div data-label="Not">
                  <textarea
                    name="bankaGeriDonuşNot"
                    value={formData.bankaGeriDonuşNot}
                    onChange={handleInputChange}
                    rows="2"
                  />
                </div>
              </div>
              
              <div className="table-row">
                <div data-label="İşlem ve Açıklama">Para tespit edilen bankalar ve Hesap Üzerine konulan Blokeler</div>
                <div data-label="Durum">
                  <input
                    type="text"
                    name="paraBlokedurum"
                    value={formData.paraBlokedurum}
                    onChange={handleInputChange}
                  />
                </div>
                <div data-label="Not">
                  <textarea
                    name="paraBokeNot"
                    value={formData.paraBokeNot}
                    onChange={handleInputChange}
                    rows="2"
                  />
                </div>
              </div>
              
              <div className="table-row">
                <div data-label="İşlem ve Açıklama">Genel Hukuki Değerlendirme</div>
                <div data-label="Durum"></div>
                <div data-label="Not">
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
                <div data-label="Değerlendirme Alanı">Tebligat Süreçleri</div>
                <div data-label="Sonuç / Açıklama">
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
                <div data-label="Değerlendirme Alanı">Taşınmaz ve Araç Varlığı</div>
                <div data-label="Sonuç / Açıklama">
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
                <div data-label="Değerlendirme Alanı">SGK ve Gelir Durumu</div>
                <div data-label="Sonuç / Açıklama">
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
                <div data-label="Değerlendirme Alanı">Fiili Haciz İmkanı</div>
                <div data-label="Sonuç / Açıklama">
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
                <div data-label="Değerlendirme Alanı">Fiili Haciz Uygulaması</div>
                <div data-label="Sonuç / Açıklama">
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
                <div data-label="Değerlendirme Alanı">Banka Varlıkları</div>
                <div data-label="Sonuç / Açıklama">
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
                <div data-label="Değerlendirme Alanı">Genel Tahsil Kabiliyeti</div>
                <div data-label="Sonuç / Açıklama">
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
