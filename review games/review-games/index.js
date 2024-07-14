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

            if (newReleasesCount >= 10 && upcomingReleasesCount >= 10) {
                return false;  // Dừng vòng lặp forEach
            }
        });
    }).fail(function() {
        console.error('Không thể lấy dữ liệu từ API.');
    });
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

// Hàm hiển thị giao diện khi người dùng đã đăng nhập
document.addEventListener('DOMContentLoaded', () => {
    // Khai báo và gán giá trị cho userDataString
    const userDataString = localStorage.getItem('user');

    // Kiểm tra xem dữ liệu có tồn tại không
    if (userDataString) {
        document.querySelector('.header-login').classList.remove('d-none');
        document.querySelector('.header-nologin').classList.add('d-none');
        // Chuyển đổi dữ liệu JSON thành đối tượng JavaScript
        const userData = JSON.parse(userDataString);

        // Lấy phần tử DOM với ID là 'user-info'
        const userInfoElement = document.getElementById('user-info');
        // Đảm bảo phần tử DOM tồn tại trước khi thao tác
        if (userInfoElement) {
            document.getElementById('info_account').textContent = userData.phone;
            userInfoElement.innerHTML = `
                <div class="user-card bg-dark text-light border-primary rounded shadow-lg p-4 hover-shadow">
                    <div class="card-body">
                        <ul class="list-unstyled m-0">
                            <li class="mb-3">
                                <i class="bi bi-phone text-primary"></i> ${userData.phone}
                            </li>
                            <li class="mb-3">
                                <i class="bi bi-cash text-success"></i> ${userData.balance}<strong>VND</strong>
                            </li>
                         
                                <i class="bi bi-trophy text-warning"></i> 
                                <strong>Level:</strong> ${userData.level}
                            </li>
                        </ul>
                    </div>
                </div>
            `;
        } else {
            console.error('Element with ID "user-info" not found.');
        }
    } else {
        document.querySelector('.header-login').classList.add('d-none');
        document.querySelector('.header-nologin').classList.remove('d-none');
        console.log('No user data found.');
    }
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            console.log('Logout button clicked');
            // Xóa dữ liệu user khỏi localStorage
            localStorage.removeItem('user');
            // Hiển thị lại phần tử header-nologin và ẩn phần tử header-login
            document.querySelector('.header-login').classList.add('d-none');
            document.querySelector('.header-nologin').classList.remove('d-none');
        });
    } else {
        console.error('Logout button not found');
    }
});





document.addEventListener('DOMContentLoaded', () => {
    // Tạo đối tượng Collapse cho phần "Thông Tin Người Dùng" và mở nó
    const userInfoCollapse = new bootstrap.Collapse(document.getElementById('user-info'), {
        toggle: true
    });

    // Tạo đối tượng Collapse cho phần "Thông Báo" và mở nó
    const notificationsCollapse = new bootstrap.Collapse(document.getElementById('notifications'), {
        toggle: true
    });
});





$(document).ready(function() {
    // Dữ liệu mẫu
    var data = {
        day: [],   // Danh sách `day` hiện tại
        week: [],  // Danh sách `week` hiện tại
        month: []  // Danh sách `month` hiện tại
    };

    // Hàm cập nhật danh sách dựa trên bộ lọc
    function updateList(filter) {
        var list = $('#filtered-list');
        list.empty();  // Xóa danh sách hiện tại
        data[filter].forEach(function(item) {
            var listItem = $('<li class="d-flex justify-content-between align-items-center mb-2"></li>');
            var span = $('<span class="d-flex align-items-center"></span>');
            span.append('<img src="' + item.img + '" class="me-2" style="height:50px;" alt="">');
            span.append('<p class="mb-0">' + item.name + '</p>');
            listItem.append(span);
            list.append(listItem);
        });
    }

    // Cập nhật danh sách `day` khi trang được tải
    updateList('day');

    // Thay đổi bộ lọc khi người dùng nhấp vào các tùy chọn
    $('.filter-option').click(function() {
        var filter = $(this).data('filter');
        updateList(filter);
        $('.filter-option').removeClass('active');
        $(this).addClass('active');
    });

    // Lấy dữ liệu game từ API và chèn vào danh sách `day`
    $.getJSON('http://127.0.0.1:5000/api/games', function(response) {
        response.games.forEach(function(game) {
            // Tạo một đối tượng game và chèn vào danh sách `day`
            data.day.push({
                name: game.name,
                img: game.image
            });
        });

        // Cập nhật danh sách 'day' sau khi chèn dữ liệu mới
        updateList('day');
    });
});
$(document).ready(function() {
    $.get('http://127.0.0.1:5000/api/news', function(data) {
        var newsHtml = '';
        // Lấy tối đa 2 tin tức đầu tiên
        data.news.slice(0, 2).forEach(function(item) {
            newsHtml += `
                <div class="d-flex gap-3 mb-3 border p-3">
                    <img src="${item.image_url}" class="img-fluid rounded img-thumbnail w-50 h-50" alt="${item.title}">
                    <div>
                        <p class="p-news__post--title mb-1 text-white">
                            ${item.title}
                        </p>
                        <a href="${item.link}" class="btn btn-primary">Xem thêm</a>
                    </div>
                </div>
            `;
        });
        // Chèn vào phần danh sách tin tức
        $('#news-container').html(newsHtml);
    });
});
