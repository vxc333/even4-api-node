import { Request, Response } from 'express';
import { UsuarioService } from '../services/UsuarioService';

export class UsuarioController {
  private service: UsuarioService;

  constructor() {
    this.service = new UsuarioService();
    // Vinculando os métodos ao this da classe
    this.criar = this.criar.bind(this);
    this.buscarPorId = this.buscarPorId.bind(this);
    this.login = this.login.bind(this);
    this.atualizar = this.atualizar.bind(this);
    this.atualizarParcial = this.atualizarParcial.bind(this);
    this.deletar = this.deletar.bind(this);
  }

  async criar(req: Request, res: Response): Promise<Response> {
    try {
      const usuario = await this.service.criarUsuario(req.body);
      return res.status(201).json(usuario);
    } catch (error) {
      return res.status(400).json({ 
        erro: error instanceof Error ? error.message : 'Erro ao criar usuário' 
      });
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, senha } = req.body;
      const resultado = await this.service.login(email, senha);
      return res.json(resultado);
    } catch (error) {
      return res.status(401).json({ 
        erro: error instanceof Error ? error.message : 'Erro ao realizar login' 
      });
    }
  }

  async buscarPorId(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const usuario = await this.service.buscarPorId(Number(id));
      
      if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
      }

      return res.json(usuario);
    } catch (error) {
      return res.status(400).json({ 
        erro: error instanceof Error ? error.message : 'Erro ao buscar usuário' 
      });
    }
  }

  async atualizar(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      if (Number(id) !== req.userId) {
        return res.status(403).json({ erro: 'Não autorizado a atualizar este usuário' });
      }

      const usuario = await this.service.atualizarUsuario(Number(id), req.body);
      return res.json(usuario);
    } catch (error) {
      return res.status(400).json({ 
        erro: error instanceof Error ? error.message : 'Erro ao atualizar usuário' 
      });
    }
  }

  async atualizarParcial(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      if (Number(id) !== req.userId) {
        return res.status(403).json({ erro: 'Não autorizado a atualizar este usuário' });
      }

      const usuario = await this.service.atualizarUsuarioParcial(Number(id), req.body);
      return res.json(usuario);
    } catch (error) {
      return res.status(400).json({ 
        erro: error instanceof Error ? error.message : 'Erro ao atualizar usuário' 
      });
    }
  }

  async deletar(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      // Verifica se o usuário está tentando deletar sua própria conta
      if (Number(id) !== req.userId) {
        return res.status(403).json({ erro: 'Não autorizado a deletar este usuário' });
      }

      await this.service.deletarUsuario(Number(id));
      return res.json({ mensagem: 'Usuário deletado com sucesso' });
    } catch (error) {
      return res.status(400).json({ 
        erro: error instanceof Error ? error.message : 'Erro ao deletar usuário' 
      });
    }
  }
} 