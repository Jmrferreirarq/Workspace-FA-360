class ExportEngineService {
  private collectStyles() {
    return Array.from(document.styleSheets)
      .map((styleSheet) => {
        try {
          return Array.from(styleSheet.cssRules).map((rule) => rule.cssText).join('');
        } catch {
          return '';
        }
      })
      .join('');
  }

  exportHTMLString(containerId: string, clientName: string) {
    const content = document.getElementById(containerId);
    if (!content) return null;

    const styles = this.collectStyles();

    return `
      <!DOCTYPE html>
      <html lang="pt">
      <head>
        <meta charset="UTF-8">
        <title>Proposta de Honorarios - ${clientName}</title>
        <style>${styles}</style>
        <style>
          body { background: #f4f4f5; display:flex; justify-content:center; padding:40px 0; font-family:sans-serif; }
          #proposal-template { width: 210mm; background:white; }
        </style>
      </head>
      <body>
        ${content.outerHTML}
      </body>
      </html>
    `;
  }

  exportToHTML(containerId: string, clientName: string, filename: string) {
    const html = this.exportHTMLString(containerId, clientName);
    if (!html) return;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const exportEngineService = new ExportEngineService();
