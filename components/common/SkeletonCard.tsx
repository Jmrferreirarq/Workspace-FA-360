import React from 'react';

interface SkeletonCardProps {
    variant?: 'metric' | 'project' | 'client';
}

export default function SkeletonCard({ variant = 'metric' }: SkeletonCardProps) {
    if (variant === 'metric') {
        return (
            <div className="glass p-8 rounded-[2rem]">
                <div className="h-12 w-12 skeleton rounded-xl mb-6" />
                <div className="h-4 w-1/3 skeleton mb-3" />
                <div className="h-10 w-2/3 skeleton" />
            </div>
        );
    }

    if (variant === 'project') {
        return (
            <div className="glass p-8 rounded-[2rem]">
                <div className="flex items-center gap-2 mb-4">
                    <div className="h-2 w-2 skeleton rounded-full" />
                    <div className="h-3 w-20 skeleton" />
                </div>
                <div className="h-8 w-3/4 skeleton mb-2" />
                <div className="h-4 w-1/2 skeleton mb-6" />
                <div className="h-2 w-full skeleton rounded-full mb-4" />
                <div className="flex justify-between pt-4 border-t border-white/5">
                    <div className="h-3 w-1/4 skeleton" />
                    <div className="h-3 w-1/4 skeleton" />
                </div>
            </div>
        );
    }

    return null;
}

