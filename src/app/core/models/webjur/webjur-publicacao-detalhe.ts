export interface WebJurPublicacaoDetalhe {

  id: string;

  codPublicacao: number;

  numeroProcesso: string;

  tipoPublicacao: string;

  varaDescricao: string;

  orgaoDescricao: string;

  dataPublicacao: Date;

  dataCadastroWebJur: Date;

  dataDivulgacao?: Date;

  textoPublicacao: string;

  publicacaoCorrigida: boolean;

  importada: boolean;

  processoId?: string;

  // =========================
  // Dados adicionais do WebJur
  // =========================

  anoPublicacao: number;

  edicaoDiario: number;

  descricaoDiario?: string;

  paginaInicial: number;

  paginaFinal: number;

  ufPublicacao?: string;

  cidadePublicacao?: string;

  codVinculo: number;

  nomeVinculo?: string;

  oabNumero: number;

  oabEstado?: string;

  codIntegracao?: string;

  publicacaoExportada: boolean;

  codGrupo: number;

  // =========================
  // Relacionamentos
  // =========================

  processoInterno: ProcessoInterno | null;

  comentarios: WebJurComentario[];

  movimentacoes: WebJurMovimentacao[];

  arquivos: WebJurArquivo[];

  visualizacoes: WebJurVisualizacao[];

  sincronizacoes: WebJurSincronizacao[];
}

export interface ProcessoInterno {

  processoId: string;

  numeroInterno: string;

  cliente: string;

  advogadoResponsavel: string;

  proximaAudiencia: Date | null;

  status: string;
}

export interface WebJurComentario {

  id: string;

  usuario: string;

  comentario: string;

  dataCadastro: Date;
}

export interface WebJurMovimentacao {

  id: string;

  dataMovimentacao: Date;

  tipo: string;

  descricao: string;

  origem: string;
}

export interface WebJurArquivo {

  id: string;

  nomeArquivo: string;

  tipoArquivo: string;

  caminhoArquivo: string;
}

export interface WebJurVisualizacao {

  id: string;

  usuario: string;

  dataVisualizacao: Date;
}

export interface WebJurSincronizacao {

  id: string;

  inicio: Date;

  fim: Date;

  sucesso: boolean;

  mensagem: string;
}