import React from 'react';

interface PrintButtonProps {
  buttonText?: string;
  className?: string;
  children?: React.ReactNode;
}

export const PrintButton: React.FC<PrintButtonProps> = ({ 
  buttonText = "Imprimir / PDF",
  className = "",
  children
}) => {
  const handlePrint = () => {
    // Find the proposal content
    const proposalElement = document.querySelector('.proposal-to-print');
    
    if (!proposalElement) {
      console.error('Proposal element not found');
      alert('Erro: Conteúdo da proposta não encontrado. Por favor, tente novamente.');
      return;
    }

    // Get all page elements - they are direct children of .proposal-to-print
    const pages = Array.from(proposalElement.children).filter(child => 
      child.tagName === 'DIV'
    );
    
    console.log(`Found ${pages.length} pages to print`, pages);

    // Create or get print mount point
    let printMount = document.getElementById('print-mount-point');
    if (!printMount) {
      printMount = document.createElement('div');
      printMount.id = 'print-mount-point';
      document.body.appendChild(printMount);
    }

    // CRITICAL: Set inline styles that will override CSS
    printMount.setAttribute('style', `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 210mm !important;
      height: auto !important;
      overflow: visible !important;
      z-index: 2147483647 !important;
      visibility: visible !important;
      display: block !important;
      background: white !important;
    `);

    // Clear mount point
    printMount.innerHTML = '';

    // Clone each page individually and wrap in page container
    if (pages.length > 0) {
      pages.forEach((page) => {
        const pageClone = page.cloneNode(true) as HTMLElement;
        pageClone.setAttribute('style', `
          visibility: visible !important; 
          display: block !important;
          min-height: 297mm !important;
          page-break-after: always !important;
          break-after: page !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        `);
        printMount!.appendChild(pageClone);
      });
    } else {
      // Fallback: clone entire proposal
      const clone = proposalElement.cloneNode(true) as HTMLElement;
      clone.setAttribute('style', 'visibility: visible !important; display: block !important;');
      printMount.appendChild(clone);
    }

    // Trigger print with delay for images
    setTimeout(() => {
      window.print();
      
      // Cleanup after print dialog closes
      setTimeout(() => {
        if (printMount) {
          printMount.innerHTML = '';
          printMount.setAttribute('style', 'display: none !important;');
        }
      }, 100);
    }, 500);
  };

  return (
    <button onClick={handlePrint} className={className}>
      {children || buttonText}
    </button>
  );
};
