
import React from 'react';
import { Hammer, Home, ArrowUpRight, Trash2, Repeat, Grid, ShieldCheck } from 'lucide-react';
import { UrbanOperationType, legalFrameworks } from '../../data/legal_framework';

interface OperationTypeSelectorProps {
    selectedType: UrbanOperationType | null;
    onSelect: (type: UrbanOperationType) => void;
}

const icons: Record<UrbanOperationType, React.ElementType> = {
    [UrbanOperationType.Construction]: Home,
    [UrbanOperationType.Rehabilitation]: Hammer,
    [UrbanOperationType.Expansion]: ArrowUpRight,
    [UrbanOperationType.Demolition]: Trash2,
    [UrbanOperationType.UseChange]: Repeat,
    [UrbanOperationType.Allotment]: Grid,
    [UrbanOperationType.Simple]: ShieldCheck
};

export const OperationTypeSelector: React.FC<OperationTypeSelectorProps> = ({ selectedType, onSelect }) => {
    return (
        <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Tipo de Operacao UrbanA­stica
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.values(legalFrameworks).map((op) => {
                    const Icon = icons[op.id];
                    const isSelected = selectedType === op.id;

                    return (
                        <button
                            key={op.id}
                            onClick={() => onSelect(op.id)}
                            className={`
                                flex flex-col items-center justify-center p-4 rounded-lg border transition-all text-center
                                ${isSelected
                                    ? 'bg-slate-800 border-slate-700 text-white shadow-md'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                }
                            `}
                        >
                            <Icon className={`w-6 h-6 mb-2 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                            <span className="text-sm font-medium">{op.label}</span>
                        </button>
                    );
                })}
            </div>
            {selectedType && (
                <div className="mt-3 text-sm text-gray-500 bg-slate-50 p-3 rounded border border-slate-100 italic">
                    {legalFrameworks[selectedType].description}
                </div>
            )}
        </div>
    );
};

