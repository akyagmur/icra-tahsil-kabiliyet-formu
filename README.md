# İcra Dosyası Tahsil Kabiliyeti Değerlendirme Formu

Bu uygulama, icra dosyalarının tahsil kabiliyetinin değerlendirilmesi için kullanılan bir form uygulamasıdır. Kullanıcılar formu doldurarak PDF formatında rapor oluşturabilirler.

## Özellikler

- ✅ Responsive tasarım
- ✅ Modern ve kullanıcı dostu arayüz
- ✅ PDF dışa aktarma özelliği
- ✅ Netlify'a kolay deployment
- ✅ Türkçe karakter desteği

## Teknolojiler

- **React 18** - UI framework
- **Vite** - Build tool ve development server
- **jsPDF** - PDF oluşturma
- **html2canvas** - HTML'den görüntü oluşturma

## Kurulum

1. Proje klasörüne gidin:
```bash
cd icra-formu
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Development server'ı başlatın:
```bash
npm run dev
```

4. Tarayıcınızda `http://localhost:5173` adresini açın.

## Build ve Deploy

### Local Build
```bash
npm run build
```

### Netlify Deployment

1. Netlify hesabınıza giriş yapın
2. "New site from Git" seçeneğini seçin  
3. GitHub repository'sini bağlayın
4. Build ayarları otomatik olarak `netlify.toml` dosyasından okunacaktır
5. Deploy edin

## Form Bölümleri

1. **Genel Bilgiler** - Alacaklı, borçlu ve dosya bilgileri
2. **Borçlu Tebligat Durumu** - Tebligat yöntemleri ve durumları
3. **UYAP Sorguları** - Mal varlığı ve haciz bilgileri  
4. **Fiili Haciz Süreci** - Adres tespiti ve haciz işlemleri
5. **Banka Haciz Süreci** - Banka işlemleri ve geri dönüşler
6. **Tahsil Kabiliyeti Özeti** - Genel değerlendirme ve sonuç

## Kullanım

1. Formu doldurun
2. "PDF İndir" butonuna tıklayın
3. Oluşturulan PDF dosyasını kaydedin

## Lisans

Bu proje açık kaynak kodludur.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
