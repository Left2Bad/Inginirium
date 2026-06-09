(function() {
    let MIN_DURATION = 300;
    let start = Date.now();
    let onFinish = function() {
        let elapsed = Date.now() - start;
        let remaining = Math.max(0, MIN_DURATION - elapsed);
        setTimeout(function() {
            document.documentElement.classList.add('loaded');
            setTimeout(function() {
            let p = document.getElementById('preloader');
            if (p && p.parentNode) {
                p.parentNode.removeChild(p);
                document.body.classList.add('loaded');
            }
        }, 600);
        }, remaining);
    };
    if (document.readyState === 'complete') {
        onFinish();
    } else {
        window.addEventListener('load', onFinish, {once: true});
        setTimeout(function() {
            if(!document.documentElement.classList.contains('loaded')) {
                onFinish();
            }
        }, 5000);
    }
})();

const items = document.querySelectorAll('.item');

function setItemTransform(item, x, y, lifted = true) {
        const rect = item.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const offsetX = (x - centerX) / centerX;
        const offsetY = (y - centerY) / centerY;
        const rotateY = ((x - centerX) / rect.width) * 12;
        const rotateX = -((y - centerY) / rect.height) * 12;
        const lift = lifted ? -8 : 0;
        item.style.transform = `perspective(900px) translateY(${lift}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
};

function animateLift(element, lift = true) {
    const start = performance.now();
    const duration = 300;

    function frame(time) {
        const progress = Math.min((time - start) / duration, 1);
        const startY = lift ? 0 : -8;
        const endY = lift ? -8 : 0;
        const startShadow = lift ? 0.12 : 0.22;
        const endShadow = lift ? 0.22 : 0.12;

        const y = startY + (endY - startY) * progress;
        const shadow = startShadow + (endShadow - startShadow) * progress;

        element.style.transform = `translateY(${y}px)`;
        element.style.boxShadow = `0 ${4 + 8 * progress}px ${12 + 16 * progress}px rgba(0, 0, 0, ${shadow})`;

        if (progress < 1) {
            requestAnimationFrame(frame);
        }
    }

    requestAnimationFrame(frame);
}

items.forEach((item) => {
    item.addEventListener('mouseenter', () => animateLift(item, true));
    item.addEventListener('mouseleave', () => animateLift(item, false));
    item.addEventListener('mousemove', (event) => {
        const rect = item.getBoundingClientRect();
        setItemTransform(item, event.clientX - rect.left, event.clientY - rect.top, true);
    });
});