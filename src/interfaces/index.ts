export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  senha: string;
  telefone: string;
}

export interface Evento {
  id?: number;
  nome: string;
  data: Date;
  hora: string;
  descricao: string;
  criador_id: number;
  local_id: number;
}

export interface Local {
  id?: number;
  latitude: number;
  longitude: number;
  endereco: string;
}

export interface Participante {
  id?: number;
  usuario_id: number;
  evento_id: number;
  status: 'CONFIRMADO' | 'PENDENTE' | 'RECUSADO';
} 