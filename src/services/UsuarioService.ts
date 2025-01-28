import { Usuario } from '../interfaces';
import { UsuarioRepository } from '../repositories/UsuarioRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta';

export class UsuarioService {
  private repository: UsuarioRepository;

  constructor() {
    this.repository = new UsuarioRepository();
  }

  async criarUsuario(usuario: Usuario): Promise<Usuario> {
    const usuarioExistente = await this.repository.buscarPorEmail(usuario.email);
    if (usuarioExistente) {
      throw new Error('Email já cadastrado');
    }

    const senhaHash = await bcrypt.hash(usuario.senha, 10);
    const novoUsuario = {
      ...usuario,
      senha: senhaHash
    };

    return this.repository.criar(novoUsuario);
  }

  async login(email: string, senha: string): Promise<{ token: string, usuario: Omit<Usuario, 'senha'> }> {
    const usuario = await this.repository.buscarPorEmail(email);
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      throw new Error('Senha inválida');
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    const { senha: _, ...usuarioSemSenha } = usuario;
    return { token, usuario: usuarioSemSenha };
  }

  async buscarPorId(id: number): Promise<Usuario | null> {
    return this.repository.buscarPorId(id);
  }

  async atualizarUsuario(id: number, dados: Usuario): Promise<Usuario> {
    const usuarioExistente = await this.repository.buscarPorId(id);
    if (!usuarioExistente) {
      throw new Error('Usuário não encontrado');
    }

    if (dados.email && dados.email !== usuarioExistente.email) {
      const emailExistente = await this.repository.buscarPorEmail(dados.email);
      if (emailExistente) {
        throw new Error('Email já está em uso');
      }
    }

    if (dados.senha) {
      dados.senha = await bcrypt.hash(dados.senha, 10);
    }

    return this.repository.atualizar(id, dados);
  }

  async atualizarUsuarioParcial(id: number, dados: Partial<Usuario>): Promise<Usuario> {
    const usuarioExistente = await this.repository.buscarPorId(id);
    if (!usuarioExistente) {
      throw new Error('Usuário não encontrado');
    }

    if (dados.email && dados.email !== usuarioExistente.email) {
      const emailExistente = await this.repository.buscarPorEmail(dados.email);
      if (emailExistente) {
        throw new Error('Email já está em uso');
      }
    }

    if (dados.senha) {
      dados.senha = await bcrypt.hash(dados.senha, 10);
    }

    return this.repository.atualizarParcial(id, dados);
  }

  async deletarUsuario(id: number): Promise<void> {
    const usuario = await this.repository.buscarPorId(id);
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    // Primeiro remove todas as participações em eventos
    await this.repository.removerParticipacoes(id);
    
    // Depois remove os eventos criados pelo usuário
    await this.repository.removerEventosCriados(id);
    
    // Por fim, remove o usuário
    await this.repository.deletar(id);
  }
} 