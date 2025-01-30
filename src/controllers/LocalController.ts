import { Request, Response } from 'express';
import { LocalService } from '../services/LocalService';

export class LocalController {
  private service: LocalService;

  constructor() {
    this.service = new LocalService();
    this.criar = this.criar.bind(this);
    this.listar = this.listar.bind(this);
    this.buscarPorId = this.buscarPorId.bind(this);
    this.deletar = this.deletar.bind(this);
  }

  async criar(req: Request, res: Response): Promise<Response> {
    try {
      const { endereco } = req.body;
      
      if (!endereco) {
        return res.status(400).json({ erro: 'Endereço é obrigatório' });
      }

      const local = await this.service.criarLocal(endereco);
      return res.status(201).json(local);
    } catch (error) {
      return res.status(400).json({ 
        erro: error instanceof Error ? error.message : 'Erro ao criar local' 
      });
    }
  }

  async listar(_: Request, res: Response): Promise<Response> {
    try {
      const locais = await this.service.listarLocais();
      return res.json(locais);
    } catch (error) {
      return res.status(400).json({ 
        erro: error instanceof Error ? error.message : 'Erro ao listar locais' 
      });
    }
  }

  async buscarPorId(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const local = await this.service.buscarPorId(Number(id));
      
      if (!local) {
        return res.status(404).json({ erro: 'Local não encontrado' });
      }

      return res.json(local);
    } catch (error) {
      return res.status(400).json({ 
        erro: error instanceof Error ? error.message : 'Erro ao buscar local' 
      });
    }
  }

  async deletar(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      await this.service.deletarLocal(Number(id));
      return res.json({ mensagem: 'Local deletado com sucesso' });
    } catch (error) {
      return res.status(400).json({ 
        erro: error instanceof Error ? error.message : 'Erro ao deletar local' 
      });
    }
  }
} 