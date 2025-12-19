//import { PrismaClient } from '@prisma/client';

import { PrismaClient } from "../generated/prisma/client";
import * as dotenv from 'dotenv';
// Wczytujemy .env. Ścieżka '../.env' zakłada, że plik .env jest folder wyżej niż folder prisma/
dotenv.config({ path: '../.env' });


const prisma = new PrismaClient();

async function main() {
  console.log('Rozpoczynam migrację danych...');

  console.log('📦 Pobieranie aparatów...');
  const stareAparaty = await prisma.aparaty.findMany();
  
  if (stareAparaty.length > 0) {
    const noweAparaty = stareAparaty.map((aparat:any) => ({
      kategoria: 'aparaty',
      marka: aparat.marka,
      model: aparat.model,
      cena: aparat.cena,
      ilosc_na_magazynie: aparat.ilosc_na_magazynie,
      metadane: aparat.metadane as object
    }));

    await prisma.produkt.createMany({
      data: noweAparaty,
    });
    console.log(`Przeniesiono ${stareAparaty.length} aparatów.`);
  }

  console.log('Pobieranie filmów...');
  const stareFilmy = await prisma.filmy.findMany();

  if (stareFilmy.length > 0) {
    const noweFilmy = stareFilmy.map((film:any) => {
      const cleanMetadane = {
        czułość: film.metadane.czu_o__,
        dostępność: film.metadane.dost_pno__,
        format: film.metadane.format,
        producent: film.metadane.producent,
        typ: film.metadane.typ,
        typ_podstawy: film.metadane.typ_podstawy,
      };

      return {
        kategoria: 'filmy',
        marka: film.marka,
        model: film.model,
        cena: film.cena,
        ilosc_na_magazynie: film.ilosc_na_magazynie,
        metadane: cleanMetadane,
      };
    });

    await prisma.produkt.createMany({
      data: noweFilmy,
    });
    console.log(`Przeniesiono ${stareFilmy.length} filmów.`);
  }

  console.log('Pobieranie obiektywów...');
  const stareObiektywy = await prisma.obiektywy.findMany();

  if (stareObiektywy.length > 0) {
    const noweObiektywy = stareObiektywy.map((obiektyw:any) => ({
      kategoria: 'obiektywy',
      marka: obiektyw.marka,
      model: obiektyw.model,
      cena: obiektyw.cena,
      ilosc_na_magazynie: obiektyw.ilosc_na_magazynie,
      metadane: obiektyw.metadane as object,
    }));

    await prisma.produkt.createMany({
      data: noweObiektywy,
    });
    console.log(`Przeniesiono ${stareObiektywy.length} obiektywów.`);
  }

  console.log('Migracja zakończona sukcesem!');
}

main()
  .catch((e) => {
    console.error('Błąd podczas migracji:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });