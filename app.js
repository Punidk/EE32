// --- CONFIGURATION ---
// You can easily add, edit, or remove links from this array.
const portalData = [
    {
        termName: "เนื้อหาและข้อสอบ: เทอม 1",
        icon: "fa-book-open",
        links: [
            // Add more Term 1 links here...
        ]
    },
    {
        termName: "เนื้อหาและข้อสอบ: เทอม 2",
        icon: "fa-layer-group",
        links: [
            // Example placeholder
            // {
            //     title: "Subject Name",
            //     url: "https://example.com",
            //     icon: "fa-microchip",
            //     description: "คำอธิบายรายละเอียดวิชา"
            // }
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
                icon: "fa-miacrochip",
                description: "แบบทดสอบ กว. กลางภาค "
            }
            // Add more Term 3 links here...
        ]
    }
];

// --- APP LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('terms-container');

    portalData.forEach((term, index) => {
        // Create Section Element
        const section = document.createElement('section');
        section.className = 'term-section';
        section.style.animationDelay = `${index * 0.2}s`;

        // Term Title
        const titleEl = document.createElement('h2');
        titleEl.className = 'term-title';
        titleEl.innerHTML = `<i class="fa-solid ${term.icon}"></i> ${term.termName}`;
        section.appendChild(titleEl);

        // Links Grid
        const grid = document.createElement('div');
        grid.className = 'links-grid';

        if (term.links.length === 0) {
            grid.innerHTML = `<p style="color: var(--text-secondary); padding: 1rem; border: 1px dashed var(--border-glass); border-radius: 12px; text-align: center;">ยังไม่มีข้อสอบในเทอมนี้</p>`;
        } else {
            term.links.forEach(link => {
                const linkEl = document.createElement('a');
                linkEl.href = link.url;
                linkEl.className = 'link-card block';
                linkEl.target = '_blank'; // Open in default target or new tab

                linkEl.innerHTML = `
                    <div class="link-icon">
                        <i class="fa-solid ${link.icon}"></i>
                    </div>
                    <div class="link-content">
                        <div class="link-title">${link.title}</div>
                        <div class="link-desc">${link.description}</div>
                    </div>
                    <div class="link-arrow">
                        <i class="fa-solid fa-chevron-right"></i>
                    </div>
                `;
                grid.appendChild(linkEl);
            });
        }

        section.appendChild(grid);
        container.appendChild(section);
    });
});
