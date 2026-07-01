export interface ProcessoDetalheResponse {
  id: string;
  numeroProcesso: string;
  titulo: string;
  situacao: string;
  vara: string;
  andamentos: any[];
  publicacoesWebJur: any[];
}