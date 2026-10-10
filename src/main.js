// ===== PERSONAL CONFIG =====
// Replace this with your actual GitHub username. Public repos are fetched automatically.
const GITHUB_USERNAME = "YOUR_GITHUB_USERNAME";
const LINKEDIN_URL = "https://www.linkedin.com/in/sharadkumarmishra977";
const EMAIL = "sharad977@gmail.com";
// Add exact repo names here to pin them first. Leave [] to sort by recently updated.
const FEATURED_REPOS = [];
const MAX_REPOS = 60;

const $ = (s) => document.querySelector(s);
const grid = $("#projectsGrid");
const status = $("#repoStatus");
const dialog = $("#repoDialog");
let repos = [];
let activeFilter = "all";
let searchTerm = "";
let readmeCache = new Map();

$("#year").textContent = new Date().getFullYear();
$("#heroGithub").href = `https://github.com/${GITHUB_USERNAME}`;
$("#allReposLink").href = `https://github.com/${GITHUB_USERNAME}?tab=repositories`;
$("#contactGithub").href = `https://github.com/${GITHUB_USERNAME}`;

$("#themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  $("#themeToggle").textContent = document.body.classList.contains("light-mode") ? "☀" : "◐";
});
$("#menuToggle").addEventListener("click", () => $("#nav").classList.toggle("open"));
document.querySelectorAll("#nav a").forEach(a => a.addEventListener("click", () => $("#nav").classList.remove("open")));

const topicsFor = repo => (repo.topics || []).map(x => x.toLowerCase());
function matchesFilter(repo, filter) {
  if (filter === "all") return true;
  const topics = topicsFor(repo).join(" ");
  const text = `${repo.name} ${repo.description || ""} ${repo.language || ""} ${topics}`.toLowerCase();
  const patterns = {
    terraform: /terraform|bicep|iac|infrastructure.?as.?code|pulumi/,
    kubernetes: /kubernetes|k8s|aks|helm|docker|container/,
    cicd: /ci.?cd|pipeline|github.?actions|azure.?devops|jenkins|argocd|gitops/,
    azure: /azure|microsoft.?cloud|aks|bicep/
  };
  return patterns[filter]?.test(text) || false;
}
function escapeHTML(s = "") {
  return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function relativeDate(date) {
  const days = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 86400000));
  if (days === 0) return "today";
  if (days === 1) return "1d ago";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}
function renderRepos() {
  const filtered = repos.filter(r => matchesFilter(r, activeFilter) &&
    `${r.name} ${r.description || ""} ${r.language || ""} ${(r.topics || []).join(" ")}`.toLowerCase().includes(searchTerm));
  $("#repoCount").textContent = `${filtered.length} ${filtered.length === 1 ? "repository" : "repositories"} shown`;
  if (!filtered.length) {
    grid.innerHTML = `<div class="empty-state">No repositories match this filter. Try another category or search term.</div>`;
    return;
  }
  grid.innerHTML = filtered.map((r, i) => `
    <article class="project-card" tabindex="0" role="button" aria-label="Open ${escapeHTML(r.name)} details" data-repo="${escapeHTML(r.name)}" style="animation-delay:${Math.min(i,8)*45}ms">
      <div class="project-top"><span class="repo-glyph">⌘</span><span class="repo-visibility">${r.fork ? "FORK" : "PUBLIC REPO"}</span></div>
      <h3>${escapeHTML(r.name.replace(/[-_]/g, " "))}</h3>
      <p>${escapeHTML(r.description || "Explore the source code and project documentation on GitHub.")}</p>
      <div class="project-tags">${(r.topics || []).slice(0,3).map(t=>`<span>${escapeHTML(t)}</span>`).join("")}</div>
      <div class="project-bottom"><span class="language">${r.language ? `<i class="language-dot"></i>${escapeHTML(r.language)}` : "Open source"}</span><span class="repo-stats"><span>★ ${r.stargazers_count}</span><span>⑂ ${r.forks_count}</span><span>${relativeDate(r.updated_at)}</span></span></div>
    </article>`).join("");
  grid.querySelectorAll(".project-card").forEach(card => {
    const open = () => showRepo(card.dataset.repo);
    card.addEventListener("click", open);
    card.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
  });
}
async function loadRepos() {
  if (!GITHUB_USERNAME || GITHUB_USERNAME === "YOUR_GITHUB_USERNAME") {
    status.innerHTML = `Setup needed: open <code>src/main.js</code> and set <code>GITHUB_USERNAME</code> to your GitHub username.`;
    grid.innerHTML = `<div class="empty-state">Your project cards will appear here automatically after you configure your GitHub username.</div>`;
    $("#repoCount").textContent = "Awaiting GitHub username";
    return;
  }
  try {
    const response = await fetch(`https://api.github.com/users/${encodeURIComponent(GITHUB_USERNAME)}/repos?per_page=100&sort=updated&type=owner`);
    if (!response.ok) throw new Error(response.status === 404 ? "GitHub username not found." : `GitHub API returned ${response.status}. Try again later.`);
    const data = await response.json();
    repos = data.filter(r => !r.private).sort((a,b) => {
      const ai = FEATURED_REPOS.indexOf(a.name), bi = FEATURED_REPOS.indexOf(b.name);
      if (ai !== -1 || bi !== -1) return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
      return new Date(b.updated_at) - new Date(a.updated_at);
    }).slice(0, MAX_REPOS);
    status.textContent = `Loaded ${repos.length} public repositories from GitHub · Updated live`;
    renderRepos();
  } catch (error) {
    status.textContent = `${error.message} You can still visit the GitHub profile directly.`;
    grid.innerHTML = `<div class="empty-state">Could not load repositories right now. Check your connection, GitHub username, or API rate limit.<br><br><a class="text-link" href="https://github.com/${encodeURIComponent(GITHUB_USERNAME)}" target="_blank" rel="noreferrer">Open GitHub profile ↗</a></div>`;
  }
}
document.querySelectorAll(".filter-chip").forEach(btn => btn.addEventListener("click", () => {
  document.querySelectorAll(".filter-chip").forEach(b => b.classList.remove("active"));
  btn.classList.add("active"); activeFilter = btn.dataset.filter; renderRepos();
}));
$("#projectSearch").addEventListener("input", e => { searchTerm = e.target.value.toLowerCase().trim(); renderRepos(); });

function simpleMarkdown(md) {
  // Minimal safe README preview: escape HTML first, then format a few Markdown constructs.
  let s = escapeHTML(md.slice(0, 9000));
  s = s.replace(/^### (.*)$/gm, "<b>$1</b>").replace(/^## (.*)$/gm, "<b>$1</b>").replace(/^# (.*)$/gm, "<b>$1</b>");
  s = s.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>").replace(/`([^`]+)`/g, "<code>$1</code>");
  s = s.replace(/^\s*[-*]\s+(.*)$/gm, "• $1").replace(/\n{2,}/g, "\n\n");
  return s;
}
async function showRepo(name) {
  const repo = repos.find(r => r.name === name);
  if (!repo) return;
  $("#dialogContent").innerHTML = `<span class="section-index">GITHUB REPOSITORY</span><h2>${escapeHTML(repo.name)}</h2><p>${escapeHTML(repo.description || "No repository description added yet.")}</p><div class="project-tags">${(repo.topics||[]).map(t=>`<span>${escapeHTML(t)}</span>`).join("")}</div><p>Language: ${escapeHTML(repo.language || "Not specified")} · ★ ${repo.stargazers_count} · Updated ${new Date(repo.updated_at).toLocaleDateString()}</p><h3>README preview</h3><pre>Loading README…</pre><div class="dialog-actions"><a class="button button-primary" href="${escapeHTML(repo.html_url)}" target="_blank" rel="noreferrer">View source on GitHub ↗</a>${repo.homepage ? `<a class="button button-outline" href="${escapeHTML(repo.homepage)}" target="_blank" rel="noreferrer">Live demo ↗</a>` : ""}</div>`;
  dialog.showModal();
  try {
    let readme = readmeCache.get(name);
    if (!readme) {
      const response = await fetch(`https://api.github.com/repos/${encodeURIComponent(GITHUB_USERNAME)}/${encodeURIComponent(name)}/readme`, {headers:{Accept:"application/vnd.github.raw+json"}});
      if (!response.ok) throw new Error("No README available.");
      readme = await response.text();
      readmeCache.set(name, readme);
    }
    if (dialog.open && $("#dialogContent h2")?.textContent === repo.name) {
      $("#dialogContent pre").innerHTML = simpleMarkdown(readme);
    }
  } catch {
    const pre = $("#dialogContent pre");
    if (pre) pre.textContent = "README preview is not available for this repository. Open the source on GitHub to read the documentation.";
  }
}
$("#dialogClose").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", e => { if (e.target === dialog) dialog.close(); });

const commandHelp = `Available commands:
  help       Show this command list
  about      About Sharad
  skills     Core technology areas
  projects   Scroll to GitHub projects
  experience Show career summary
  contact    Show contact links
  linkedin   Open LinkedIn profile
  github     Open GitHub profile
  clear      Clear terminal output`;
function terminalPrint(html) {
  const p = document.createElement("p"); p.innerHTML = html;
  $("#terminalOutput").appendChild(p); $("#terminalOutput").scrollTop = $("#terminalOutput").scrollHeight;
}
$("#terminalForm").addEventListener("submit", e => {
  e.preventDefault();
  const input = $("#terminalInput"); const cmd = input.value.trim().toLowerCase(); if (!cmd) return;
  terminalPrint(`<span class="terminal-green">visitor@portfolio:~$</span> ${escapeHTML(cmd)}`); input.value = "";
  const outputs = {
    help: () => commandHelp.split("\n").map(line => `<span class="terminal-muted">${escapeHTML(line)}</span>`).join("<br>"),
    about: () => "Sharad Kumar Mishra — Senior DevOps Engineer & Azure Cloud Architect. 16+ years in IT, with 7+ years hands-on Azure experience.",
    skills: () => "Azure · AKS · Terraform · Bicep · GitHub Actions · Azure DevOps · GitOps · Docker · Helm · DevSecOps · Observability · PowerShell · Python · GenAI POCs",
    projects: () => { $("#projects").scrollIntoView({behavior:"smooth"}); return "Opening the GitHub projects section…"; },
    experience: () => "Current: Sr. DevOps Engineer & GenAI at Reliance Industries Ltd. Previous: Azure Cloud Engineer; Senior IT Network Admin Engineer; IT/network support roles.",
    contact: () => `Email: ${EMAIL} · Location: Noida, India`,
    linkedin: () => { window.open(LINKEDIN_URL,"_blank","noopener,noreferrer"); return "Opening LinkedIn profile…"; },
    github: () => { window.open(`https://github.com/${GITHUB_USERNAME}`,"_blank","noopener,noreferrer"); return "Opening GitHub profile…"; },
    clear: () => { $("#terminalOutput").innerHTML = ""; return null; }
  };
  if (outputs[cmd]) { const result = outputs[cmd](); if (result) terminalPrint(typeof result === "string" && result.includes("<br>") ? result : escapeHTML(result)); }
  else terminalPrint(`<span style="color:#fca5a5">Command not found:</span> ${escapeHTML(cmd)}. Type <b>help</b> to see available commands.`);
});
$("#clearTerminal").addEventListener("click", () => { $("#terminalOutput").innerHTML = ""; });
loadRepos();