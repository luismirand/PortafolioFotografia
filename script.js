
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSO97Zc0CABJGxGsUVRZPZL-sz0AvyEoMLnqK04cpzPfIaAFcMmrLSCJJ78nyPrjN-l7YNMvYQBbzoZ/pub?gid=0&single=true&output=csv';
document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    initMenu();
    initScrollAnimations();
    initScrollSpy();
});

// 1. CARGA DE DATOS ROBUSTA
function fetchData() {
    Papa.parse(SHEET_URL, {
        download: true, header: true,
        complete: (results) => processData(results.data),
        error: (err) => {
            console.error("Error Sheet:", err);
            document.getElementById('bio-name').innerText = "Error cargando. Verifica el link CSV.";
        }
    });
}

function processData(data) {
    clearAllContainers();
    // Ordenar por columna 'orden'
    data.sort((a, b) => (parseInt(a.orden)||999) - (parseInt(b.orden)||999));

    data.forEach(row => {
        if(!row.seccion) return;
        const seccion = row.seccion.toLowerCase().trim();
        // Convertir link imagen
        const imgUrl = convertDriveLink(row.imagen || '');

        if (seccion === 'bio') {
            // Llenar todos los datos del perfil
            renderBio(row.titulo, row.descripcion, imgUrl, row.link_extra);
        } else if (seccion === 'contacto') {
            createContactItem(row.titulo, row.descripcion, row.link_extra);
        } else {
            // Lógica para galerías
            const container = document.getElementById(seccion + '-grid');
            if (container && imgUrl) {
                // Pasar el ESTILO (vertical, big, etc) a la función
                createCard(container, row.titulo, row.descripcion, imgUrl, row.link_extra, row.estilo);
            }
        }
    });
}

// 2. RENDERIZADO DE DATOS
function renderBio(name, desc, imgUrl, linkBtn) {
    if(name) {
        // Actualizar TODOS los lugares donde va el nombre
        const bioName = document.getElementById('bio-name');
        const sideName = document.getElementById('sidebar-name');
        const mobileBrand = document.getElementById('mobile-brand');
        
        if(bioName) bioName.innerText = name;
        if(sideName) sideName.innerText = name;
        if(mobileBrand) mobileBrand.innerText = name;
    }
    
    if(desc) {
        document.getElementById('bio-desc').innerText = desc;
 
    }
    
    if(imgUrl) {
        const img = document.getElementById('bio-img');
        if(img) { img.src = imgUrl; img.style.display = 'block'; }
    }
    
    const btn = document.getElementById('bio-btn');
    if(btn) {
        if (linkBtn) { btn.href = linkBtn; btn.target = "_blank"; } 
        else { btn.href = "#contacto"; }
    }
}

function createCard(container, title, role, imgUrl, linkExtra, styleClass) {
    const card = document.createElement('div');
    let className = 'gallery-item';

    if(styleClass) {
        const style = styleClass.toLowerCase().trim();
        if(style === 'vertical') className += ' vertical';
        if(style === 'horizontal') className += ' horizontal';
        if(style === 'big') className += ' big';
    }

    card.className = className;
    const icon = linkExtra ? '<i class="fas fa-external-link-alt" style="margin-left:5px;"></i>' : '';

    card.innerHTML = `
        <img src="${imgUrl}" alt="${title}" loading="lazy">
        <div class="overlay">
            <h4>${title} ${icon}</h4>
            <p>${role}</p>
        </div>
    `;

    card.addEventListener('click', () => {
        linkExtra ? window.open(linkExtra, '_blank') : openLightbox(imgUrl, title, role);
    });
    container.appendChild(card);
}


function initMenu() {
    const btn = document.getElementById('menu-btn');
    const closeBtn = document.getElementById('close-menu-btn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('menu-overlay');
    const links = document.querySelectorAll('.nav-link');

    const toggle = () => {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    };

    if(btn) btn.addEventListener('click', toggle);
    if(closeBtn) closeBtn.addEventListener('click', toggle);
    if(overlay) overlay.addEventListener('click', toggle);
    
    links.forEach(link => link.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    }));
}

function initScrollSpy() {
    const sections = document.querySelectorAll('.scroll-spy-target');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('active-section'));
                const id = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                if (activeLink) activeLink.classList.add('active-section');
            }
        });
    }, { threshold: 0.25 });
    sections.forEach(section => observer.observe(section));
}

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.section').forEach(el => observer.observe(el));
}

// 4. UTILIDADES
function createContactItem(title, value, link) {
    const container = document.getElementById('contact-list');
    const div = document.createElement('div');
    div.className = 'contact-item';
    let contentHtml = `<p>${value}</p>`;
    if (link) contentHtml = `<p><a href="${link}" target="_blank">${value}</a></p>`;
    div.innerHTML = `<h4>${title}</h4>${contentHtml}`;
    container.appendChild(div);
    
    if(title && link) {
        if(title.toLowerCase().includes('instagram')) {
            const el = document.getElementById('social-ig');
            if(el) el.href = link;
        }
        if(title.toLowerCase().includes('linkedin')) {
            const el = document.getElementById('social-li');
            if(el) el.href = link;
        }
    }
}

function convertDriveLink(link) {
    if (!link || !link.includes('drive.google.com')) return link;
    let id = '';
    const parts = link.split('/');
    if (parts.indexOf('d') !== -1) id = parts[parts.indexOf('d') + 1];
    else if (link.includes('id=')) id = link.split('id=')[1].split('&')[0];
    return id ? `https://drive.google.com/uc?export=view&id=${id}` : link;
}

function clearAllContainers() {
    document.querySelectorAll('.grid-masonry').forEach(el => el.innerHTML = '');
    const cl = document.getElementById('contact-list');
    if(cl) cl.innerHTML = '';
}

// Lightbox Logic
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lightbox-img');
const lbCap = document.getElementById('caption');
const closeLightBtn = document.querySelector('.close-lightbox');

function openLightbox(url, title, desc) {
    lbImg.src = url;
    lbCap.innerHTML = `<strong>${title}</strong><br>${desc}`;
    lightbox.classList.add('show');
}
function closeLightbox() {
    lightbox.classList.remove('show');
    setTimeout(() => { lbImg.src = ''; }, 300);
}
if(closeLightBtn) closeLightBtn.onclick = closeLightbox;
if(lightbox) lightbox.onclick = (e) => { if (e.target === lightbox) closeLightbox(); };