document.addEventListener('DOMContentLoaded', function () {
    const footerPlaceholder = document.querySelector('.footer-placeholder');
    const footerFilePath = '/index/footer.html';
    fetch(footerFilePath)
        .then(response => response.text())
        .then(data => {
            footerPlaceholder.innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));
});


document.addEventListener('DOMContentLoaded', function () {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const headerFilePath = '/body/header.html';
    fetch(headerFilePath)
        .then(response => response.text())
        .then(data => {
            headerPlaceholder.innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));
});

document.addEventListener('DOMContentLoaded', function () {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    const footerFilePath = '/body/footer.html';
    fetch(footerFilePath)
        .then(response => response.text())
        .then(data => {
            footerPlaceholder.innerHTML = data;
        })
        .catch(error => console.error(error)); 
});

document.addEventListener('DOMContentLoaded', async () => {
    // Lấy tham số action từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('action');

    if (!gameId) {
        console.error('Không có tham số "action" trong URL');
        return;
    }

    try {
        // Gửi yêu cầu để lấy tất cả dữ liệu game từ API
        const response = await fetch('http://127.0.0.1:5000/api/games');
        if (!response.ok) {
            throw new Error('Lỗi khi lấy dữ liệu game từ API: ' + response.statusText);
        }
        const data = await response.json();
        const games = data.games;

        // Tìm game với ID tương ứng
        const game = games.find(game => game.id === parseInt(gameId));

        if (!game) {
            console.error(`Không tìm thấy game với ID: ${gameId}`);
            return;
        }

        // Lấy phần tử nơi bạn muốn hiển thị thông tin game
        const gameDetailsContainer = document.getElementById('game-details-container');
        if (!gameDetailsContainer) {
            console.error('Không tìm thấy phần tử với id "game-details-container"');
            return;
        }
        document.title = `Review Game | ${game.name}`;
        document.getElementById('game-titleBox').innerHTML = `<h1>${game.name}</h1>`;
        document.getElementById('profile-img').src = game.image;
        const developer= document.getElementById('developer');
        developer.textContent = game.auth;
        document.getElementById('game-description').textContent = game.storyline;
        const discordLink = document.getElementById('erolabs-discord');
        discordLink.href = game.discord;

        const videoElement = document.getElementById('game-video');
        const sourceElement = videoElement.querySelector('source');
        if (videoElement && sourceElement) {
            // Cập nhật URL và loại video
            sourceElement.src = game.video;
            sourceElement.type = 'video/webm';  // Sử dụng loại video phù hợp với định dạng webm

            // Cập nhật các thuộc tính của video
            videoElement.controls = true;  // Hiển thị các điều khiển video
            videoElement.autoplay = true;  // Tự động phát video
            videoElement.muted = true;    // Bỏ âm thanh video
            videoElement.playsinline = true;  // Phát video không toàn màn hình trên thiết bị di động

            // Tải lại video để áp dụng các thay đổi
            videoElement.load();
        } else {
            console.error('Phần tử với id "game-video" hoặc "source" không tồn tại.');
        }
        document.getElementById('overview').textContent = game.storyline;

        document.getElementById('storyline').textContent = game.storyline;
        document.getElementById('reviews').textContent = game.reviews;
        document.getElementById('gameplay').textContent = game.gameplay;


    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu game:', error);
    }
});
