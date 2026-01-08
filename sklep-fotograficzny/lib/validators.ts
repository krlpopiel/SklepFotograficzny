import { z } from "zod";


export const AparatyMetadaneSchema = z.object({
  nagrywanie_video: z.string().min(1, "Informacja o nagrywaniu jest wymagana"),
  rozdzielczosc: z.string().min(1, "Rozdzielczość jest wymagana"),
  typ_baterii: z.string().min(1, "Typ baterii jest wymagany"),
  typ_matrycy: z.string().min(1, "Typ matrycy jest wymagany"),
  waga: z.string().min(1, "Waga jest wymagana"),
  wymiary: z.string().min(1, "Wymiary są wymagane"),
});


export const FilmyMetadaneSchema = z.object({
  czułość: z.string().min(1, "Czułość jest wymagana"),
  dostępność: z.string().min(1, "Dostępność jest wymagana"),
  format: z.string().min(1, "Format jest wymagany"),
  producent: z.string().min(1, "Producent jest wymagany"),
  typ: z.string().min(1, "Typ filmu jest wymagany"),
  typ_podstawy: z.string().min(1, "Typ podstawy jest wymagany"),
});


export const ObiektywyMetadaneSchema = z.object({
  maksymalna_przyslona: z.string().min(1, "Przysłona jest wymagana"),
  stabilizacja: z.string().min(1, "Informacja o stabilizacji jest wymagana"),
  typ_mocowania: z.string().min(1, "Typ mocowania jest wymagany"),
  waga: z.string().min(1, "Waga jest wymagana"),
  wymiary: z.string().min(1, "Wymiary są wymagane"),
  zakres_ogniskowej: z.string().min(1, "Ogniskowa jest wymagana"),
});


export const ProductSchema = z.object({
  marka: z.string().min(2, "Marka musi mieć co najmniej 2 znaki"),
  model: z.string().min(2, "Model musi mieć co najmniej 2 znaki"),
  
  cena: z.coerce.number().min(0.01, "Cena musi być większa od 0"),
  ilosc_na_magazynie: z.coerce.number().int().min(0, "Ilość nie może być ujemna"),

}).and(
  z.discriminatedUnion("kategoria", [
    z.object({
      kategoria: z.literal("aparaty"),
      metadane: AparatyMetadaneSchema,
    }),
    z.object({
      kategoria: z.literal("filmy"),
      metadane: FilmyMetadaneSchema,
    }),
    z.object({
      kategoria: z.literal("obiektywy"),
      metadane: ObiektywyMetadaneSchema,
    }),
  ])
);

export type ProductFormValues = z.infer<typeof ProductSchema>;