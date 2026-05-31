export interface CentroCustoResponse {
  id: string;
  nome: string;
  descricao?: string;
  ativo: boolean;
}

export interface CentroCustoRequest {
  nome: string;
  descricao?: string;
}