export interface ContaReceberConsultaResponse {
  id: string;
  cliente: string;
  descricao: string;
  numeroContrato: string;
  valorTotal: number;
  parcelado: boolean;
  totalParcelas: number;
  formaRecebimento: number;
  status: number;
  statusDescricao: string;
}