import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta';

interface TokenPayload {
  id: number;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

// Lista de rotas que não precisam validar o ID do usuário
const PUBLIC_USER_ROUTES = [
  '/api/usuarios/todos',
  '/api/usuarios/busca'
];

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    console.log('Path atual:', req.path);
    console.log('É rota pública?', PUBLIC_USER_ROUTES.includes(req.path));

    const authHeader = req.headers.authorization;
    console.log('Auth Header:', authHeader);

    if (!authHeader) {
      return res.status(401).json({ erro: 'Token não fornecido' });
    }

    const [, token] = authHeader.split(' ');
    console.log('Token extraído:', token ? token.substring(0, 20) + '...' : 'null');

    if (!token) {
      return res.status(401).json({ erro: 'Token mal formatado' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    console.log('Token decodificado:', decoded);
    
    // Só valida o ID se não for uma rota pública
    if (!PUBLIC_USER_ROUTES.includes(req.path)) {
      console.log('Validando ID para rota protegida');
      const userId = Number(decoded.id);
      console.log('UserId convertido:', userId, 'Tipo:', typeof userId);
      
      if (!decoded.id || isNaN(userId) || userId <= 0) {
        console.log('ID inválido detectado:', { 
          decodedId: decoded.id, 
          userId, 
          isNaN: isNaN(userId), 
          isZeroOrLess: userId <= 0 
        });
        return res.status(401).json({ erro: 'Token inválido: ID de usuário inválido' });
      }
      req.userId = userId;
      console.log('ID válido atribuído ao request:', req.userId);
    } else {
      console.log('Rota pública, pulando validação de ID');
    }

    return next();
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ erro: 'Token inválido ou expirado' });
    }
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}; 