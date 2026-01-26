import React from 'react';
import { Municipality } from '../../data/municipalities';
import { UrbanOperationType, legalFrameworks } from '../../data/legal_framework';
import { legislationDatabase } from '../../data/legislation_database';

interface LegalReportTemplateProps {
    municipality: Municipality;
    operationType: UrbanOperationType | null;
    projectData?: {
        name: string;
        location: string;
        description: string;
    };
    onOpenLaw?: (lawId: string, articleId?: string) => void;
}

export const LegalReportTemplate: React.FC<LegalReportTemplateProps> = ({ municipality, operationType, projectData, onOpenLaw }) => {
    const currentDate = new Date().toLocaleDateString('pt-PT');
    const framework = operationType ? legalFrameworks[operationType] : null;

    return (
        <div id="legal-report-template" className="bg-white text-black p-8 pt-12 max-w-[210mm] mx-auto min-h-[297mm] shadow-lg print:shadow-none print:w-full flex flex-col">
            {/* Header */}
            <div className="border-b-2 border-black pb-4 mb-8 text-center">
                <h1 className="text-2xl font-bold uppercase tracking-wider mb-2">Relatório Técnico de Conformidade Urbanística</h1>
                <div className="text-sm font-light uppercase tracking-widest text-gray-600">Ferreira Arquitetos {new Date().getFullYear()}</div>
            </div>

            {/* Project Info */}
            <div className="mb-8">
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div><strong>PROJECTO:</strong> {projectData?.name || '[Nome do Projecto]'}</div>
                    <div className="text-right"><strong>DATA:</strong> {currentDate}</div>
                    <div><strong>LOCALIZAÇÃO:</strong> {projectData?.location || '[Morada]'}, {municipality.name}</div>
                    <div className="text-right"><strong>REF:</strong> FA-{new Date().getFullYear()}-XXX</div>
                </div>
                <hr className="border-gray-300" />
            </div>

            {/* Section 1: Identification */}
            <div className="mb-8">
                <h2 className="text-lg font-bold border-b-2 border-gray-800 mb-4 pb-1">1. IDENTIFICAÇÃO DO PRÉDIO</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="font-semibold">Município:</span> {municipality.name}</div>
                    <div><span className="font-semibold">Distrito:</span> {municipality.district}</div>
                    <div><span className="font-semibold">Região:</span> {municipality.region}</div>
                </div>
            </div>

            {/* Section 2: PDM */}
            <div className="mb-8">
                <h2 className="text-lg font-bold border-b-2 border-gray-800 mb-4 pb-1">2. ENQUADRAMENTO NOS IGT EM VIGOR</h2>
                <h3 className="font-semibold mb-2">2.1 Plano Director Municipal de {municipality.name}</h3>

                {municipality.pdm_links ? (
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded text-sm mb-6">
                        <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            Fontes Oficiais Verificadas
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {municipality.pdm_links.regulation_pdf && (
                                <a href={municipality.pdm_links.regulation_pdf} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
                                    📄 Regulamento do PDM (PDF)
                                </a>
                            )}
                            {municipality.pdm_links.geoportal && (
                                <a href={municipality.pdm_links.geoportal} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
                                    🌍 Geoportal Municipal (SIG)
                                </a>
                            )}
                            {municipality.pdm_links.landing_page && (
                                <a href={municipality.pdm_links.landing_page} target="_blank" rel="noreferrer" className="col-span-2 text-gray-500 text-xs hover:underline mt-1">
                                    🔗 Página Oficial do Município
                                </a>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-100 p-4 rounded text-sm mb-4">
                        <p className="italic text-gray-600 mb-2">Dados simulados para o MVP (Aguardando verificação oficial):</p>
                        <div className="grid grid-cols-2 gap-2">
                            <div>Estado: <span className="font-medium">Em Vigor</span></div>
                            <div>Publicação: <span className="font-medium">Aviso n.º XXX/XXXX</span></div>
                        </div>
                    </div>
                )}

                <table className="w-full text-sm border-collapse border border-gray-300 mb-4">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 p-2 text-left">Parâmetro Urbanístico (Exemplo)</th>
                            <th className="border border-gray-300 p-2 text-left">Valor Máximo</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 p-2">Índice de Utilização (Iu)</td>
                            <td className="border border-gray-300 p-2">1.2 (Simulado)</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 p-2">Índice de Ocupação (Io)</td>
                            <td className="border border-gray-300 p-2">60% (Simulado)</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 p-2">Cércea Máxima</td>
                            <td className="border border-gray-300 p-2">3 Pisos (Simulado)</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Section 3: Legal Framework */}
            <div className="mb-8">
                <h2 className="text-lg font-bold border-b-2 border-gray-800 mb-4 pb-1">3. ENQUADRAMENTO LEGAL DA OPERAÇÃO</h2>

                {framework ? (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-slate-900 text-white px-3 py-1 text-xs font-bold uppercase rounded">
                                {framework.label}
                            </div>
                            <p className="text-sm text-gray-600">{framework.description}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-sm font-bold text-gray-800 uppercase mb-3 border-b border-gray-200">Legislação Aplicável</h3>
                                <ul className="space-y-6">
                                    {framework.applicable_legislation.map((leg, i) => {
                                        const dbLeg = leg.legislation_id ? legislationDatabase[leg.legislation_id] : null;
                                        return (
                                            <li key={i} className="text-sm">
                                                <div
                                                    className={`group/item p-3 -m-3 rounded-lg transition-colors ${onOpenLaw && leg.legislation_id ? 'cursor-pointer hover:bg-slate-50' : ''}`}
                                                    onClick={() => onOpenLaw && leg.legislation_id && onOpenLaw(leg.legislation_id)}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className={`font-bold ${onOpenLaw && leg.legislation_id ? 'text-gold group-hover/item:underline' : 'text-slate-800'}`}>
                                                            {leg.name}
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            {onOpenLaw && leg.legislation_id && (
                                                                <span className="text-[11px] font-black uppercase tracking-tighter bg-gold/10 text-gold px-1.5 py-0.5 rounded opacity-0 group-hover/item:opacity-100 transition-opacity">
                                                                    Ler no FA-360 ↗
                                                                </span>
                                                            )}
                                                            {dbLeg?.official_link && (
                                                                <a
                                                                    href={dbLeg.official_link}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="text-[10px] text-blue-500 hover:underline"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    DRE 🔗
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-gray-500 mb-2">{leg.description}</div>
                                                </div>

                                                {dbLeg && (
                                                    <div className="pl-3 border-l-2 border-slate-200 mt-3 pt-1">
                                                        <p className="text-[11px] text-gray-600 mb-2 italic leading-relaxed">{dbLeg.summary}</p>
                                                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                                                            {dbLeg.key_points.map((pt, j) => (
                                                                <div key={j} className="text-[10px] text-slate-500 flex items-center gap-1">
                                                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                                    {pt}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-800 uppercase mb-3 border-b border-gray-200">Elementos Obrigatórios</h3>
                                <ul className="grid grid-cols-1 gap-1">
                                    {framework.required_elements.map((el, i) => (
                                        <li key={i} className="text-sm flex items-start gap-2">
                                            <span className="text-gray-400">☐</span>
                                            {el}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-gray-800 uppercase mb-3 border-b border-gray-200">Filtros de Verificação PDM</h3>
                            <div className="flex flex-wrap gap-2">
                                {framework.pdm_focus_areas.map((area, i) => (
                                    <span key={i} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs border border-slate-200">
                                        {area}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 border-2 border-dashed border-gray-200 rounded text-center text-gray-400 text-sm">
                        Selecione um tipo de operação para ver o enquadramento legal automático.
                    </div>
                )}
            </div>

            {/* Section 4: Legal Disclaimers */}
            <div className="mt-auto pt-8 text-[10px] text-gray-500">
                <h2 className="text-xs font-bold border-b border-gray-400 mb-2 pb-1 uppercase tracking-widest italic">Notas Legais</h2>
                <p className="leading-tight">Este relatório tem caráter meramente informativo e foi gerado automaticamente pelo módulo FA-360 Legal da Ferreira Arquitetos. O conteúdo apresentado baseia-se na interpretação técnica da legislação em vigor, mas não dispensa a consulta formal de um arquiteto, a verificação das fontes oficiais (Diário da República, Planos Diretores Municipais) e a confirmação junto das entidades públicas competentes.</p>
            </div>
        </div>
    );
};

