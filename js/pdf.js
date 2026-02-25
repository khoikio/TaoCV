// ============================================================
// pdf.js - Xuất CV dưới dạng PDF dùng window.print()
// Đây là cách đáng tin cậy nhất — browser tự xử lý render
// ============================================================

const PDFExporter = {
    async export(previewElement, filename = 'CV') {
        const btn = document.getElementById('btn-export');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<span class="spinner"></span> Đang chuẩn bị...';
        btn.disabled = true;

        // Đặt title tạm thời = tên file PDF người dùng sẽ lưu
        const prevTitle = document.title;
        document.title = filename.replace('.pdf', '');

        // Nhỏ chút delay để spinner hiện
        await new Promise(r => setTimeout(r, 100));

        window.print();

        // Restore sau khi dialog đóng
        document.title = prevTitle;
        btn.innerHTML = originalHTML;
        btn.disabled = false;
    }
};
