import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
    getFirestore, collection, onSnapshot, query, orderBy
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// --- 1. การตั้งค่า Firebase (Setup) ---
// TODO: ใส่ API Key ของคุณที่นี่
const firebaseConfig = {
    apiKey: "AIzaSyCi9yjJqKO0B1U7pfEE7X8vaB6O7Yd8tsA",
    authDomain: "wedhub-88ce4.firebaseapp.com",
    projectId: "wedhub-88ce4",
    storageBucket: "wedhub-88ce4.firebasestorage.app",
    messagingSenderId: "304820508363",
    appId: "1:304820508363:web:460522d5dff2e8a3996d4e",
    measurementId: "G-XDMZK3C42H"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {

    const container = document.getElementById('categories-container');
    const newsFeedContainer = document.querySelector('.news-feed-content');

    // --- 2. News Feed (พื้นที่ตรงกลาง) ---
    const qNews = query(collection(db, "news"), orderBy("createdAt", "desc"));
    onSnapshot(qNews, (snapshot) => {
        newsFeedContainer.innerHTML = ''; // ล้างข้อมูลเดิม/สถานะ Loading

        if (snapshot.empty) {
            newsFeedContainer.innerHTML = '<div class="news-card"><p style="color: var(--text-secondary); text-align: center;">ยังไม่มีข่าวสารในขณะนี้</p></div>';
            return;
        }

        snapshot.forEach(docSnap => {
            const data = docSnap.data();
            const dateStr = data.createdAt ? data.createdAt.toDate().toLocaleDateString('th-TH') : 'กำลังอัปเดต...';

            const newsCard = document.createElement('div');
            newsCard.className = 'news-card fade-in';
            newsCard.innerHTML = `
                <h3><i class="fa-solid fa-bullhorn" style="color: var(--accent-1);"></i> ${data.title}</h3>
                <p>${data.content}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-glass); padding-top: 1rem; margin-top: 1rem;">
                    <span class="news-date"><i class="fa-regular fa-clock"></i> ${dateStr}</span>
                    <span style="font-size: 0.85rem; color: var(--text-secondary);"><i class="fa-regular fa-user"></i> ${data.author}</span>
                </div>
            `;
            newsFeedContainer.appendChild(newsCard);
        });
    });


    // --- 3. Subjects Sidebar (พื้นที่ด้านซ้าย ข้อมูลวิชา) ---
    // Mapping หมวดหมู่หลักเป็นชื่อเต็มและไอคอน
    const categoryMapping = {
        'EE': { name: 'วิชาหลัก (Main Subjects)', icon: 'fa-star-half-stroke' },
        'GE': { name: 'วิชารอง (Elective Subjects)', icon: 'fa-layer-group' },
        'LAB': { name: 'ปฏิบัติการ (Laboratory)', icon: 'fa-flask-vial' },
        'PDF': { name: 'เอกสารชีท (PDF)', icon: 'fa-file-pdf' }
    };

    const qSubjects = query(collection(db, "subjects"), orderBy("createdAt", "desc"));
    onSnapshot(qSubjects, (snapshot) => {
        // เราจะได้ข้อมูลมาเป็นลิสต์ยาวๆ จึงต้องนำมาจัดกลุ่ม (Group By) หมวดหมู่ > รายวิชา ก่อนวาด
        const groupedData = {};

        snapshot.forEach(docSnap => {
            const data = docSnap.data();
            const cat = data.category || 'OTHER';
            const subj = data.subjectName || 'ทั่วไป';

            if (!groupedData[cat]) groupedData[cat] = {};
            if (!groupedData[cat][subj]) groupedData[cat][subj] = [];

            groupedData[cat][subj].push({
                id: docSnap.id,
                author: data.author,
                url: data.fileUrl
            });
        });

        renderSidebar(groupedData);
    });

    function renderSidebar(groupedData) {
        container.innerHTML = ''; // ล้างข้อมูลเดิม
        let delayIndex = 0;

        // จัดเรียงหมวดหมู่หลักให้ออกมาตามลำดับนี้เสมอ
        const catOrder = ['EE', 'GE', 'LAB', 'PDF'];
        const existingCats = Object.keys(groupedData).sort((a, b) => {
            const indexA = catOrder.indexOf(a) !== -1 ? catOrder.indexOf(a) : 99;
            const indexB = catOrder.indexOf(b) !== -1 ? catOrder.indexOf(b) : 99;
            return indexA - indexB;
        });

        if (existingCats.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding: 2rem; color: var(--text-secondary);"><i class="fa-solid fa-folder-open mb-2" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i><p>ยังไม่มีข้อมูลวิชา</p></div>';
            return;
        }

        // วนลูปวาด หมวดหมู่ (ชั้นที่ 1)
        existingCats.forEach((cat) => {
            const catInfo = categoryMapping[cat] || { name: cat, icon: 'fa-folder' };

            const section = document.createElement('section');
            section.className = 'category-section fade-in';
            section.style.animationDelay = `${delayIndex * 0.1}s`;
            if (delayIndex === 0) section.classList.add('open'); // เปิดหมวดแรกไว้ตอนโหลด
            delayIndex++;

            const titleEl = document.createElement('h2');
            titleEl.className = 'category-title';
            titleEl.innerHTML = `
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <i class="fa-solid ${catInfo.icon}"></i> ${catInfo.name}
                </div>
                <i class="fa-solid fa-chevron-down toggle-icon"></i>
            `;
            section.appendChild(titleEl);

            const contentWrap = document.createElement('div');
            contentWrap.className = 'category-content-wrap';
            const contentInner = document.createElement('div');
            contentInner.className = 'category-content-inner';

            const subjects = groupedData[cat];

            // วนลูปวาด รายวิชา (ชั้นที่ 2)
            Object.keys(subjects).forEach(subjName => {
                const subjectGroup = document.createElement('div');
                subjectGroup.className = 'subject-group';

                const subjTitle = document.createElement('h3');
                subjTitle.className = 'subject-title';
                subjTitle.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 0.6rem;">
                        <i class="fa-solid fa-book"></i> ${subjName}
                    </div>
                    <i class="fa-solid fa-chevron-down toggle-icon"></i>
                `;
                subjectGroup.appendChild(subjTitle);

                const subjContentWrap = document.createElement('div');
                subjContentWrap.className = 'subject-content-wrap';
                const grid = document.createElement('div');
                grid.className = 'links-grid';

                // วนลูปวาด ลิงก์ไฟล์ (เนื้อหาในชั้นที่ 2)
                subjects[subjName].forEach(fileData => {
                    const linkEl = document.createElement('a');
                    linkEl.href = fileData.url;
                    linkEl.className = 'link-card block';
                    linkEl.target = '_blank';
                    linkEl.innerHTML = `
                        <div class="link-icon"><i class="fa-solid fa-link"></i></div>
                        <div class="link-content">
                            <div class="link-title">ไฟล์เอกสาร / แหล่งอ้างอิง</div>
                            <div class="link-desc"><i class="fa-solid fa-pen-nib"></i> ${fileData.author || 'ไม่ระบุ'}</div>
                        </div>
                        <div class="link-arrow"><i class="fa-solid fa-arrow-up-right-from-square"></i></div>
                    `;
                    grid.appendChild(linkEl);
                });

                subjContentWrap.appendChild(grid);
                subjectGroup.appendChild(subjContentWrap);
                contentInner.appendChild(subjectGroup);

                // กดย่อ-ขยายชั้นที่ 2 (ระดับวิชา)
                subjTitle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    subjectGroup.classList.toggle('open');
                });
            });

            contentWrap.appendChild(contentInner);
            section.appendChild(contentWrap);

            // กดย่อ-ขยายชั้นที่ 1 (ระดับหมวดหมู่)
            titleEl.addEventListener('click', () => {
                section.classList.toggle('open');
            });

            container.appendChild(section);
        });
    }

    // --- 4. Admin Authentication Mode Logic ---
    const adminBtn = document.getElementById('admin-btn');
    const adminModal = document.getElementById('admin-modal');
    const adminClose = document.getElementById('admin-close');
    const adminPassword = document.getElementById('admin-password');
    const adminSubmit = document.getElementById('admin-submit');
    const adminError = document.getElementById('admin-error');

    if (adminBtn) {
        adminBtn.addEventListener('click', () => {
            adminModal.classList.add('active');
            adminPassword.value = '';
            adminError.style.display = 'none';
            setTimeout(() => adminPassword.focus(), 100);
        });

        adminClose.addEventListener('click', () => {
            adminModal.classList.remove('active');
        });

        const checkAdminPassword = () => {
            // Hardcode password ไว้ตามเดิมที่ขอ
            if (adminPassword.value === 'ee32admin') {
                window.location.href = 'admin.html';
            } else {
                adminError.style.display = 'block';
                adminPassword.style.borderColor = '#ef4444';
                setTimeout(() => {
                    adminPassword.style.borderColor = 'var(--border-glass)';
                }, 2000);
            }
        };

        adminSubmit.addEventListener('click', checkAdminPassword);
        adminPassword.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkAdminPassword();
        });
    }

    // --- AI Chat Logic Support ---
    const aiFab = document.getElementById('ai-fab');
    const aiWindow = document.getElementById('ai-chat-window');
    const aiClose = document.getElementById('ai-close');
    const aiSend = document.getElementById('ai-send');
    const aiInput = document.getElementById('ai-input');
    const aiMessages = document.getElementById('ai-messages');

    if (aiFab && aiWindow) {
        // Toggle เปิด/ปิด แชท
        aiFab.addEventListener('click', () => {
            aiWindow.classList.add('active');
            aiFab.style.transform = 'scale(0)'; // ซ่อนปุ่มหุ่นยนต์ตอนที่แชทเปิดอยู่
            setTimeout(() => aiInput.focus(), 200);
        });

        // ปุ่ม X สำหรับปิดหน้าต่างแชท
        aiClose.addEventListener('click', () => {
            aiWindow.classList.remove('active');
            aiFab.style.transform = 'scale(1)'; // แสดงปุ่มหุ่นยนต์กลับมา
        });

        // ฟังก์ชันวาดกล่องข้อความ
        const addMessage = (text, isUser = false) => {
            const msgDiv = document.createElement('div');
            msgDiv.className = `ai-message ${isUser ? 'user' : 'bot'} fade-in`;
            msgDiv.textContent = text;
            aiMessages.appendChild(msgDiv);
            aiMessages.scrollTop = aiMessages.scrollHeight; // Auto-scroll ลงล่างสุด
        };

        // ฟังก์ชันกดส่งข้อความ
        const handleSend = () => {
            const text = aiInput.value.trim();
            if (!text) return;
            
            addMessage(text, true); // แสดงฝั่งผู้ใช้ (User)
            aiInput.value = '';
            
            // Disable ปุ่มป้องกันสแปม
            const oldHtml = aiSend.innerHTML;
            aiSend.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
            aiInput.disabled = true;

            // ตัวอย่าง: จำลองการรอคำตอบ 1 วินาที (สามารถนำไปเปลี่ยนเป็น Fetch AI API ได้เลย)
            setTimeout(() => {
                addMessage("ระบบ AI Backend ของเรากำลังอยู่ระหว่างพัฒนาครับ จะรีบประกอบกลับมาให้ไวที่สุด ⚡🤖", false);
                aiSend.innerHTML = oldHtml;
                aiInput.disabled = false;
                aiInput.focus();
            }, 1000);
        };

        aiSend.addEventListener('click', handleSend);
        aiInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSend();
        });
    }
});
