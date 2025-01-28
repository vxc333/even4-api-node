import axios from 'axios';
import { Local } from '../interfaces';

// Interface para a resposta do Nominatim
interface NominatimResponse {
  lat: string;
  lon: string;
  display_name: string;
  // ... outros campos que podem ser necessários
}

export class LocalService {
  async getGeocode(endereco: string): Promise<{latitude: number, longitude: number}> {
    try {
      const response = await axios.get<NominatimResponse[]>(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}`
      );

      if (!response.data || response.data.length === 0) {
        throw new Error('Endereço não encontrado');
      }

      return {
        latitude: Number(response.data[0].lat),
        longitude: Number(response.data[0].lon)
      };
    } catch (error) {
      throw new Error('Erro ao buscar coordenadas do endereço');
    }
  }

  async criarLocal(endereco: string): Promise<Local> {
    const coordenadas = await this.getGeocode(endereco);
    // Criar local no banco com as coordenadas
    return { endereco, ...coordenadas };
  }
} 