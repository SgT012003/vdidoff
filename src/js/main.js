import { fetchJson } from './services/data.js';
import { fetchGitHubProjects, fetchRepoReadme } from './services/github.js';

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', async () => {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Initialize page specific logic
    const path = window.location.pathname;

    if (path.includes('experience')) {
        await renderExperience();
    } else if (path.includes('academic')) {
        await renderAcademic();
    } else if (path.includes('cert-detail')) {
        await renderCertDetail();
    } else if (path.includes('certifications')) {
        await renderCerts();
    } else if (path.includes('project-view')) {
        await renderProjectView();
    } else if (path.includes('projects')) {
        await renderProjects();
    } else {
        await renderSkills();
    }
});

async function renderSkills() {
    const skillsContainer = document.getElementById('skills-container');
    if (!skillsContainer) return;

    const skillsData = await fetchJson('./data/skills.json');
    if (!skillsData) return;

    skillsData.forEach((category, idx) => {
        const div = document.createElement('div');
        // Add staggered animation delay based on index
        div.className = 'bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:border-primary/50 hover:bg-white/10 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,173,216,0.15)] transition-all duration-300';
        div.style.animation = `float ${3 + idx * 0.5}s ease-in-out infinite`;

        const title = document.createElement('h3');
        title.className = 'text-xl font-bold mb-5 bg-clip-text text-transparent bg-gradient-to-r from-primary to-tertiary font-heading';
        title.textContent = category.category;

        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'flex flex-wrap gap-2';

        category.skills.forEach(skill => {
            const span = document.createElement('span');
            span.className = 'bg-primary/10 text-primary px-3 py-1 rounded-sm text-sm font-body';
            span.textContent = skill;
            tagsContainer.appendChild(span);
        });

        div.appendChild(title);
        div.appendChild(tagsContainer);
        skillsContainer.appendChild(div);
    });
}

async function renderExperience() {
    const container = document.getElementById('experience-container');
    if (!container) return;

    const data = await fetchJson('./data/exp.json');
    if (!data) return;

    data.forEach(item => {
        const div = document.createElement('div');
        div.className = 'relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active';

        div.innerHTML = `
            <div class="flex items-center justify-center w-12 h-12 rounded-full border border-primary/30 bg-secondary shadow-[0_0_15px_rgba(0,173,216,0.2)] text-primary shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform group-hover:scale-110 duration-300">
                <span translate="no" class="material-icons text-xl">work</span>
            </div>
            <div class="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:border-primary/50 hover:shadow-[0_10px_30px_rgba(0,173,216,0.15)] hover:-translate-y-1 transition-all duration-300">
                <div class="flex flex-col xl:flex-row xl:justify-between xl:items-center mb-4 gap-2">
                    <h3 class="font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 text-xl font-heading">${item.title}</h3>
                    <span class="text-xs font-body text-tertiary border border-tertiary/30 bg-tertiary/10 px-3 py-1 rounded-full whitespace-nowrap">${item.period}</span>
                </div>
                <h4 class="text-neutral font-heading text-lg mb-4 flex items-center gap-2"><span translate="no" class="material-icons text-base text-neutral/50">business</span> ${item.company} <span class="text-neutral/40 text-sm ml-2">| ${item.location}</span></h4>
                <p class="text-neutral/70 text-sm mb-6 leading-relaxed">${item.description}</p>
                <div class="flex flex-wrap gap-2">
                    ${item.tech_stack.map(tech => `<span class="bg-white/5 border border-white/10 text-neutral/80 px-3 py-1 rounded-lg text-xs font-body hover:bg-primary/20 hover:text-primary transition-colors cursor-default">${tech}</span>`).join('')}
                </div>
            </div>
        `;
        container.appendChild(div);
    });
}

async function renderAcademic() {
    const header = document.getElementById('academic-header');
    const semesters = document.getElementById('academic-semesters');
    if (!header || !semesters) return;

    const data = await fetchJson('./data/academic.json');
    if (!data) return;

    const start = new Date(data.start);
    const end = new Date(data.end);
    const now = new Date();

    let progress = 0;
    if (now > end) {
        progress = 100;
    } else if (now > start) {
        progress = ((now - start) / (end - start)) * 100;
    }
    progress = Math.min(100, Math.max(0, progress));

    header.className = 'mb-10 p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-[0_10px_30px_rgba(0,173,216,0.05)]';
    header.innerHTML = `
        <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full -z-10 pointer-events-none"></div>
        <div>
            <h2 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 font-heading mb-2">${data.institution}</h2>
            <p class="text-neutral text-xl">${data.degree}</p>
            <p class="text-neutral/60 text-sm mt-3 flex items-center gap-2"><span translate="no" class="material-icons text-base text-primary/70">schedule</span> ${data.period} &bull; ${data.location}</p>
        </div>
        <div class="w-full md:w-64 bg-black/20 p-5 rounded-xl border border-white/5 relative group cursor-default">
            <div class="absolute inset-0 bg-primary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="flex justify-between items-end mb-3 relative z-10">
                <span class="text-xs font-heading text-neutral/50 uppercase tracking-widest font-semibold">Progress</span>
                <span class="text-xl font-bold text-primary font-body">${progress.toFixed(1)}%</span>
            </div>
            <div class="w-full bg-white/10 rounded-full h-2 mb-2 relative z-10 overflow-hidden">
                <div class="bg-gradient-to-r from-primary to-blue-400 h-2 rounded-full transition-all duration-1000 ease-out" style="width: ${progress}%"></div>
            </div>
            <div class="flex justify-between text-xs text-neutral/40 font-body relative z-10">
                <span>${start.getFullYear()}</span>
                <span>${end.getFullYear()}</span>
            </div>
        </div>
    `;

    let yearlyAverages = [];
    let totalSum = 0;
    let totalCount = 0;

    data.years.forEach((yearData, index) => {
        const div = document.createElement('div');
        div.className = 'bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-[0_10px_30px_rgba(0,173,216,0.1)] transition-all duration-300';
        div.style.animation = `float ${3 + index * 0.5}s ease-in-out infinite`;

        let sum = 0;
        let count = 0;

        let rows = yearData.courses.map(course => {
            const sem1 = course.semesters?.find(s => s.semester === 1)?.grade ?? '-';
            const sem2 = course.semesters?.find(s => s.semester === 2)?.grade ?? '-';
            const finalGrade = course.grade ?? '-';

            if (typeof course.grade === 'number') {
                sum += course.grade;
                count++;
            }

            return `
            <tr class="border-t border-white/5 hover:bg-white/10 transition-colors">
                <td class="px-6 py-4 text-sm text-neutral/90 font-medium">${course.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral/60 text-center">${sem1}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral/60 text-center">${sem2}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-primary font-bold text-right">${finalGrade}</td>
            </tr>
            `;
        }).join('');

        let avgHTML = '';
        if (count > 0) {
            const avg = sum / count;
            yearlyAverages.push({ year: yearData.year, avg });
            totalSum += sum;
            totalCount += count;

            avgHTML = `
                <div class="bg-black/20 px-6 py-4 border-t border-white/10 flex items-center justify-between">
                    <span class="text-xs font-heading text-neutral/50 uppercase tracking-widest font-semibold">Year Average</span>
                    <span class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">${avg.toFixed(1)}</span>
                </div>
            `;
        }

        div.innerHTML = `
            <div class="bg-white/5 px-6 py-5 border-b border-white/10 flex items-center justify-between">
                <div>
                    <h3 class="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 font-heading">Year ${yearData.year}</h3>
                    <span class="text-xs text-neutral/50 font-body">Class: ${yearData.class}</span>
                </div>
                <div class="p-2 bg-primary/10 rounded-lg">
                    <span translate="no" class="material-icons text-primary/80 text-2xl block">school</span>
                </div>
            </div>
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-white/10">
                    <thead class="bg-black/20">
                        <tr>
                            <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-neutral/50 uppercase tracking-wider font-heading">Course</th>
                            <th scope="col" class="px-6 py-4 text-center text-xs font-bold text-neutral/50 uppercase tracking-wider font-heading">Sem 1</th>
                            <th scope="col" class="px-6 py-4 text-center text-xs font-bold text-neutral/50 uppercase tracking-wider font-heading">Sem 2</th>
                            <th scope="col" class="px-6 py-4 text-right text-xs font-bold text-neutral/50 uppercase tracking-wider font-heading">Final</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-white/5 bg-transparent">
                        ${rows}
                    </tbody>
                </table>
            </div>
            ${avgHTML}
        `;
        semesters.appendChild(div);
    });

    if (yearlyAverages.length > 0) {
        const overallAvg = (totalSum / totalCount).toFixed(1);

        let barsHTML = yearlyAverages.map(item => {
            const heightPercent = Math.min(100, Math.max(0, item.avg)); // Assuming 0-100 scale
            return `
                <div class="flex flex-col items-center gap-3 group">
                    <div class="h-32 w-10 sm:w-12 bg-black/20 rounded-t-lg relative flex items-end justify-center overflow-hidden border-b border-white/10">
                        <div class="w-full bg-gradient-to-t from-primary/50 to-blue-400/80 transition-all duration-1000 group-hover:from-primary group-hover:to-blue-300" style="height: ${heightPercent}%; border-top-left-radius: 4px; border-top-right-radius: 4px;"></div>
                        <span class="absolute bottom-2 text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-1 py-0.5 rounded backdrop-blur-sm shadow-md">${item.avg.toFixed(1)}</span>
                    </div>
                    <span class="text-xs font-heading text-neutral/50">${item.year}</span>
                </div>
            `;
        }).join('');

        const finalCard = document.createElement('div');
        finalCard.className = 'mt-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_10px_30px_rgba(0,173,216,0.1)]';
        finalCard.innerHTML = `
            <div class="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-tertiary/10 to-transparent rounded-br-full -z-10 pointer-events-none"></div>
            
            <div class="flex-shrink-0 text-center md:text-left">
                <h3 class="text-xl font-bold text-neutral mb-2 font-heading flex items-center justify-center md:justify-start gap-2">
                    <span translate="no" class="material-icons text-tertiary">insights</span>
                    Overall Performance
                </h3>
                <p class="text-sm text-neutral/60 font-body mb-4">Cumulative Grade Average</p>
                <div class="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-tertiary to-blue-400 font-heading">
                    ${overallAvg}
                </div>
            </div>
            
            <div class="flex-grow flex justify-center md:justify-end items-end gap-4 h-full pt-4">
                ${barsHTML}
            </div>
        `;
        semesters.appendChild(finalCard);
    }
}

async function renderCerts() {
    const container = document.getElementById('certs-grid');
    if (!container) return;

    const data = await fetchJson('./data/certs.json');
    if (!data) return;

    data.forEach(cert => {
        const a = document.createElement('a');
        a.href = `cert-detail?id=${cert.id}`;
        a.className = 'block bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:border-primary/50 hover:bg-white/10 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,173,216,0.15)] transition-all duration-300 group cursor-pointer relative overflow-hidden';

        a.innerHTML = `
            <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-tertiary/10 to-transparent rounded-bl-full -z-10 group-hover:from-tertiary/20 transition-colors" ></div>
            <div class="flex justify-between items-start mb-6">
                <div class="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:border-tertiary/30 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.2)] transition-all flex items-center justify-center">
                    <span translate="no" class="material-icons text-2xl text-tertiary">verified</span>
                </div>
                <span class="text-xs font-body px-3 py-1 bg-neutral/10 rounded-full text-neutral/60">${cert.date}</span>
            </div>
            <h3 class="font-bold text-xl text-neutral group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-tertiary group-hover:to-blue-400 transition-all font-heading mb-2">${cert.title}</h3>
            <p class="text-neutral/60 text-sm flex items-center gap-1"><span translate="no" class="material-icons text-sm">apartment</span> ${cert.issuer}</p>
        `;
        container.appendChild(a);
    });
}

window.copyToClipboardAndOpen = async function (text, url) {
    try {
        await navigator.clipboard.writeText(text);
        alert('Validation key copied to clipboard: ' + text);
        window.open(url, '_blank');
    } catch (err) {
        console.error('Failed to copy: ', err);
        window.open(url, '_blank');
    }
};

async function renderCertDetail() {
    const container = document.getElementById('cert-detail-container');
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        container.innerHTML = '<p class="text-red-500">Certification ID not found.</p>';
        return;
    }

    const data = await fetchJson('./data/certs.json');
    if (!data) return;

    const cert = data.find(c => c.id === id);

    if (!cert) {
        container.innerHTML = '<p class="text-red-500">Certification not found.</p>';
        return;
    }

    let formattedDate = cert.date;
    if (cert.date && cert.date.includes('-')) {
        const [y, m, d] = cert.date.split('-');
        const dateObj = new Date(y, m - 1, d);
        formattedDate = dateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    }

    let viewerHTML = '';
    let validateHTML = '';

    if (cert.issuer.toUpperCase() === 'FIAP') {
        const pdfUrl = `https://on.fiap.com.br/local/nanocourses/gerar_certificado.php?chave=${cert.key}&action=view`;
        viewerHTML = `
            <div class="mt-8 mb-8 w-full max-w-5xl mx-auto h-[60vh] min-h-[500px] border border-white/10 rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,173,216,0.15)] bg-white/5 relative">
                <div class="absolute inset-0 flex items-center justify-center -z-10 text-neutral/30 font-body flex-col gap-2">
                    <span translate="no" class="material-icons text-4xl animate-spin">autorenew</span>
                    Loading PDF Viewer...
                </div>
                <iframe src="${pdfUrl}" class="w-full h-full relative z-10 bg-transparent" frameborder="0"></iframe>
            </div>
        `;
        validateHTML = `
            <button onclick="copyToClipboardAndOpen('${cert.key}', 'https://on.fiap.com.br/validar-certificado/')" class="inline-flex items-center gap-2 bg-primary text-secondary px-8 py-3 rounded-xl font-bold hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(0,173,216,0.4)] hover:-translate-y-0.5 transition-all font-heading cursor-pointer">
                <span translate="no" class="material-icons text-xl">content_copy</span>
                Validate Certification
            </button>
        `;
    } else {
        const imgUrl = cert.url || '#';
        viewerHTML = `
            <div class="mt-8 mb-8 w-full max-w-5xl mx-auto border border-white/10 rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,173,216,0.15)] bg-white/5 flex justify-center p-4">
                <img src="${imgUrl}" alt="Certificate for ${cert.title}" class="max-w-full h-auto object-contain max-h-[80vh] rounded-lg" />
            </div>
        `;
    }

    container.innerHTML = `
        <div class="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6 shadow-[0_0_15px_rgba(0,173,216,0.2)]">
            <span translate="no" class="material-icons text-5xl text-primary">workspace_premium</span>
        </div>
        <h1 class="text-3xl font-bold text-neutral mb-2 font-heading">${cert.title}</h1>
        <p class="text-xl text-primary mb-4">${cert.issuer}</p>
        <div class="inline-flex items-center justify-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8">
            <span translate="no" class="material-icons text-sm text-neutral/60">calendar_today</span>
            <span class="text-neutral/80 font-body text-sm">${formattedDate}</span>
        </div>
        
        ${viewerHTML}
        
        ${validateHTML}

        <div class="mt-12">
            <a href="certifications" class="inline-flex items-center gap-2 text-neutral/50 hover:text-primary text-sm transition-colors font-body">
                <span translate="no" class="material-icons text-base">arrow_back</span>
                Back to Certifications
            </a>
        </div>
    `;
}

const GITHUB_USERNAME = 'SgT012003';

async function renderProjects() {
    const loading = document.getElementById('projects-loading');
    const errorMsg = document.getElementById('projects-error');
    const grid = document.getElementById('projects-grid');
    if (!loading || !errorMsg || !grid) return;

    try {
        const blacklist = await fetchJson('./data/blacklist.json') || [];
        const customProjects = await fetchJson('./data/projects.json') || { alias: [], extra: [] };
        const allRepos = await fetchGitHubProjects(GITHUB_USERNAME);

        let repos = allRepos.filter(repo => !blacklist.includes(repo.name));

        repos = repos.map(repo => {
            const aliasObj = customProjects.alias?.find(a => a.alias === repo.name);
            if (aliasObj) {
                return { ...repo, name: aliasObj.title || aliasObj.alias, originalName: repo.name, description: aliasObj.description || repo.description };
            }
            return { ...repo, originalName: repo.name };
        });

        const extras = customProjects.extra || [];
        const allItems = [...repos, ...extras.map(e => ({
            name: e.title,
            description: e.description,
            language: e.stack,
            url: e.url,
            isExtra: true
        }))];

        loading.classList.add('hidden');

        if (allItems.length === 0) {
            errorMsg.textContent = "No projects found.";
            errorMsg.classList.remove('hidden');
            return;
        }

        grid.classList.remove('hidden');

        allItems.forEach(repo => {
            const a = document.createElement('a');

            if (repo.isExtra) {
                a.href = repo.url || '#';
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
            } else {
                a.href = `project-view?repo=${repo.originalName}`;
            }

            a.className = 'flex flex-col bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:border-primary/50 hover:bg-white/10 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,173,216,0.15)] transition-all duration-300 group cursor-pointer h-full relative overflow-hidden';

            const timeHTML = repo.isExtra ? '' : `
                <div class="flex items-center space-x-4 text-xs font-body text-neutral/50 mt-auto pt-4 border-t border-white/10">
                    <span class="flex items-center space-x-2"><span translate="no" class="material-icons text-sm text-primary/70">schedule</span><span>Updated ${new Date(repo.updated_at).toLocaleDateString()}</span></span>
                </div>
            `;

            const nameHTML = repo.isExtra ? `
                <h3 class="font-bold text-xl text-neutral group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-tertiary group-hover:to-blue-400 transition-all font-heading mb-3 flex items-center gap-2">
                    ${repo.name} <span translate="no" class="material-icons text-sm text-neutral/40">open_in_new</span>
                </h3>
            ` : `
                <h3 class="font-bold text-xl text-neutral group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-blue-400 transition-all font-heading mb-3">${repo.name}</h3>
            `;

            a.innerHTML = `
            <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${repo.isExtra ? 'from-tertiary/10 group-hover:from-tertiary/20' : 'from-primary/10 group-hover:from-primary/20'} to-transparent rounded-bl-full -z-10 transition-colors" ></div>
                <div class="flex items-center justify-between mb-6">
                    <div class="p-3 bg-white/5 rounded-xl border border-white/10 ${repo.isExtra ? 'group-hover:border-tertiary/30 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]' : 'group-hover:border-primary/30 group-hover:shadow-[0_0_15px_rgba(0,173,216,0.2)]'} transition-all">
                        <span translate="no" class="material-icons text-3xl ${repo.isExtra ? 'text-tertiary' : 'text-primary'}">${repo.isExtra ? 'link' : 'folder_open'}</span>
                    </div>
                    <span class="text-xs font-body px-3 py-1 ${repo.isExtra ? 'bg-tertiary/10 border-tertiary/20 text-tertiary' : 'bg-primary/10 border-primary/20 text-primary'} border rounded-full">${repo.language || 'Code'}</span>
                </div>
                ${nameHTML}
                <p class="text-neutral/60 text-sm mb-6 flex-grow leading-relaxed">${repo.description || 'No description provided.'}</p>
                ${timeHTML}
        `;
            grid.appendChild(a);
        });

    } catch (e) {
        console.error(e);
        loading.classList.add('hidden');
        errorMsg.classList.remove('hidden');
    }
}

async function renderProjectView() {
    const loading = document.getElementById('readme-loading');
    const errorMsg = document.getElementById('readme-error');
    const content = document.getElementById('readme-content');
    if (!loading || !errorMsg || !content) return;

    const params = new URLSearchParams(window.location.search);
    const repoName = params.get('repo');

    if (!repoName) {
        loading.classList.add('hidden');
        errorMsg.textContent = "Repository not specified.";
        errorMsg.classList.remove('hidden');
        return;
    }

    const githubLink = document.getElementById('github-link');
    if (githubLink) {
        githubLink.href = `https://github.com/${GITHUB_USERNAME}/${repoName}`;
        githubLink.classList.remove('hidden');
    }

    try {
        const markdown = await fetchRepoReadme(GITHUB_USERNAME, repoName);

        loading.classList.add('hidden');

        if (!markdown) {
            errorMsg.classList.remove('hidden');
            return;
        }

        // Use marked.js (included via CDN in HTML) to convert MD to HTML
        content.innerHTML = marked.parse(markdown);

    } catch (e) {
        console.error(e);
        loading.classList.add('hidden');
        errorMsg.classList.remove('hidden');
    }
}


