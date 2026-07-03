document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Auth guard ---------- */
  const requiredRole = document.body.dataset.role; // 'admin' or 'user'
  const session = window.StackyAuth ? window.StackyAuth.guard(requiredRole) : null;
  if (!session) return;

  document.querySelectorAll('[data-user-name]').forEach(el => el.textContent = session.name);
  document.querySelectorAll('[data-user-email]').forEach(el => el.textContent = session.email);
  document.querySelectorAll('[data-user-role]').forEach(el => el.textContent = session.role);
  document.querySelectorAll('[data-user-initial]').forEach(el => el.textContent = session.name.trim().charAt(0).toUpperCase());

  /* ---------- Logout ---------- */
  document.querySelectorAll('.logout-link').forEach(btn => {
    btn.addEventListener('click', () => window.StackyAuth.logout());
  });

  /* ---------- Sidebar view switching ---------- */
  const links = document.querySelectorAll('.dash-link[data-view]');
  const views = document.querySelectorAll('.dash-view');
  function setView(name) {
    views.forEach(v => v.classList.toggle('active', v.dataset.view === name));
    links.forEach(l => l.classList.toggle('active', l.dataset.view === name));
    const titleEl = document.querySelector(`.dash-link[data-view="${name}"] .label`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.replaceState(null, '', '#' + name);
    const sidebar = document.getElementById('dashSidebar');
    if (sidebar) sidebar.classList.remove('open');
  }
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      setView(link.dataset.view);
    });
  });
  const initial = window.location.hash.replace('#', '') || (links[0] && links[0].dataset.view);
  if (initial) setView(initial);

  /* ---------- Mobile sidebar toggle ---------- */
  const sidebarToggle = document.getElementById('sidebarToggle');
  const dashSidebar = document.getElementById('dashSidebar');
  if (sidebarToggle && dashSidebar) {
    sidebarToggle.addEventListener('click', () => dashSidebar.classList.toggle('open'));
  }

  /* ---------- Animate bar charts ---------- */
  document.querySelectorAll('.bar-chart .bar').forEach(bar => {
    const h = bar.dataset.height || 40;
    requestAnimationFrame(() => { bar.style.height = h + '%'; });
  });

  /* ---------- Animate proj bars ---------- */
  document.querySelectorAll('.proj-bar-fill').forEach(fill => {
    const w = fill.dataset.width || 0;
    requestAnimationFrame(() => { fill.style.width = w + '%'; });
  });

  /* ---------- Message thread selection ---------- */
  document.querySelectorAll('.msg-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.msg-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const nameEl = document.getElementById('threadName');
      if (nameEl) nameEl.textContent = item.querySelector('.n').textContent;
    });
  });
  const msgForm = document.getElementById('msgForm');
  if (msgForm) {
    msgForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = msgForm.querySelector('input');
      if (!input.value.trim()) return;
      const body = document.getElementById('threadBody');
      const bubble = document.createElement('div');
      bubble.className = 'bubble out';
      bubble.textContent = input.value.trim();
      body.appendChild(bubble);
      body.scrollTop = body.scrollHeight;
      input.value = '';
    });
  }

  /* ---------- Settings save -> 404 (no backend wired up yet) ---------- */
  document.querySelectorAll('.settings-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      window.location.href = '404.html';
    });
  });

  /* ---------- Generic filter buttons inside dashboard tables ---------- */
  document.querySelectorAll('.dash-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.filter-group');
      group.querySelectorAll('.dash-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      const targetTable = document.querySelector(btn.dataset.target);
      if (!targetTable) return;
      targetTable.querySelectorAll('tbody tr').forEach(row => {
        row.style.display = (filter === 'all' || row.dataset.status === filter) ? '' : 'none';
      });
    });
  });

  /* ---------- Notification / profile dropdown ---------- */
  document.querySelectorAll('[data-dropdown-toggle]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const menu = document.getElementById(btn.dataset.dropdownToggle);
      document.querySelectorAll('.dropdown-menu.open').forEach(m => { if (m !== menu) m.classList.remove('open'); });
      if (menu) menu.classList.toggle('open');
    });
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-menu.open').forEach(m => m.classList.remove('open'));
  });

});
