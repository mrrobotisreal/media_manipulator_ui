// TS mirrors of the AI Document Scan API contract:
// GET  /document-scan/capabilities
// POST /document-scan/start                 (multipart: image_0..n + options JSON)
// GET  /document-scan/:jobId/results
// GET  /document-scan/:jobId/result?format=pdf|docx|summary
// Job progress flows through the shared /job/:jobId machinery (useTranscodeJobStatus).
// This is the document sibling of imageRestoreTypes.ts.

export type DocumentScanContentMode = 'auto' | 'printed' | 'handwriting';
export type DocumentScanOutput = 'pdf' | 'docx';
export type DocumentScanStructureEngine = 'paddleocr-vl' | 'docling';
export type DocumentScanSecondOpinionEngine = 'paddleocr-vl' | 'trocr' | 'none';

export interface DocumentScanCapabilities {
  enabled: boolean;
  printedAvailable: boolean;
  handwritingAvailable: boolean;
  docxAvailable: boolean;
  paddleOcrAvailable: boolean;
  secondOpinionAvailable: boolean;
  precleanAvailable: boolean;
  summaryAvailable: boolean;
  languages: string[];
  maxImages: number;
  maxPages: number;
  maxImageBytes: number;
  unavailable?: string[];
}

// Options sent in the multipart `options` JSON. `order` lists the image field
// names ("image_0" …) in final page order.
export interface DocumentScanOptions {
  outputs: DocumentScanOutput[];
  contentMode: DocumentScanContentMode;
  language: string;
  deskew: boolean;
  rotate: boolean;
  clean: boolean;
  preclean: boolean;
  structureEngine: DocumentScanStructureEngine;
  secondOpinion: boolean;
  secondOpinionEngine: DocumentScanSecondOpinionEngine;
  verify: boolean;
  summarize: boolean;
  order: string[];
  sessionId?: string;
}

export interface DocumentScanStartResponse {
  jobId: string;
}

export interface DocumentScanPage {
  index: number;
  kind: 'printed' | 'handwriting';
  engine: string;
  confidence: string;
  illegibleCount: number;
}

export interface DocumentScanArtifact {
  format: 'pdf' | 'docx' | 'summary-docx';
  fileName: string;
  sizeBytes: number;
  reconstructed: boolean;
  note?: string;
}

export interface DocumentScanResultsResponse {
  jobId: string;
  contentMode: string;
  pageCount: number;
  pages: DocumentScanPage[];
  outputs: DocumentScanArtifact[];
  notes?: string[];
}

export type DocumentScanUploadPhase = 'idle' | 'uploading' | 'starting' | 'processing';
