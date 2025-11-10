#!/bin/bash

echo "🚀 Fenomen Projesi Başlatılıyor..."
echo ""

# Renk kodları
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Node.js kontrolü
if ! command -v node &> /dev/null
then
    echo -e "${RED}❌ Node.js bulunamadı!${NC}"
    echo "Lütfen Node.js yükleyin: https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✅ Node.js bulundu: $(node --version)${NC}"

# npm kontrolü
if ! command -v npm &> /dev/null
then
    echo -e "${RED}❌ npm bulunamadı!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm bulundu: $(npm --version)${NC}"
echo ""

# node_modules kontrolü
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Bağımlılıklar yükleniyor...${NC}"
    npm install
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Bağımlılıklar başarıyla yüklendi!${NC}"
    else
        echo -e "${RED}❌ Bağımlılıklar yüklenirken hata oluştu!${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Bağımlılıklar zaten yüklü${NC}"
fi

echo ""

# .env.local kontrolü
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  .env.local dosyası bulunamadı${NC}"
    if [ -f ".env.local.example" ]; then
        echo -e "${YELLOW}📝 .env.local.example kopyalanıyor...${NC}"
        cp .env.local.example .env.local
        echo -e "${GREEN}✅ .env.local oluşturuldu${NC}"
        echo -e "${YELLOW}⚠️  Lütfen .env.local dosyasını düzenleyin ve JWT_SECRET ekleyin${NC}"
    fi
else
    echo -e "${GREEN}✅ .env.local mevcut${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Hazır! Development server başlatılıyor...${NC}"
echo ""

# Development server'ı başlat
npm run dev
