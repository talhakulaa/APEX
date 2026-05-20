# APEX — MyoTrack EMG Performance

APEX, EMG tabanlı kas aktivasyonu takibi ve antrenman analizi için geliştirilmiş modern bir web uygulamasıdır. Uygulama; ağırlık ve kardiyo antrenmanlarında kas aktivasyonunu takip etmeyi, sensör/modül yerleşimini yönetmeyi, canlı EMG verisi izlemeyi ve antrenman sonrası performans analizleri oluşturmayı amaçlar.

## Live Demo

https://apex-pied.vercel.app

## Proje Hakkında

APEX, sporcuların antrenman sırasında kas aktivasyonlarını daha anlaşılır şekilde takip edebilmesi için tasarlanmıştır. Uygulama 4 farklı EMG modülü üzerinden kas aktivasyonu verilerini simüle eder veya takip eder. Kullanıcı seçtiği antrenman türüne ve vücut bölgesine göre modülleri yerleştirir, kalibrasyon sürecini tamamlar ve canlı EMG akışını izleyerek antrenmanını kaydeder.

Bu proje özellikle şu amaçlara odaklanır:

- Kas aktivasyonunu anlık olarak görselleştirmek
- Antrenman yoğunluğunu ve set bilgisini takip etmek
- Bölgesel kas gelişimini analiz etmek
- Kullanıcının geçmiş antrenmanlarını kaydetmek
- Günlük, haftalık ve aylık gelişim grafikleri sunmak

## Özellikler

- Kullanıcı profil sistemi
- Ağırlık ve kardiyo antrenman modu
- Göğüs, sırt, omuz, kol, karın ve bacak bölgesi seçimi
- 4 modüllü EMG sensör yerleşim akışı
- MVC kalibrasyon adımı
- Canlı EMG stream grafiği
- Kas aktivasyonu çizelgesi
- Set sayacı ve süre takibi
- Antrenman sonrası özet ekranı
- Ortalama aktivasyon, zirve aktivasyon ve kalite skoru
- Simetri indeksi ve yorgunluk analizi
- Günlük, haftalık ve aylık gelişim takibi
- Antrenman günlüğü ve not ekleme
- Açık/koyu tema desteği
- Demo mod ile sensörsüz kullanım
- PWA desteği

## Kullanılan Teknolojiler

- React
- TypeScript
- Vite
- Recharts
- Vite PWA
- LocalStorage
- CSS

## Kurulum

Projeyi kendi bilgisayarında çalıştırmak için aşağıdaki adımları takip edebilirsin.

### 1. Repoyu klonla

```bash
git clone https://github.com/talhakulaa/APEX.git
