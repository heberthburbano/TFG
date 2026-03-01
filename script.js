document.addEventListener('DOMContentLoaded', () => {
    // --- Dark Mode Logic ---
    const themeToggle = document.getElementById('theme-toggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    const body = document.body;

    const toggleTheme = () => {
        const isDark = body.getAttribute('data-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // Update icons
        const icons = [themeToggle.querySelector('i'), mobileThemeToggle.querySelector('i')];
        icons.forEach(icon => {
            icon.className = isDark ? 'fa fa-moon' : 'fa fa-sun';
        });
    };

    themeToggle.addEventListener('click', toggleTheme);
    mobileThemeToggle.addEventListener('click', toggleTheme);

    // Initial theme check
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        themeToggle.querySelector('i').className = 'fa fa-sun';
        mobileThemeToggle.querySelector('i').className = 'fa fa-sun';
    }

    // --- Mobile Sidebar Toggle ---
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');

    hamburger.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        const isOpen = sidebar.classList.contains('open');
        const icon = hamburger.querySelector('i');
        icon.className = isOpen ? 'fa fa-xmark' : 'fa fa-bars';
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close sidebar on item click (mobile)
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
                hamburger.querySelector('i').className = 'fa fa-bars';
                document.body.style.overflow = '';
            }
        });
    });

    // --- Active Scroll Logic ---
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            // When we scroll past sectionTop - 200, we consider it the current section
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        // Specific fix to ensure bottom section is selectable if page ends
        if (window.innerHeight + scrollY >= document.body.offsetHeight - 50) {
            if (sections.length > 0) {
                current = sections[sections.length - 1].getAttribute('id');
            }
        }

        navItems.forEach(item => {
            item.classList.remove('active');
            if (current && item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

    // --- Search Logic ---
    const searchInputs = [document.getElementById('search-input'), document.getElementById('mobile-search-input')];

    searchInputs.forEach(input => {
        if (!input) return;
        input.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();

            // Sync inputs 
            searchInputs.forEach(otherInput => {
                if (otherInput && otherInput !== input) {
                    otherInput.value = e.target.value;
                }
            });

            sections.forEach(section => {
                const text = section.innerText.toLowerCase();
                const matches = text.includes(term);
                section.style.display = matches ? 'block' : 'none';
            });
        });
    });

    // --- Entrance Animations ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
});
