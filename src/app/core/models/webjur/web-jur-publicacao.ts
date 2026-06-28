export interface WebJurPublicacao {
  id:string;
  codPublicacao: number;
  numeroProcesso: string;
  dataPublicacao: string;
  dataCadastroWebJur?: string;
  despachoPublicacao: string;
  processoPublicacao?: string;
  varaDescricao?: string;
  orgaoDescricao?: string;
  publicacaoCorrigida: boolean;
}