import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Printer, AlertCircle } from 'lucide-react';
import { LegalWizard } from '../components/legal/LegalWizard';
import { LegislationLibrary } from '../components/legal/LegislationLibrary';
import { InteractiveLawReader } from '../components/legal/InteractiveLawReader';
import { Municipality } from '../data/municipalities';
import { UrbanOperationType } from '../data/legal_framework';
import PageHeader from '../components/common/PageHeader';
import { useLanguage } from '../context/LanguageContext';

const LegalReportPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'generator' | 'library'>('generator');
    const [selectedMunicipality, setSelectedMunicipality] = useState<Municipality | null>(null);
    const [selectedOperation, setSelectedOperation] = useState<UrbanOperationType | null>(null);
    const [projectData, setProjectData] = useState({
        name: '',
        location: '',
        description: ''
    });

    // Global Law Viewer State
    const [viewerOpen, setViewerOpen] = useState(false);
    const [selectedLawId, setSelectedLawId] = useState<string | null>(null);
    const [initialArticle, setInitialArticle] = useState<string | undefined>(undefined);
    const { t } = useLanguage();

    const openInternalLaw = (lawId: string, articleId?: string) => {
        setSelectedLawId(lawId);
        setInitialArticle(articleId);
        setViewerOpen(true);
    };

    const reportRef = useRef<HTMLDivElement>(null);

    // Note: Since 'useReactToPrint' might not be installed or types might be missing in this environment,
    // we will use a simpler window.print() approach for now or mock the hook if needed.
    // Ideally we would install 'react-to-print'.
    // For this MVP, we will assume standard browser print styles or a simple print function.

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-16 animate-in fade-in duration-1000 pb-32">
            {/* Header */}
            {/* Header */}
            <PageHeader 
                kicker={t('legal_kicker')}
                title={<>{t('legal_title_prefix')} <span className="text-luxury-gold">{t('legal_title_suffix')}</span></>}
            />

            <div className="flex bg-white/5 p-1.5 rounded-full border border-white/10 backdrop-blur-xl w-fit mb-8">
                <button
                    onClick={() => setActiveTab('generator')}
                    className={`px-10 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'generator' ? 'bg-luxury-gold text-black shadow-xl shadow-luxury-gold/20' : 'text-white/40 hover:text-white'}`}
                >
                    {t('legal_tab_generator')}
                </button>
                <button
                    onClick={() => setActiveTab('library')}
                    className={`px-10 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'library' ? 'bg-luxury-gold text-black shadow-xl shadow-luxury-gold/20' : 'text-white/40 hover:text-white'}`}
                >
                    {t('legal_tab_collection')}
                </button>
            </div>

            {activeTab === 'library' ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <LegislationLibrary />
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <LegalWizard />
                </motion.div>
            )}

            {/* Global Interactive Law Reader Overlay */}
            {viewerOpen && selectedLawId && (
                <div className="fixed inset-0 z-[1000] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 lg:p-8 animate-in fade-in duration-300">
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="w-full max-w-6xl shadow-strong relative"
                    >
                        <InteractiveLawReader
                            onClose={() => setViewerOpen(false)}
                            lawId={selectedLawId}
                            initialArticleId={initialArticle}
                        />
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default LegalReportPage;

