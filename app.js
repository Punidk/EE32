// --- CONFIGURATION ---
// You can easily add, edit, or remove links from this array.
const portalData = [
    {
        termName: "เนื้อหาและข้อสอบ วิชาอื่นๆ",
        icon: "fa-book-open",
        links: [
            {
                title: "Life Skill",
                url: "./Life Skill/index.html",
                icon: "fa-leaf",
                description: "เอกสารและข้อสอบวิชาทักษะชีวิต (Life Skill)"
            },
            {
                title: "Law (กฎหมาย)",
                url: "https://lawsut.tiiny.site",
                icon: "fa-scale-balanced",
                description: "เอกสารและข้อสอบวิชากฎหมาย (Law)"
            }
        ]
    },
    {
        termName: "เนื้อหาและข้อสอบ: เทอม 1",
        icon: "fa-book-open",
        links: [

        ]
    },
    {
        termName: "เนื้อหาและข้อสอบ: เทอม 2",
        icon: "fa-layer-group",
        links: [
            // Add more Term 2 links here...
        ]
    },
    {
        termName: "เนื้อหาและข้อสอบ: เทอม 3",
        icon: "fa-laptop-code",
        links: [
            {
                title: "Electrical Machines by Mai",
                url: "https://machines.tiiny.site/",
                icon: "fa-bolt",
                description: "แบบทดสอบ กว. กลางภาค (ถึงข้อที่ 220)"
            },
            {
                title: "Electrical Machines by king sag",
                url: "https://fuk-machine.vercel.app/",
                icon: "fa-microchip",
                description: "แบบทดสอบ กว. กลางภาค "
            }
            // Add more Term 3 links here...
        ]
    }
];

// --- APP LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('terms-container');
    const searchInput = document.getElementById('search-input');

    function renderGrid(query = '') {
        container.innerHTML = '';
        const lowerQuery = query.toLowerCase();

        let hasAnyResults = false;

        portalData.forEach((term, index) => {
            // Filter links based on query
            const filteredLinks = term.links.filter(link => 
                link.title.toLowerCase().includes(lowerQuery) || 
                (link.description && link.description.toLowerCase().includes(lowerQuery))
            );

            // Hide section if query is active and nothing matches
            if (query !== '' && filteredLinks.length === 0) return;

            hasAnyResults = true;

            const section = document.createElement('section');
            section.className = 'term-section fade-in';
            section.style.animationDelay = `${index * 0.1}s`;

            const titleEl = document.createElement('h2');
            titleEl.className = 'term-title';
            titleEl.innerHTML = `<i class="fa-solid ${term.icon}"></i> ${term.termName}`;
            section.appendChild(titleEl);

            const grid = document.createElement('div');
            grid.className = 'links-grid';

            if (filteredLinks.length === 0 && query === '') {
                grid.innerHTML = `<p style="color: var(--text-secondary); padding: 1rem; border: 1px dashed var(--border-glass); border-radius: 12px; text-align: center;">ยังไม่มีข้อสอบในเทอมนี้</p>`;
            } else {
                filteredLinks.forEach(link => {
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
            }

            section.appendChild(grid);
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

    if(searchInput) {
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

    // Using gemini-1.5-flash with safe quota boundary (avoid gemini-2.5-flash strict limits)
    const API_KEY = "AIzaSyCC_uf2OfQPTpXw6v2zsM6bBf38WY4RKKs";
    
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
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `คุณคือผู้ช่วย AI ของกลุ่มนักศึกษา EE#32 คณะวิศวกรรมศาสตร์ ช่วยตอบคำถามเกี่ยวกับวิศวกรรมไฟฟ้าและกฎหมายทั่วไปอย่างสุภาพ เป็นมิตร และกระชับมากๆ คำถามคือ: ${text}`
                        }]
                    }]
                })
            });

            if(!response.ok) throw new Error("API Limit exceeded or Network Error");
            
            const data = await response.json();
            const botReply = data.candidates[0].content.parts[0].text;
            addMessage(botReply, 'bot');
            
        } catch (error) {
            console.error(error);
            addMessage('ขออภัยครับ ขณะนี้ระบบขัดข้องหรือโควต้า AI อาจจะหมดชั่วคราว ลองใหม่ภายหลังนะครับ 😅', 'bot');
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
