// --- CONFIGURATION ---
// You can easily add, edit, or remove links from this array.
const portalData = [
    {
        categoryName: "วิชาหลัก (Main Subjects)",
        icon: "fa-star",
        subjects: [
            {
                subjectName: "Electrical Machines",
                icon: "fa-bolt",
                links: [
                    {
                        title: "Electrical Machines by Mai",
                        url: "https://machines.tiiny.site/",
                        icon: "fa-file-lines",
                        description: "แบบทดสอบ กว. กลางภาค (ถึงข้อที่ 220)"
                    },
                    {
                        title: "Electrical Machines by king sag",
                        url: "https://fuk-machine.vercel.app/",
                        icon: "fa-microchip",
                        description: "แบบทดสอบ กว. กลางภาค "
                    }
                ]
            }
        ]
    },
    {
        categoryName: "วิชารอง (Elective/Minor Subjects)",
        icon: "fa-layer-group",
        subjects: [
            {
                subjectName: "Life Skill",
                icon: "fa-leaf",
                links: [
                    {
                        title: "Life Skill Exams",
                        url: "./Life Skill/index.html",
                        icon: "fa-book-open",
                        description: "เอกสารและข้อสอบวิชาทักษะชีวิต (Life Skill)"
                    }
                ]
            },
            {
                subjectName: "Law (กฎหมาย)",
                icon: "fa-scale-balanced",
                links: [
                    {
                        title: "Law Exams",
                        url: "./law/index.html",
                        icon: "fa-gavel",
                        description: "เอกสารและข้อสอบวิชากฎหมาย (Law)"
                    }
                ]
            }
        ]
    }
];

// --- APP LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('categories-container');
    const searchInput = document.getElementById('search-input');

    function renderGrid(query = '') {
        container.innerHTML = '';
        const lowerQuery = query.toLowerCase();

        let hasAnyResults = false;

        portalData.forEach((category, index) => {
            // Filter nested subjects based on query
            const matchingSubjects = category.subjects.map(subject => {
                const filteredLinks = subject.links.filter(link =>
                    link.title.toLowerCase().includes(lowerQuery) ||
                    (link.description && link.description.toLowerCase().includes(lowerQuery))
                );
                return { ...subject, links: filteredLinks };
            });

            // Keep only subjects that have matching links (unless finding all if query is empty)
            const activeSubjects = query === '' ? matchingSubjects : matchingSubjects.filter(sub => sub.links.length > 0);

            // Hide section if query is active and nothing matches
            if (query !== '' && activeSubjects.length === 0) return;

            hasAnyResults = true;

            const section = document.createElement('section');
            section.className = 'category-section fade-in';
            section.style.animationDelay = `${index * 0.1}s`;

            const titleEl = document.createElement('h2');
            titleEl.className = 'category-title';
            titleEl.innerHTML = `<i class="fa-solid ${category.icon}"></i> ${category.categoryName}`;
            section.appendChild(titleEl);

            if (activeSubjects.length === 0) {
                const emptyMsg = document.createElement('p');
                emptyMsg.style = 'color: var(--text-secondary); padding: 1rem; border: 1px dashed var(--border-glass); border-radius: 12px; text-align: center;';
                emptyMsg.textContent = 'ยังไม่มีข้อสอบในหมวดหมู่นี้';
                section.appendChild(emptyMsg);
            } else {
                activeSubjects.forEach(subject => {
                    const subjectGroup = document.createElement('div');
                    subjectGroup.className = 'subject-group';

                    // Automatically open if actively searching
                    const isSearching = query !== '';
                    if (isSearching) {
                        subjectGroup.classList.add('open');
                    }

                    const subjectTitle = document.createElement('h3');
                    subjectTitle.className = 'subject-title';

                    const titleLeft = document.createElement('div');
                    titleLeft.innerHTML = `<i class="fa-solid ${subject.icon}"></i> ${subject.subjectName}`;
                    titleLeft.style.display = 'flex';
                    titleLeft.style.alignItems = 'center';
                    titleLeft.style.gap = '0.6rem';

                    const toggleIcon = document.createElement('i');
                    toggleIcon.className = 'fa-solid fa-chevron-down toggle-icon';

                    subjectTitle.appendChild(titleLeft);
                    subjectTitle.appendChild(toggleIcon);
                    subjectGroup.appendChild(subjectTitle);

                    const contentWrap = document.createElement('div');
                    contentWrap.className = 'subject-content';

                    const grid = document.createElement('div');
                    grid.className = 'links-grid';

                    subject.links.forEach(link => {
                        const linkEl = document.createElement('a');
                        linkEl.href = link.url;
                        linkEl.className = 'link-card block';
                        linkEl.target = '_blank';

                        linkEl.innerHTML = `
                            <div class="link-icon"><i class="fa-solid ${link.icon}"></i></div>
                            <div class="link-content">
                                <div class="link-title">${link.title}</div>
                                <div class="link-desc">${link.description}</div>
                            </div>
                            <div class="link-arrow"><i class="fa-solid fa-chevron-right"></i></div>
                        `;
                        grid.appendChild(linkEl);
                    });

                    contentWrap.appendChild(grid);
                    subjectGroup.appendChild(contentWrap);

                    // Accordion click handler
                    subjectTitle.addEventListener('click', () => {
                        subjectGroup.classList.toggle('open');
                    });

                    section.appendChild(subjectGroup);
                });
            }

            container.appendChild(section);
        });

        if (!hasAnyResults) {
            container.innerHTML = `<div style="text-align:center; padding: 3rem 1rem; color: var(--text-secondary);" class="fade-in">
                <i class="fa-solid fa-magnifying-glass" style="font-size: 2.5rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>ไม่พบผลการค้นหาสำหรับ <b>"${query}"</b></p>
                <small>ลองเปลี่ยนคำค้นหาใหม่ หรือถาม AI หมอผีวิศวะมุมขวาล่างดูได้นะครับ 👻⚡</small>
            </div>`;
        }
    }

    renderGrid();

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderGrid(e.target.value);
        });
    }

    // --- AI CHAT LOGIC ---
    const aiFab = document.getElementById('ai-fab');
    const aiWindow = document.getElementById('ai-chat-window');
    const aiClose = document.getElementById('ai-close');
    const aiInput = document.getElementById('ai-input');
    const aiSend = document.getElementById('ai-send');
    const aiMessages = document.getElementById('ai-messages');

    // Using our own AI Backend API
    const AI_BACKEND_URL = "http://127.0.0.1:8000/api/chat";

    // Toggle Window
    aiFab.addEventListener('click', () => {
        aiWindow.classList.add('active');
        aiInput.focus();
        aiFab.style.transform = "scale(0)"; // Hide FAB smoothly
    });
    aiClose.addEventListener('click', () => {
        aiWindow.classList.remove('active');
        aiFab.style.transform = "scale(1)"; // Show FAB again
    });

    const addMessage = (text, sender) => {
        const msg = document.createElement('div');
        msg.className = `ai-message ${sender} fade-in`;
        msg.textContent = text;
        aiMessages.appendChild(msg);
        aiMessages.scrollTop = aiMessages.scrollHeight;
    };

    const handleSend = async () => {
        const text = aiInput.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        aiInput.value = '';
        aiInput.disabled = true;
        aiSend.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

        try {
            // ส่งคำถามไปยัง AI Backend ของเรา
            const response = await fetch(AI_BACKEND_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: `คุณคือผู้ช่วย AI ของกลุ่มนักศึกษา EE#32 คณะวิศวกรรมศาสตร์ ช่วยตอบคำถามเกี่ยวกับวิศวกรรมไฟฟ้าและกฎหมายทั่วไปอย่างสุภาพ เป็นมิตร และกระชับมากๆ คำถามคือ: ${text}`
                })
            });

            if (!response.ok) throw new Error("Backend Error");

            const data = await response.json();
            const botReply = data.reply;
            addMessage(botReply, 'bot');

        } catch (error) {
            console.error(error);
            addMessage('ขออภัยครับ ไม่สามารถเชื่อมต่อกับ AI Backend ได้ โปรดตรวจสอบว่าเซิร์ฟเวอร์หลังบ้านกำลังทำงานอยู่ ⚡', 'bot');
        } finally {
            aiInput.disabled = false;
            aiSend.innerHTML = '<i class="fa-solid fa-paper-plane"></i>';
            aiInput.focus();
        }
    };

    aiSend.addEventListener('click', handleSend);
    aiInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });
});
