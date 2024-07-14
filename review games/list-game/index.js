document.addEventListener('DOMContentLoaded', function () {
    // Chèn nội dung của header vào placeholder
    const headerPlaceholder = document.getElementById('header-placeholder');
    fetch('/body/header.html')
        .then(response => response.text())
        .then(data => {
            headerPlaceholder.innerHTML = data;
        })
        .catch(error => console.error('Error loading header:', error));

    // Chèn nội dung của footer vào placeholder
    const footerPlaceholder = document.getElementById('footer-placeholder');
    fetch('/body/footer.html')
        .then(response => response.text())
        .then(data => {
            footerPlaceholder.innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));

    // Lấy URL của trang hiện tại
    const url = new URL(window.location.href);
    // Lấy giá trị của tham số 'action' từ URL
    const action = url.searchParams.get('action');

    // Lấy các phần tử cần ẩn hiện
    const containers = {
        'NewReleases': document.getElementById('NewReleases'),
        'UpcomingGames': document.getElementById('UpcomingGames'),
        'moba': document.getElementById('moba'),
        'tgm': document.getElementById('tgm'),
        'br': document.getElementById('br'),
        'rpg': document.getElementById('rpg'),
        'st': document.getElementById('st'),
        'ct': document.getElementById('ct'),
        'tt': document.getElementById('tt'),
        'fps': document.getElementById('fps')  // Thêm phần tử fps
    };

    // Ẩn tất cả các phần tử
    Object.values(containers).forEach(container => {
        if (container) container.classList.add('d-none');
    });

    // Hiển thị phần tử tương ứng với hành động trong URL
    if (action && containers[action]) {
        containers[action].classList.remove('d-none');
    }
});

$(document).ready(function() {
    $.getJSON('http://127.0.0.1:5000/api/games', function(data) {
        const today = new Date();
        const twoMonthsFromNow = new Date();
        twoMonthsFromNow.setMonth(today.getMonth() + 2);
        const twoMonthsAgo = new Date();
        twoMonthsAgo.setMonth(today.getMonth() - 2);

        let newReleasesCount = 0;
        let upcomingReleasesCount = 0;

        data.games.forEach(function(game) {
            const releaseDate = new Date(game.date);

            // Hiển thị các trò chơi mới phát hành trong khoảng thời gian từ 2 tháng trước đến hiện tại
            if (releaseDate >= twoMonthsAgo && releaseDate <= today && newReleasesCount < 10) {
                const newReleaseCardHtml = `
                    <div class="col">
                        <a href="/game/game.html?action=${game.id}" class="text-decoration-none">
                            <div class="card h-100">
                                <img src="${game.image}" class="card-img-top" alt="${game.name}">
                                <div class="card-body text-center bg-dark text-white border">
                                    <p class="card-title text-truncate fw-bold">${game.name}</p>
                                    <p class="card-text border rounded">Score: ${game.points}</p>
                                </div>
                            </div>
                        </a>
                    </div>
                `;
                $('#new-releases-container').append(newReleaseCardHtml);
                newReleasesCount++;
            }

            // Hiển thị các trò chơi sắp ra mắt trong khoảng thời gian từ hiện tại đến 2 tháng tới
            if (releaseDate > today && releaseDate <= twoMonthsFromNow && upcomingReleasesCount < 10) {
                const upcomingReleaseCardHtml = `
                    <div class="col">
                        <a href="/game/game.html?action=${game.id}" class="text-decoration-none">
                            <div class="card h-100">
                                <img src="${game.image}" class="card-img-top" alt="${game.name}">
                                <div class="card-body text-center bg-dark text-white border">
                                    <p class="card-title text-truncate fw-bold">${game.name}</p>
                                    <p class="card-text border rounded">${game.date}</p>
                                </div>
                            </div>
                        </a>
                    </div>
                `;
                $('#upcoming-game-container').append(upcomingReleaseCardHtml);
                upcomingReleasesCount++;
            }
            const containers = {
                'fps': $('#fps-container'),
                'tgm': $('#tgm-container'),
                'moba': $('#moba-container'),
                'tt': $('#tt-container'),
                'ct': $('#ct-container'),
                'st': $('#st-container'),
                'rpg': $('#rpg-container'),
                'br': $('#br-container')
            };
            if (game.genre === 'fps' && $('#fps-container').length && containers['fps']) {
                const fpsCardHtml = `
                    <div class="col">
                        <a href="/game/game.html?action=${game.id}" class="text-decoration-none">
                            <div class="card h-100">
                                <img src="${game.image}" class="card-img-top" alt="${game.name}">
                                <div class="card-body text-center bg-dark text-white border">
                                    <p class="card-title text-truncate fw-bold">${game.name}</p>
                                    <p class="card-text border rounded">Score: ${game.points}</p>
                                </div>
                            </div>
                        </a>
                    </div>
                `;
                $('#fps-container').append(fpsCardHtml);
            }

            // Hiển thị các trò chơi thuộc thể loại Thế Giới Mở
            if (game.genre === 'tgm' && $('#tgm-container').length && containers['tgm']) {
                const tgmCardHtml = `
                    <div class="col">
                        <a href="/game/game.html?action=${game.id}" class="text-decoration-none">
                            <div class="card h-100">
                                <img src="${game.image}" class="card-img-top" alt="${game.name}">
                                <div class="card-body text-center bg-dark text-white border">
                                    <p class="card-title text-truncate fw-bold">${game.name}</p>
                                    <p class="card-text border rounded">Score: ${game.points}</p>
                                </div>
                            </div>
                        </a>
                    </div>
                `;
                $('#tgm-container').append(tgmCardHtml);
            }

            // Hiển thị các trò chơi thuộc thể loại MOBA
            if (game.genre === 'moba' && $('#moba-container').length && containers['moba']) {
                const mobaCardHtml = `
                    <div class="col">
                        <a href="/game/game.html?action=${game.id}" class="text-decoration-none">
                            <div class="card h-100">
                                <img src="${game.image}" class="card-img-top" alt="${game.name}">
                                <div class="card-body text-center bg-dark text-white border">
                                    <p class="card-title text-truncate fw-bold">${game.name}</p>
                                    <p class="card-text border rounded">Score: ${game.points}</p>
                                </div>
                            </div>
                        </a>
                    </div>
                `;
                $('#moba-container').append(mobaCardHtml);
            }

            // Hiển thị các trò chơi thuộc thể loại Thể Thao
            if (game.genre === 'tt' && $('#tt-container').length && containers['tt']) {
                const ttCardHtml = `
                    <div class="col">
                        <a href="/game/game.html?action=${game.id}" class="text-decoration-none">
                            <div class="card h-100">
                                <img src="${game.image}" class="card-img-top" alt="${game.name}">
                                <div class="card-body text-center bg-dark text-white border">
                                    <p class="card-title text-truncate fw-bold">${game.name}</p>
                                    <p class="card-text border rounded">Score: ${game.points}</p>
                                </div>
                            </div>
                        </a>
                    </div>
                `;
                $('#tt-container').append(ttCardHtml);
            }

            // Hiển thị các trò chơi thuộc thể loại Chiến Thuật
            if (game.genre === 'ct' && $('#ct-container').length && containers['ct']) {
                const ctCardHtml = `
                    <div class="col">
                        <a href="/game/game.html?action=${game.id}" class="text-decoration-none">
                            <div class="card h-100">
                                <img src="${game.image}" class="card-img-top" alt="${game.name}">
                                <div class="card-body text-center bg-dark text-white border">
                                    <p class="card-title text-truncate fw-bold">${game.name}</p>
                                    <p class="card-text border rounded">Score: ${game.points}</p>
                                </div>
                            </div>
                        </a>
                    </div>
                `;
                $('#ct-container').append(ctCardHtml);
            }

            // Hiển thị các trò chơi thuộc thể loại Sinh Tồn
            if (game.genre === 'st' && $('#st-container').length && containers['st']) {
                const stCardHtml = `
                    <div class="col">
                        <a href="/game/game.html?action=${game.id}" class="text-decoration-none">
                            <div class="card h-100">
                                <img src="${game.image}" class="card-img-top" alt="${game.name}">
                                <div class="card-body text-center bg-dark text-white border">
                                    <p class="card-title text-truncate fw-bold">${game.name}</p>
                                    <p class="card-text border rounded">Score: ${game.points}</p>
                                </div>
                            </div>
                        </a>
                    </div>
                `;
                $('#st-container').append(stCardHtml);
            }

            // Hiển thị các trò chơi thuộc thể loại RPG
            if (game.genre === 'rpg' && $('#rpg-container').length && containers['rpg']) {
                const rpgCardHtml = `
                    <div class="col">
                        <a href="/game/game.html?action=${game.id}" class="text-decoration-none">
                            <div class="card h-100">
                                <img src="${game.image}" class="card-img-top" alt="${game.name}">
                                <div class="card-body text-center bg-dark text-white border">
                                    <p class="card-title text-truncate fw-bold">${game.name}</p>
                                    <p class="card-text border rounded">Score: ${game.points}</p>
                                </div>
                            </div>
                        </a>
                    </div>
                `;
                $('#rpg-container').append(rpgCardHtml);
            }

            // Hiển thị các trò chơi thuộc thể loại Battle Royale
            if (game.genre === 'br' && $('#br-container').length && containers['br']) {
                const brCardHtml = `
                    <div class="col">
                        <a href="/game/game.html?action=${game.id}" class="text-decoration-none">
                            <div class="card h-100">
                                <img src="${game.image}" class="card-img-top" alt="${game.name}">
                                <div class="card-body text-center bg-dark text-white border">
                                    <p class="card-title text-truncate fw-bold">${game.name}</p>
                                    <p class="card-text border rounded">Score: ${game.points}</p>
                                </div>
                            </div>
                        </a>
                    </div>
                `;
                $('#br-container').append(brCardHtml);
            }
        });
    }).fail(function() {
        console.error('Không thể lấy dữ liệu từ API.');
    });
});