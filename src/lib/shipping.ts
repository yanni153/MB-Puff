export interface ShippingRates {
  zone: number;
  home: number;
  desk: number;
  delay: number;
}

export function getShippingRates(wilayaString: string): ShippingRates | null {
  if (!wilayaString) return null;
  
  // Parse the number prefix, e.g. "16. Alger" -> 16
  const match = wilayaString.match(/^(\d+)/);
  if (!match) return null;
  const num = parseInt(match[1], 10);
  
  switch (num) {
    // Zone 0
    case 7: // Biskra
      return { zone: 0, home: 590, desk: 450, delay: 1 };
      
    // Zone 1
    case 5: // Batna
    case 28: // M'Sila
    case 40: // Khenchela
    case 51: // Ouled Djellal
      return { zone: 1, home: 700, desk: 550, delay: 1 };
      
    // Zone 2
    case 4: // Oum El Bouaghi
    case 6: // Béjaïa
    case 9: // Blida
    case 10: // Bouira
    case 12: // Tébessa
    case 15: // Tizi Ouzou
    case 16: // Alger
    case 17: // Djelfa
    case 19: // Sétif
    case 21: // Skikda
    case 23: // Annaba
    case 25: // Constantine
    case 26: // Médéa
    case 34: // Bordj Bou Arréridj
    case 35: // Boumerdès
    case 36: // El Tarf
    case 39: // El Oued
    case 41: // Souk Ahras
    case 42: // Tipaza
    case 49: // El M'Ghair
      const delay2List = [6, 9, 10, 15, 17, 26, 35, 42];
      return { 
        zone: 2, 
        home: 900, 
        desk: 650, 
        delay: delay2List.includes(num) ? 2 : 1 
      };
      
    // Zone 3
    case 1: // Adrar
    case 2: // Chlef
    case 3: // Laghouat
    case 8: // Béchar
    case 13: // Tlemcen
    case 14: // Tiaret
    case 18: // Jijel
    case 20: // Saïda
    case 22: // Sidi Bel Abbès
    case 24: // Guelma
    case 27: // Mostaganem
    case 29: // Mascara
    case 30: // Ouargla
    case 31: // Oran
    case 38: // Tissemsilt
    case 43: // Mila
    case 44: // Aïn Defla
    case 46: // Aïn Témouchent
    case 47: // Ghardaïa
    case 48: // Relizane
    case 50: // El Meniaa
    case 52: // Bordj Baji Mokhtar
    case 53: // Béni Abbès
    case 54: // Timimoun
    case 55: // Touggourt
      let delay = 2;
      if ([1, 52, 54].includes(num)) delay = 5;
      else if ([8, 53].includes(num)) delay = 4;
      else if ([3, 30, 47, 50, 55].includes(num)) delay = 3;
      else if ([18, 24, 43].includes(num)) delay = 1;
      return { zone: 3, home: 950, desk: 750, delay };
      
    // Zone 4
    case 11: // Tamanrasset
    case 32: // El Bayadh
    case 45: // Naâma
    case 57: // In Salah
    case 58: // In Guezzam
      return { 
        zone: 4, 
        home: 1050, 
        desk: 850, 
        delay: [11, 57, 58].includes(num) ? 5 : 3 
      };
      
    // Zone 5
    case 33: // Illizi
    case 37: // Tindouf
    case 56: // Djanet
      return { 
        zone: 5, 
        home: 1600, 
        desk: 1400, 
        delay: num === 37 ? 5 : 6 
      };
      
    default:
      return null;
  }
}
