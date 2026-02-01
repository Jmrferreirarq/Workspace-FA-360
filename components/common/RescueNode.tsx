
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    nodeName?: string;
}

interface State {
    hasError: boolean;
}

export class RescueNode extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false
        };
    }

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error(`[RESCUE_NODE] Erro em ${this.props.nodeName || 'Desconhecido'}:`, error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false });
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-[400px] flex flex-col items-center justify-center p-8 glass rounded-2xl border-red-500/20 bg-red-500/[0.02] text-center space-y-8 animate-in fade-in">
                    <div className="p-6 bg-red-500/10 rounded-full text-red-500 animate-pulse">
                        <ShieldAlert size={48} />
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-3xl font-serif italic text-white">Sistema em Recuperacao</h2>
                        <p className="text-sm font-light opacity-50 max-w-md mx-auto italic">
                            Ocorreu uma falha inesperada no no <b>{this.props.nodeName || 'Global'}</b>.
                            A inteligencia Antigravity esta a isolar o erro para manter a estabilidade do resto do atelier.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={this.handleReset}
                            className="px-8 py-4 bg-red-500 text-white rounded-full text-[11px] font-black uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-red-500/20"
                        >
                            <RefreshCw size={14} /> Reiniciar Node
                        </button>
                        <button
                            onClick={() => window.location.hash = '#/'}
                            className="px-8 py-4 bg-white/5 border border-white/10 rounded-full text-[11px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-white/10 transition-all text-white"
                        >
                            <Home size={14} /> Voltar ao InA­cio
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default RescueNode;

