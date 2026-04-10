document.addEventListener('DOMContentLoaded', () => {
    
    // --- Add News Form Logic ---
    const newsForm = document.getElementById('news-form');
    
    newsForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent standard page refresh
        
        // Retrieve values from the form inputs
        const title = document.getElementById('news-title').value.trim();
        const detail = document.getElementById('news-detail').value.trim();
        const author = document.getElementById('news-author').value.trim();
        
        // Assemble the JSON Object
        const newsData = {
            type: 'NEWS_FEED',
            title: title,
            detail: detail,
            author: author,
            timestamp: new Date().toISOString()
        };
        
        // Print to Console as requested (Ready for Firebase integration)
        console.log("=== [FIREBASE EXPORT] News Data ===");
        console.log(JSON.stringify(newsData, null, 2));
        
        // Visual feedback
        alert(`ดึงข้อมูลสำเร็จ เตรียมส่งให้ Firebase:\n\nหัวข้อ: ${title}\n\n* ตรวจสอบผลลัพธ์ Object ได้ใน Console`);
        
        // Reset the form fields
        newsForm.reset();
    });

    // --- Add Subject/Resource Form Logic ---
    const subjectForm = document.getElementById('subject-form');
    
    subjectForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent standard page refresh
        
        // Retrieve values from the form inputs
        const category = document.getElementById('subject-category').value;
        const subjectName = document.getElementById('subject-name').value.trim();
        const author = document.getElementById('subject-author').value.trim();
        const fileUrl = document.getElementById('subject-url').value.trim();
        
        // Assemble the JSON Object
        const subjectData = {
            type: 'SUBJECT_RESOURCE',
            category: category,
            subjectName: subjectName,
            author: author,
            fileUrl: fileUrl,
            timestamp: new Date().toISOString()
        };
        
        // Print to Console as requested (Ready for Firebase integration)
        console.log("=== [FIREBASE EXPORT] Subject Data ===");
        console.log(JSON.stringify(subjectData, null, 2));
        
        // Visual feedback
        alert(`ดึงข้อมูลสำเร็จ เตรียมส่งให้ Firebase:\n\nวิชา: ${subjectName}\nหมวดหมู่: ${category}\n\n* ตรวจสอบผลลัพธ์ Object ได้ใน Console`);
        
        // Reset the form fields
        subjectForm.reset();
    });
});
