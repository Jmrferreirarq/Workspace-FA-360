import React, { useState } from 'react';
import { municipalities, Municipality } from '../../data/municipalities';
import { Search, CheckCircle2 } from 'lucide-react';

interface MunicipalitySelectorProps {
    onSelect: (municipality: Municipality) => void;
    selectedMunicipality?: Municipality | null;
}

export const MunicipalitySelector: React.FC<MunicipalitySelectorProps> = ({ onSelect, selectedMunicipality }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const filteredMunicipalities = municipalities.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="relative w-full max-w-md">
            <label className="block text-sm font-medium text-slate-400 mb-2">
                MunicA­pio
            </label>

            <div className="relative">
                <div
                    className="flex items-center w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg cursor-pointer hover:border-gold/50 transition-colors"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <Search className="w-5 h-5 text-slate-400 mr-3" />
                    <input
                        type="text"
                        className="bg-transparent border-none outline-none text-slate-100 w-full placeholder-slate-500 cursor-pointer"
                        placeholder="Pesquisar municA­pio..."
                        value={searchTerm || (selectedMunicipality?.name ?? '')}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setIsOpen(true);
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(true);
                        }}
                    />
                </div>

                {isOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                        {filteredMunicipalities.length > 0 ? (
                            filteredMunicipalities.map((municipality) => (
                                <div
                                    key={municipality.id}
                                    className="px-4 py-3 hover:bg-slate-700 cursor-pointer text-slate-200 transition-colors"
                                    onClick={() => {
                                        onSelect(municipality);
                                        setSearchTerm('');
                                        setIsOpen(false);
                                    }}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="font-medium">{municipality.name}</div>
                                        {municipality.verified && (
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        )}
                                    </div>
                                    <div className="text-xs text-slate-500">{municipality.district} a€¢ {municipality.region}</div>
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-slate-500 text-center">
                                Nenhum municA­pio encontrado
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

