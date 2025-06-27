import jsPDF from "jspdf"
import html2canvas from "html2canvas"

export type TabType = "financial" | "strategy" | "project-performance" | "notetaker"

export const handleExportCurrentTabPDF = async (mainTab: TabType) => {
  try {
    // Create PDF with explicit landscape dimensions (A4 landscape: 297mm x 210mm)
    const pdf = new jsPDF({ 
      unit: "mm", 
      format: [297, 210] // A4 landscape dimensions
    })
    
    // Try to capture the main content area instead of entire body
    const mainContent = document.querySelector('.max-w-7xl') || document.body
    const canvas = await html2canvas(mainContent as HTMLElement, { 
      scale: 1.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    })
    
    const imgData = canvas.toDataURL("image/png")
    
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    
    // Calculate dimensions to fit content properly
    const imgAspectRatio = canvas.width / canvas.height
    const pdfAspectRatio = pdfWidth / pdfHeight
    
    let imgWidth, imgHeight
    
    if (imgAspectRatio > pdfAspectRatio) {
      // Image is wider than PDF, fit to width
      imgWidth = pdfWidth - 10 // Leave 5mm margin on each side
      imgHeight = imgWidth / imgAspectRatio
    } else {
      // Image is taller than PDF, fit to height
      imgHeight = pdfHeight - 10 // Leave 5mm margin on each side
      imgWidth = imgHeight * imgAspectRatio
    }
    
    // Center the image on the page
    const x = (pdfWidth - imgWidth) / 2
    const y = (pdfHeight - imgHeight) / 2
    
    pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight)
    pdf.save(`business-plan-${mainTab}.pdf`)
  } catch (error) {
    console.error("Error exporting PDF:", error)
  }
}

export const handleExportAllTabsPDF = async (allTabs: { key: TabType; label: string }[], setMainTab: (tab: TabType) => void) => {
  try {
    // Create PDF with explicit landscape dimensions (A4 landscape: 297mm x 210mm)
    const pdf = new jsPDF({ 
      unit: "mm", 
      format: [297, 210] // A4 landscape dimensions
    })
    
    for (const tab of allTabs) {
      setMainTab(tab.key)
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Wait longer for tab to render
      
      // Try to capture the main content area instead of entire body
      const mainContent = document.querySelector('.max-w-7xl') || document.body
      const canvas = await html2canvas(mainContent as HTMLElement, { 
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })
      
      const imgData = canvas.toDataURL("image/png")
      
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      
      // Calculate dimensions to fit content properly
      const imgAspectRatio = canvas.width / canvas.height
      const pdfAspectRatio = pdfWidth / pdfHeight
      
      let imgWidth, imgHeight
      
      if (imgAspectRatio > pdfAspectRatio) {
        // Image is wider than PDF, fit to width
        imgWidth = pdfWidth - 10 // Leave 5mm margin on each side
        imgHeight = imgWidth / imgAspectRatio
      } else {
        // Image is taller than PDF, fit to height
        imgHeight = pdfHeight - 10 // Leave 5mm margin on each side
        imgWidth = imgHeight * imgAspectRatio
      }
      
      // Center the image on the page
      const x = (pdfWidth - imgWidth) / 2
      const y = (pdfHeight - imgHeight) / 2
      
      // Add new page for each tab (except the first one)
      if (tab !== allTabs[0]) {
        pdf.addPage()
      }
      
      pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight)
    }
    
    pdf.save("business-plan-complete.pdf")
  } catch (error) {
    console.error("Error exporting PDF:", error)
  }
} 