document.addEventListener('DOMContentLoaded', function () {
    // Nạp nội dung header và footer
    const loadHTML = (placeholderId, filePath) => {
        const placeholder = document.getElementById(placeholderId);
        fetch(filePath)
            .then(response => response.text())
            .then(data => {
                placeholder.innerHTML = data;
            })
            .catch(error => console.error('Error loading:', error));
    };

    loadHTML('header-placeholder', '/body/header.html');
    loadHTML('footer-placeholder', '/body/footer.html');

    // Gọi fetchMessages với forumId = 1
    fetchMessages(1);

    // Xử lý sự kiện gửi tin nhắn
    document.getElementById('message-form').addEventListener('submit', function(e) {
        e.preventDefault(); // Ngăn chặn việc gửi form và tải lại trang

        const messageInput = e.target.message;
        const message = messageInput.value.trim();  // Loại bỏ khoảng trắng thừa ở đầu và cuối

        if (!message) {
            alert('Vui lòng nhập tin nhắn');
            return;
        }

        const phoneNumber = '0378911629'; 
        const forumId = 1; 
        const time = new Date().toLocaleTimeString();

        const data = {
            phone_number: phoneNumber,
            mess: message,
            time: time
        };

        fetch(`http://127.0.0.1:5000/api/forums/${forumId}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(() => {
            // Gọi hàm fetchMessages để cập nhật tin nhắn
            fetchMessages(forumId);
            messageInput.value = '';  // Xóa nội dung ô nhập tin nhắn sau khi gửi
        })
        .catch(error => {
            alert('Lỗi: ' + error.message);
        });
    });
});

// Hàm fetchMessages để lấy tin nhắn từ API
function fetchMessages(forumId) {
    const userDataString = localStorage.getItem('user');
    if (!userDataString) {
        console.error('Không tìm thấy dữ liệu người dùng.');
        return;
    }

    const userData = JSON.parse(userDataString);
    const userPhone = userData.phone;
    const botPhoneNumber = '100010000';  // Số điện thoại của bot

    fetch(`http://127.0.0.1:5000/api/forums/${forumId}/messages`)
        .then(response => response.json())
        .then(data => {
            console.log(data);  // Kiểm tra dữ liệu tin nhắn
            if (!data.messages) {
                throw new Error('Không có tin nhắn nào.');
            }
            const chatContainer = document.querySelector('.chat-container');

            // Lưu vị trí hiện tại của cuộn
            const scrollPosition = chatContainer.scrollTop;

            // Xóa các tin nhắn hiện tại
            chatContainer.innerHTML = '';

            data.messages.forEach(message => {
                let userType = message.phone_number === botPhoneNumber ? 'bot' :
                               message.phone_number === userPhone ? 'me' : 'otherUser';

                console.log(`Adding message: ${message.mess} (userType: ${userType})`);  // Kiểm tra loại tin nhắn
                addMessage(userType, message.mess, message.time);
            });

            // Nếu người dùng đã cuộn đến đáy trước khi tải tin nhắn mới, giữ cuộn ở đáy
            if (scrollPosition + chatContainer.clientHeight >= chatContainer.scrollHeight) {
                chatContainer.scrollTop = chatContainer.scrollHeight;  // Cuộn xuống tin nhắn mới nhất
            }
        })
        .catch(error => {
            console.error('Error fetching messages:', error);
        });
}

// Hàm addMessage để thêm tin nhắn vào giao diện
function addMessage(userType, messageContent, time) {
    const chatContainer = document.querySelector('.chat-container');  // Đảm bảo bạn có một container cho tất cả các tin nhắn

    const messageTypes = {
        bot: `
            <div class="mb-3 message-user-not-me">
                <div class="d-flex align-items-start">
                    <img src="https://via.placeholder.com/30" class="rounded-circle me-2" style="width: 30px; height: 30px;" alt="BOT">
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <p class="mb-0">BOT TIN TỨC</p>
                        </div>
                        <div class="p-3 border rounded text-white">
                            <p class="mb-0">${messageContent}</p>
                            <small class="text-muted">${time}</small>
                        </div>
                    </div>
                </div>
            </div>
        `,
        otherUser: `
            <div class="mb-3 message-user-not-me">
                <div class="d-flex align-items-start">
                    <img src="https://via.placeholder.com/30" class="rounded-circle me-2" style="width: 30px; height: 30px;" alt="Other User">
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <p class="mb-0">OTHER USER</p>
                        </div>
                        <div class="p-3 border rounded text-white">
                            <p class="mb-0">${messageContent}</p>
                            <small class="message-time">${time}</small>
                        </div>
                    </div>
                </div>
            </div>
        `,
        me: `
            <div class="mb-3 message-user-me">
                <div class="d-flex flex-column align-items-end">
                    <div class="p-2 border rounded text-white message">
                        <p class="mb-0">${messageContent}</p>
                        <small class="message-time">${time}</small>
                    </div>
                </div>
            </div>
        `
    };

    chatContainer.innerHTML += messageTypes[userType] || messageTypes.me;  // Thêm tin nhắn vào container
    chatContainer.scrollTop = chatContainer.scrollHeight;  // Luôn cuộn xuống tin nhắn mới nhất
}
