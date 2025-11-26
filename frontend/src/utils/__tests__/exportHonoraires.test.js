import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportHonorairesExcel, exportHonorairesPDF, exportMissionsExcel, exportMissionsPDF } from '../exportHonoraires';

// Mock jsPDF
vi.mock('jspdf', () => {
  const mockDoc = {
    setFontSize: vi.fn(),
    setTextColor: vi.fn(),
    text: vi.fn(),
    addPage: vi.fn(),
    save: vi.fn(),
    autoTable: vi.fn(),
    splitTextToSize: vi.fn((text) => [text]),
    lastAutoTable: { finalY: 100 },
    internal: { pages: { length: 1 } }
  };
  return {
    default: vi.fn(() => mockDoc)
  };
});

// Mock window.showToast
global.window.showToast = vi.fn();

// Mock URL.createObjectURL et document.createElement
global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
global.URL.revokeObjectURL = vi.fn();
global.document.createElement = vi.fn(() => ({
  href: '',
  download: '',
  click: vi.fn()
}));
global.document.body.appendChild = vi.fn();
global.document.body.removeChild = vi.fn();

describe('exportHonoraires', () => {
  const mockHonorairesData = {
    montantTravaux: 500000,
    evolutions: [
      { id: 'base', nom: 'Base', pourcentages: { 'ESQ': 3, 'APS': 5 } }
    ],
    missions: [
      { id: 'ESQ', nom: 'Esquisse' },
      { id: 'APS', nom: 'APS' }
    ],
    partenaires: [
      { nom: 'Architecte', coutHoraire: 85, heuresEstimees: 200 }
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('exportHonorairesExcel crée un fichier Excel', () => {
    exportHonorairesExcel(mockHonorairesData);
    
    expect(global.document.createElement).toHaveBeenCalledWith('a');
  });

  it('exportHonorairesPDF crée un fichier PDF', () => {
    exportHonorairesPDF(mockHonorairesData);
    
    expect(global.document.createElement).toHaveBeenCalledWith('a');
  });

  it('exportMissionsExcel exporte les missions', () => {
    const missions = [
      { numero: 'M001', client: { nom: 'Client Test' }, montantTravauxHT: 100000 }
    ];
    
    exportMissionsExcel(missions);
    
    expect(global.document.createElement).toHaveBeenCalledWith('a');
  });

  it('exportMissionsPDF exporte les missions en PDF', () => {
    const missions = [
      { numero: 'M001', client: { nom: 'Client Test' } }
    ];
    
    exportMissionsPDF(missions);
    
    expect(global.document.createElement).toHaveBeenCalledWith('a');
  });
});

