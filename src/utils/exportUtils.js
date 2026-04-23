import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from 'exceljs';

/**
 * Exporta un arreglo de objetos a un archivo CSV
 */
export const exportToCSV = async (data, filename = 'reporte.csv') => {
  if (!data || data.length === 0) return;
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Datos');
  const headers = Object.keys(data[0]);
  worksheet.columns = headers.map(h => ({ header: h, key: h }));
  worksheet.addRows(data);
  const buffer = await workbook.csv.writeBuffer();
  const blob = new Blob([buffer], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
};

/**
 * Exporta múltiples hojas a Excel con ESTILOS PREMIUM
 */
export const exportToExcel_MultiSheet = async (sheets, filename = 'reporte_avis.xlsx') => {
  const workbook = new ExcelJS.Workbook();
  
  for (const sheet of sheets) {
    if (!sheet.data || sheet.data.length === 0) continue;
    
    const worksheet = workbook.addWorksheet(sheet.name, {
      views: [{ state: 'frozen', ySplit: 1 }] // Inmovilizar fila superior
    });
    
    const headers = Object.keys(sheet.data[0]);
    worksheet.columns = headers.map(h => ({
      header: h.toUpperCase(),
      key: h,
      width: h.length < 20 ? 25 : 50
    }));

    worksheet.addRows(sheet.data);

    // Filtros automáticos
    worksheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: headers.length }
    };

    // Estilo de encabezado
    const headerRow = worksheet.getRow(1);
    headerRow.height = 25;
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF3D9C3A' }
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

    // Bordes y alineación de datos
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFDDDDDD' } },
          left: { style: 'thin', color: { argb: 'FFDDDDDD' } },
          bottom: { style: 'thin', color: { argb: 'FFDDDDDD' } },
          right: { style: 'thin', color: { argb: 'FFDDDDDD' } }
        };
        if (rowNumber > 1) {
          cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true, indent: 1 };
        }
      });
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
};

export const exportToExcel = async (data, filename = 'reporte.xlsx', sheetName = 'Datos') => {
  await exportToExcel_MultiSheet([{ name: sheetName, data }], filename);
};

export const exportToPDF_Report = (config, data, filename = 'reporte_admin.pdf') => {
  try {
    const doc = new jsPDF();
    const { title, dateRange, sections } = config;
    doc.setFontSize(22); doc.setTextColor(61, 156, 58); doc.text(title, 14, 22);
    doc.setFontSize(10); doc.setTextColor(100);
    doc.text(`Generado el: ${new Date().toLocaleString('es-CO')}`, 14, 30);
    if (dateRange) doc.text(`Rango de fechas: ${dateRange.start} al ${dateRange.end}`, 14, 35);
    
    let currentY = 45;
    if (sections.visitas && data.visitas?.length > 0) {
      doc.setFontSize(16); doc.setTextColor(0); doc.text('Visitas de la Página', 14, currentY);
      currentY += 8;
      autoTable(doc, { startY: currentY, head: [['Fecha', 'Total Visitas']], body: data.visitas.map(v => [v.fecha, v.total]), theme: 'striped', headStyles: { fillColor: [61, 156, 58] } });
      currentY = doc.lastAutoTable.finalY + 15;
    }
    if (sections.usuarios && data.usuarios?.length > 0) {
      if (currentY > 250) { doc.addPage(); currentY = 20; }
      doc.setFontSize(16); doc.text('Nuevos Registros', 14, currentY);
      currentY += 8;
      autoTable(doc, { startY: currentY, head: [['Fecha', 'Nuevos Usuarios']], body: data.usuarios.map(u => [u.fecha, u.total]), theme: 'striped', headStyles: { fillColor: [61, 156, 58] } });
      currentY = doc.lastAutoTable.finalY + 15;
    }
    if (sections.errores && data.errores?.length > 0) {
      if (currentY > 250) { doc.addPage(); currentY = 20; }
      doc.setFontSize(16); doc.text('Errores del Sistema', 14, currentY);
      currentY += 8;
      autoTable(doc, { startY: currentY, head: [['Fecha', 'Cant. Errores']], body: data.errores.map(e => [e.fecha, e.total]), theme: 'striped', headStyles: { fillColor: [224, 85, 85] } });
      currentY = doc.lastAutoTable.finalY + 15;
    }
    if (sections.preguntas && data.preguntas?.length > 0) {
      if (currentY > 200) { doc.addPage(); currentY = 20; }
      doc.setFontSize(16); doc.text('Listado de Preguntas', 14, currentY);
      currentY += 8;
      autoTable(doc, { startY: currentY, head: [['Fecha', 'Pregunta', 'Categoría', 'Estado']], body: data.preguntas.map(q => [new Date(q.created_at).toLocaleDateString(), q.pregunta.substring(0, 80), q.categoria || 'N/A', q.status]), theme: 'grid', headStyles: { fillColor: [61, 156, 58] } });
      currentY = doc.lastAutoTable.finalY + 15;
    }
    doc.save(filename);
  } catch (err) { console.error("Error PDF:", err); }
};
