(function() {
	'use strict';

	if (typeof window === 'undefined') return;

	// Check if popup should be shown (only once per session)
	if (sessionStorage.getItem('taxiPopupShown')) return;

	let pageLoadTime = Date.now();
	let scrollTriggered = false;

	function calculateScrollPercentage() {
		const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
		if (scrollHeight === 0) return 0;
		return (window.scrollY / scrollHeight) * 100;
	}

	function shouldShowPopup() {
		const timeOnPage = (Date.now() - pageLoadTime) / 1000; // seconds
		const scrollPercent = calculateScrollPercentage();

		// Show if time >= 8 seconds OR scroll >= 40%
		return timeOnPage >= 8 || scrollPercent >= 40;
	}

	function createSafePopup() {
		// Mark popup as shown in session
		sessionStorage.setItem('taxiPopupShown', 'true');

		if (document.getElementById('safeTaxiPopup')) return;

		const popup = document.createElement('div');
		popup.id = 'safeTaxiPopup';
		popup.innerHTML = `
                <div style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.5);
                    z-index: 99999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: system-ui, -apple-system, sans-serif;
                    padding: 16px;
                " onclick="if(event.target === this) this.parentElement.remove()">
                    <div style="
                        background: white;
                        padding: 30px;
                        border-radius: 15px;
                        max-width: 400px;
                        width: 100%;
                        text-align: center;
                        box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
                    ">
                        <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 15px; gap: 10px;">
                            <img src="location.svg" width="24" height="24" style="border-radius: 50%;">
                            <h3 style="color: #000; margin: 0; font-size: 20px; font-weight: bold; white-space: nowrap;">TÌM THẤY XE GẦN BẠN</h3>
                            <img src="location.svg" width="24" height="24" style="border-radius: 50%;">
                        </div>
                        <p style="color: #6b7280; margin-bottom: 25px; font-size: 16px;">Tài xế có thể đón bạn trong 5 phút</p>
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            <a href="tel:0559596767" onclick="return gtag_report_conversion('tel:0559596767')" style="
                                background: #ef4444;
                                color: white;
                                padding: 12px 16px;
                                text-decoration: none;
                                border-radius: 8px;
                                font-weight: 600;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                gap: 8px;
                                font-size: 14px;
                                white-space: nowrap;
                            ">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                </svg>
                                Gọi Ngay: 0559 59 6767
                            </a>
                            <button onclick="this.closest('div').parentElement.remove()" style="
                                background: #e5e7eb;
                                color: #333;
                                padding: 12px 16px;
                                border: none;
                                border-radius: 8px;
                                font-weight: 600;
                                cursor: pointer;
                                font-size: 14px;
                            ">Đóng</button>
                        </div>
                    </div>
                </div>
            `;

		if (document.body) {
			document.body.appendChild(popup);
		}
	}

	function initPopupTrigger() {
		// Check immediately on load in case page is already scrolled
		if (shouldShowPopup()) {
			createSafePopup();
			return;
		}

		// Listen for scroll events
		let scrollTimeout;
		window.addEventListener('scroll', function() {
			clearTimeout(scrollTimeout);
			scrollTimeout = setTimeout(function() {
				if (!sessionStorage.getItem('taxiPopupShown') && shouldShowPopup()) {
					createSafePopup();
				}
			}, 100);
		}, { passive: true });

		// Check every 500ms until conditions are met (max 30 seconds)
		const checkInterval = setInterval(function() {
			if (!sessionStorage.getItem('taxiPopupShown') && shouldShowPopup()) {
				clearInterval(checkInterval);
				createSafePopup();
			}
		}, 500);

		// Clear interval after 30 seconds to avoid continuous checks
		setTimeout(function() {
			clearInterval(checkInterval);
		}, 30000);
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initPopupTrigger);
	} else {
		initPopupTrigger();
	}
})();