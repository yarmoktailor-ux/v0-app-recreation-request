import html2pdf from 'html2pdf.js'

export async function downloadPDF(elementId: string, filename: string) {
  const element = document.getElementById(elementId)
  if (!element) {
    console.error('[v0] PDF element not found:', elementId)
    return
  }

  try {
    const opt = {
      margin: 10,
      filename: `${filename}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    }
    
    // Clone element to avoid modifying original
    const clone = element.cloneNode(true) as HTMLElement
    
    // Fix RTL for PDF
    clone.style.direction = 'rtl'
    clone.style.textAlign = 'right'
    
    await html2pdf().set(opt).from(clone).save()
  } catch (error) {
    console.error('[v0] PDF generation failed:', error)
    // Fallback to print dialog
    window.print()
  }
}
