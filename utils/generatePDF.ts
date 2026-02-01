import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function generatePDF() {
  const proposalElement = document.querySelector('.proposal-to-print') as HTMLElement;
  
  if (!proposalElement) {
    alert('Proposta não encontrada. Por favor, gere a proposta primeiro.');
    return;
  }

  try {
    // Show loading
    const loadingDiv = document.createElement('div');
    loadingDiv.innerHTML = 'Gerando PDF... Por favor aguarde.';
    loadingDiv.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;padding:20px;border-radius:8px;box-shadow:0 4px 6px rgba(0,0,0,0.1);z-index:9999;';
    document.body.appendChild(loadingDiv);

    // Capture element as canvas with white background
    const canvas = await html2canvas(proposalElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    // Create PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
    // Save PDF
    pdf.save('Proposta-Ferreira-Arquitetos.pdf');

    // Remove loading
    document.body.removeChild(loadingDiv);
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    alert('Erro ao gerar PDF. Por favor, tente novamente.');
  }
}
