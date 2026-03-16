export function downloadPDF(elementId: string, filename: string) {
  const element = document.getElementById(elementId)
  if (!element) {
    console.error('[v0] PDF element not found:', elementId)
    return
  }

  // Clone and clean the content - remove images to avoid print issues
  const clone = element.cloneNode(true) as HTMLElement
  
  // Remove all images from the clone
  const images = clone.querySelectorAll('img')
  images.forEach(img => img.remove())
  
  // Create print window with simple styling
  const printWindow = window.open('', '_blank', 'width=400,height=600')
  if (!printWindow) {
    alert('يرجى السماح بالنوافذ المنبثقة لطباعة الفاتورة')
    return
  }

  const styles = `
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
        direction: rtl;
        text-align: right;
        padding: 20px;
        font-size: 14px;
        line-height: 1.6;
      }
      .hidden, .print\\:hidden { display: none !important; }
      .print\\:block { display: block !important; }
      .border { border: 1px solid #ddd; }
      .border-b { border-bottom: 1px solid #ddd; }
      .border-t { border-top: 1px solid #ddd; }
      .rounded-lg { border-radius: 8px; }
      .p-2, .p-3 { padding: 8px 12px; }
      .py-2 { padding-top: 8px; padding-bottom: 8px; }
      .mb-2, .mb-3 { margin-bottom: 10px; }
      .mt-2 { margin-top: 8px; }
      .space-y-2 > * + * { margin-top: 8px; }
      .space-y-3 > * + * { margin-top: 12px; }
      .grid { display: grid; gap: 8px; }
      .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
      .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
      .col-span-2 { grid-column: span 2; }
      .flex { display: flex; }
      .flex-wrap { flex-wrap: wrap; }
      .justify-between { justify-content: space-between; }
      .items-center { align-items: center; }
      .gap-1 { gap: 4px; }
      .gap-2 { gap: 8px; }
      .text-center { text-align: center; }
      .text-xs { font-size: 11px; }
      .text-sm { font-size: 13px; }
      .text-base { font-size: 14px; }
      .font-bold { font-weight: bold; }
      .font-medium { font-weight: 500; }
      .bg-secondary, .bg-secondary\\/50, .bg-secondary\\/30, .bg-secondary\\/40, .bg-secondary\\/20 { background: #f5f5f5; }
      .bg-primary\\/10 { background: #e8f0fe; }
      .text-muted-foreground { color: #666; }
      .text-primary { color: #1a73e8; }
      .text-destructive { color: #d32f2f; }
      .rounded { border-radius: 4px; }
      .rounded-full { border-radius: 999px; }
      .px-2 { padding-left: 8px; padding-right: 8px; }
      .px-3 { padding-left: 12px; padding-right: 12px; }
      .py-0\\.5 { padding-top: 2px; padding-bottom: 2px; }
      .py-1 { padding-top: 4px; padding-bottom: 4px; }
      h1, h2, h3 { margin-bottom: 8px; }
      @media print {
        body { padding: 10px; }
      }
    </style>
  `

  printWindow.document.write(`
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${filename}</title>
      ${styles}
    </head>
    <body>
      ${clone.innerHTML}
    </body>
    </html>
  `)
  
  printWindow.document.close()
  
  // Wait for content to load then print
  setTimeout(() => {
    printWindow.print()
  }, 300)
}
