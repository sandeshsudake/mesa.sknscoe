document.addEventListener('DOMContentLoaded', () => {
    const eventName = document.querySelector('.report-title').textContent.trim();
    const reportTable = document.getElementById('reportTable');

    /**
     * Creates a temporary, clean table for exporting by removing unwanted columns.
     * @returns {HTMLTableElement} A clone of the report table with specified columns removed.
     */
    const getClonedTableForExport = () => {
        const clonedTable = reportTable.cloneNode(true);
        // Remove all cells and headers with the 'no-print' class
        clonedTable.querySelectorAll('.no-print').forEach(el => el.remove());
        return clonedTable;
    };

    // --- Export to PDF ---
    document.getElementById('exportPdf').addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'landscape' }); // Use landscape for wider tables
        const tableToExport = getClonedTableForExport();

        doc.autoTable({
            html: tableToExport,
            startY: 25,
            headStyles: { fillColor: [26, 58, 110] }, // Dark blue header
            didDrawPage: (data) => {
                // Header Title
                doc.setFontSize(18);
                doc.setTextColor('#1a3a6e');
                doc.text(eventName + " - Registration Report", data.settings.margin.left, 15);
                // Footer
                const pageCount = doc.internal.getNumberOfPages();
                doc.setFontSize(10);
                doc.text("Page " + data.pageNumber + " of " + pageCount, data.settings.margin.left, doc.internal.pageSize.height - 10);
            }
        });

        doc.save(`${eventName}_report.pdf`);
    });

    // --- Export to Excel ---
    document.getElementById('exportExcel').addEventListener('click', () => {
        const tableToExport = getClonedTableForExport();
        const wb = XLSX.utils.table_to_book(tableToExport, { sheet: "Event Report" });
        XLSX.writeFile(wb, `${eventName}_report.xlsx`);
    });

    // --- Print Report ---
    document.getElementById('printReport').addEventListener('click', () => {
        window.print();
    });

    // --- Live Search Functionality ---
    const searchInput = document.getElementById('searchInput');
    const tableRows = reportTable.querySelectorAll('tbody tr');

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();

        tableRows.forEach(row => {
            const rowText = row.textContent.toLowerCase();
            if (rowText.includes(searchTerm)) {
                row.style.display = ''; // Show row if it matches
            } else {
                row.style.display = 'none'; // Hide row if it doesn't match
            }
        });
    });
});