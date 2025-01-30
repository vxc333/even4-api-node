import axios from 'axios';
import { Local } from '../interfaces';
import { LocalRepository } from '../repositories/LocalRepository';

// Interface para a resposta do Nominatim
interface NominatimResponse {
  lat: string;
  lon: string;
  display_name: string;
  // ... outros campos que podem ser necessários
}

export class LocalService {
  private repository: LocalRepository;

  constructor() {
    this.repository = new LocalRepository();
  }

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
    return this.repository.criar({ endereco, ...coordenadas });
  }

  async listarLocais(): Promise<Local[]> {
    return this.repository.listar();
  }

  async buscarPorId(id: number): Promise<Local | null> {
    return this.repository.buscarPorId(id);
  }

  async deletarLocal(id: number): Promise<void> {
    const local = await this.repository.buscarPorId(id);
    if (!local) {
      throw new Error('Local não encontrado');
    }
    await this.repository.deletar(id);
  }
} 