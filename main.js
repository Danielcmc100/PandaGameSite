// Ativa o link da navegação correspondente à página atual
window.onload = function () {
    const navLinks = document.querySelectorAll('nav a');
    const path = window.location.pathname.split('/').pop();
    navLinks.forEach(link => {
        if (link.getAttribute('href') === path) {
            link.classList.add('active');
        }
    });

    // Process sprite sheets: show only the first frame for images marked with .sheet
    document.querySelectorAll('img.sheet').forEach(img => {
        if (img.complete) {
            cropToFirstFrame(img);
        } else {
            img.addEventListener('load', () => cropToFirstFrame(img));
        }
    });

    // Apply pixelated rendering to enemy sprites or elements with .pixel-enemy
    document.querySelectorAll('img.pixel-enemy, img.sprite-img').forEach(img => {
        // if path contains /Enemy/ or the element explicitly requests pixelation
        try {
            const src = img.getAttribute('src') || '';
            if (src.includes('/Enemy/') || img.classList.contains('pixel-enemy')) {
                img.classList.add('pixelated');
                // prefer showing at natural size for crisp pixels when possible
                // but don't override responsive rules; only set CSS property
            }
        } catch (e) {
            // ignore
        }
    });
};

function cropToFirstFrame(img) {
    // If image is wider than tall, assume horizontal sprite sheet and crop to first frame
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    if (!w || !h) return;

    // If width equals height or width < height, likely single frame - no cropping needed
    if (w <= h) {
        // still make pixelated for pixel-art
        img.classList.add('pixelated');
        return;
    }

    // Estimate number of frames assuming square frames horizontally
    const frames = Math.round(w / h) || 1;
    const frameWidth = Math.floor(w / frames);

    // Create wrapper and apply cropping
    const wrapper = document.createElement('div');
    wrapper.className = 'sprite-frame';
    wrapper.style.width = frameWidth + 'px';
    wrapper.style.height = h + 'px';

    // Ensure the image keeps original pixel rendering
    img.classList.add('pixelated');
    img.style.width = w + 'px';
    img.style.height = h + 'px';
    img.style.left = '0px';
    img.style.top = '0px';

    // Insert wrapper and move img inside it
    img.parentNode.insertBefore(wrapper, img);
    wrapper.appendChild(img);
}