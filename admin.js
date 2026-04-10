import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
    getFirestore, collection, addDoc, doc, deleteDoc,
    onSnapshot, query, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// --- 1. การตั้งค่า Firebase (Setup) ---
// TODO: นำค่า config จาก Firebase Console ของคุณมาแทนที่ "YOUR_..." ทั้งหมดด้านล่างนี้
const firebaseConfig = {
    apiKey: "AIzaSyCi9yjJqKO0B1U7pfEE7X8vaB6O7Yd8tsA",
    authDomain: "wedhub-88ce4.firebaseapp.com",
    projectId: "wedhub-88ce4",
    storageBucket: "wedhub-88ce4.firebasestorage.app",
    messagingSenderId: "304820508363",
    appId: "1:304820508363:web:460522d5dff2e8a3996d4e",
    measurementId: "G-XDMZK3C42H"
};

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {

    // --- 3. ระบบดึงข้อมูลมาแสดง (Read) ---
    const newsTableBody = document.getElementById('news-table-body');
    const subjectsTableBody = document.getElementById('subjects-table-body');

    // ดึงข้อมูลข่าวสารแบบเรียลไทม์ (Real-time updates) โดยเรียงจากใหม่ล่าสุด
    const qNews = query(collection(db, "news"), orderBy("createdAt", "desc"));
    onSnapshot(qNews, (snapshot) => {
        newsTableBody.innerHTML = ''; // ล้าง Loading หรือ ข้อมูลเก่าก่อนวาดใหม่

        if (snapshot.empty) {
            newsTableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">ยังไม่มีข่าวสารในระบบ</td></tr>';
            return;
        }

        snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const id = docSnap.id;

            // แปลง Firebase Timestamp เป็นวันที่อ่านง่าย
            const dateStr = data.createdAt ? data.createdAt.toDate().toLocaleDateString('th-TH') : 'กำลังบันทึก...';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${data.title}</td>
                <td>${data.author}</td>
                <td>${dateStr}</td>
                <td class="text-right">
                    <button class="delete-btn" data-id="${id}" data-category="news">
                        <i class="fa-solid fa-trash-can"></i> ลบ
                    </button>
                </td>
            `;
            newsTableBody.appendChild(tr);
        });
        attachDeleteEvents(); // ผูก Event ให้ปุ่มลบทุกครั้งที่วาดตารางใหม่
    });

    // ดึงข้อมูลรายวิชาแบบเรียลไทม์
    const qSubjects = query(collection(db, "subjects"), orderBy("createdAt", "desc"));
    onSnapshot(qSubjects, (snapshot) => {
        subjectsTableBody.innerHTML = '';

        if (snapshot.empty) {
            subjectsTableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">ยังไม่มีรายวิชาในระบบ</td></tr>';
            return;
        }

        snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const id = docSnap.id;

            // กำหนดสี Badge ตามหมวดหมู่
            let badgeClass = 'badge-ge'; // สีเหลือง (Default fallback)
            if (data.category === 'EE') badgeClass = 'badge-ee'; // สีฟ้า
            if (data.category === 'LAB') badgeClass = 'badge-lab'; // สีเขียว
            if (data.category === 'PDF') badgeClass = 'badge-ge';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${data.subjectName}</td>
                <td><span class="badge ${badgeClass}">${data.category}</span></td>
                <td>${data.author}</td>
                <td class="text-right">
                    <button class="delete-btn" data-id="${id}" data-category="subjects">
                        <i class="fa-solid fa-trash-can"></i> ลบ
                    </button>
                </td>
            `;
            subjectsTableBody.appendChild(tr);
        });
        attachDeleteEvents();
    });


    // --- 2. ระบบเพิ่มข้อมูล (Create) ---
    const newsForm = document.getElementById('news-form');
    newsForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = newsForm.querySelector('.submit-btn');
        const oldText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> กำลังบันทึก...';
        submitBtn.disabled = true;

        try {
            // บันทึกข้อมูลลง Collection "news"
            await addDoc(collection(db, "news"), {
                title: document.getElementById('news-title').value.trim(),
                content: document.getElementById('news-detail').value.trim(),
                author: document.getElementById('news-author').value.trim(),
                createdAt: serverTimestamp() // ให้ Server จัดการเรื่องเวลาแทนเพื่อความแม่นยำ
            });

            alert('เพิ่มข่าวสารสำเร็จเรียบร้อยครับ!');
            newsForm.reset();
        } catch (error) {
            console.error("Error adding news: ", error);
            alert("เกิดข้อผิดพลาดในการบันทึก กรุณาตรวจสอบ Console");
        } finally {
            submitBtn.innerHTML = oldText;
            submitBtn.disabled = false;
        }
    });

    const subjectForm = document.getElementById('subject-form');
    subjectForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = subjectForm.querySelector('.btn-success');
        const oldText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> กำลังบันทึก...';
        submitBtn.disabled = true;

        try {
            // บันทึกข้อมูลลง Collection "subjects"
            await addDoc(collection(db, "subjects"), {
                category: document.getElementById('subject-category').value,
                subjectName: document.getElementById('subject-name').value.trim(),
                author: document.getElementById('subject-author').value.trim(),
                fileUrl: document.getElementById('subject-url').value.trim(),
                createdAt: serverTimestamp()
            });

            alert('เพิ่มรายวิชาแนบสำเร็จเรียบร้อยครับ!');
            subjectForm.reset();
        } catch (error) {
            console.error("Error adding subject: ", error);
            alert("เกิดข้อผิดพลาดในการบันทึก กรุณาตรวจสอบ Console");
        } finally {
            submitBtn.innerHTML = oldText;
            submitBtn.disabled = false;
        }
    });


    // --- 4. ระบบลบข้อมูล (Delete) ---
    // ฟังก์ชันนี้จะถูกเรียกซ้ำทุกครั้งที่ onSnapshot อัปเดตตาราง
    function attachDeleteEvents() {
        const deleteBtns = document.querySelectorAll('.delete-btn');
        deleteBtns.forEach(btn => {
            // ลบ Event เดิมก่อนป้องกันการทำงานซ้ำซ้อนเวลา Render ใหม่
            btn.removeEventListener('click', handleDelete);
            btn.addEventListener('click', handleDelete);
        });
    }

    async function handleDelete(e) {
        const id = e.currentTarget.getAttribute('data-id');
        const category = e.currentTarget.getAttribute('data-category'); // เป็นสายสตริง 'news' หรือ 'subjects'

        const confirmDelete = confirm('คุณแน่ใจหรือไม่ที่จะลบข้อมูลนี้? (การลบใน Database ไม่สามารถกู้คืนได้)');

        if (confirmDelete) {
            try {
                // เปลี่ยนสถานะปุ่มตอนกำลังโหลด
                e.currentTarget.disabled = true;
                e.currentTarget.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> กำลังลบ...';

                // อ้างอิงถึง Document โดยใช้ ID และทำการลบ
                await deleteDoc(doc(db, category, id));

                // ไม่ต้องสั่งลบแท็ก <tr> เอง เพราะเมื่อ Database เปลี่ยนแปลง 
                // onSnapshot (ระบบดึงข้อมูลแบบเรียลไทม์) ด้านบนจะจับได้และวาดตารางใหม่ทั้งหมดให้เองทันที
                console.log(`[FIREBASE] ลบ Document ID: ${id} จาก Collection: ${category} สำเร็จ`);
            } catch (error) {
                console.error("Error deleting document: ", error);
                alert("เกิดข้อผิดพลาดในการลบข้อมูล!");
                e.currentTarget.disabled = false;
                e.currentTarget.innerHTML = '<i class="fa-solid fa-trash-can"></i> ลบ';
            }
        }
    }
});
