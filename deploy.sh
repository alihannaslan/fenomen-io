#!/bin/bash

echo "🚀 Fenomen - Cloudflare Deploy Script"
echo ""

# Renk kodları
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Wrangler kontrolü
if ! command -v wrangler &> /dev/null
then
    echo -e "${YELLOW}⚠️  Wrangler bulunamadı, yükleniyor...${NC}"
    npm install -g wrangler
fi

echo -e "${GREEN}✅ Wrangler hazır${NC}"
echo ""

# wrangler.toml kontrolü
if [ ! -f "wrangler.toml" ]; then
    echo -e "${RED}❌ wrangler.toml bulunamadı!${NC}"
    exit 1
fi

echo -e "${BLUE}🔍 KV Namespace kontrol ediliyor...${NC}"

# KV ID kontrolü
if grep -q "id = \"your-kv-id-here\"" wrangler.toml; then
    echo -e "${RED}❌ wrangler.toml'da KV namespace ID güncellenmemiş!${NC}"
    echo ""
    echo -e "${YELLOW}Lütfen önce şu adımları takip edin:${NC}"
    echo ""
    echo "1. KV namespace oluşturun:"
    echo -e "   ${BLUE}npx wrangler kv:namespace create USERS_KV${NC}"
    echo -e "   ${BLUE}npx wrangler kv:namespace create USERS_KV --preview${NC}"
    echo ""
    echo "2. Aldığınız ID'leri wrangler.toml dosyasına yapıştırın"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ KV Namespace ID ayarlanmış${NC}"
echo ""

# Build
echo -e "${BLUE}🔨 Build başlatılıyor...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build başarısız!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build tamamlandı${NC}"
echo ""

# Deploy
echo -e "${BLUE}🚀 Cloudflare Pages'e deploy ediliyor...${NC}"
npx wrangler pages deploy .next --project-name fenomen

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 Deploy başarılı!${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  Son adım: Cloudflare Dashboard'da environment variables ekleyin:${NC}"
    echo "   - JWT_SECRET"
    echo "   - USERS_KV"
else
    echo -e "${RED}❌ Deploy başarısız!${NC}"
    exit 1
fi
