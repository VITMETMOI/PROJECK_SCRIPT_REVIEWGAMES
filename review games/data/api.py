import requests
from bs4 import BeautifulSoup
import sqlite3
from flask import Flask, jsonify, request
from flask_cors import CORS

# Tạo đối tượng Flask và bật CORS
app = Flask(__name__)
CORS(app)

# Kết nối cơ sở dữ liệu SQLite
def get_connection():
    conn = sqlite3.connect('data/data.db')
    conn.row_factory = sqlite3.Row
    return conn

# Tạo các bảng trong cơ sở dữ liệu
def create_tables():
    conn = get_connection()
    cursor = conn.cursor()
    
    # Các bảng hiện có
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            phone TEXT PRIMARY KEY, 
            username TEXT, 
            password TEXT, 
            balance REAL DEFAULT 200000.0, 
            level INTEGER DEFAULT 1
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS games (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            name TEXT, 
            image TEXT, 
            points TEXT,
            genre TEXT,
            auth TEXT,
            video TEXT,
            date TEXT,
            discord TEXT,
            storyline TEXT,
            gameplay TEXT,
            graphics TEXT,
            reviews TEXT
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS forums (
            id_forum INTEGER PRIMARY KEY AUTOINCREMENT,
            members INTEGER
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS messenger (
            phone_number TEXT PRIMARY KEY
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id_message INTEGER PRIMARY KEY AUTOINCREMENT,
            phone_number TEXT,
            id_forum INTEGER,
            mess TEXT,
            time TEXT,
            FOREIGN KEY (phone_number) REFERENCES messenger(phone_number),
            FOREIGN KEY (id_forum) REFERENCES forums(id_forum)
        )
    ''')

    # Bảng mới để lưu trữ thông tin tin tức
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS news (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            link TEXT,
            image_url TEXT,
            description TEXT,
            category TEXT,
            time_info TEXT
        )
    ''')
    
    conn.close()

# Hàm để lưu dữ liệu vào bảng tin tức
def save_news_data(items):
    conn = get_connection()
    cursor = conn.cursor()
    
    for item in items:
        # Kiểm tra xem tin tức đã tồn tại chưa dựa trên link
        cursor.execute('SELECT * FROM news WHERE link = ?', (item['link'],))
        if cursor.fetchone() is None:  # Nếu tin tức chưa tồn tại
            cursor.execute('''
                INSERT INTO news (title, link, image_url, description, category, time_info) 
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (item['title'], item['link'], item['img_url'], item['description'], item['category'], item['time_info']))
    
    conn.commit()
    conn.close()

# Hàm thu thập dữ liệu từ trang web GameK.vn
def scrape_data():
    url = 'https://gamek.vn/'
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        ul_element = soup.find('ul', {'id': 'fistUpload1'})
        items = []
        if ul_element:
            li_elements = ul_element.find_all('li')
            for li in li_elements:
                title = li.find('h3').text.strip()
                link = li.find('a')['href']
                img_url = li.find('img')['src']
                description = li.find('p').text.strip()
                category = li.find('span', {'class': 'pb_top'}).text.strip() if li.find('span', {'class': 'pb_top'}) else 'Chưa có danh mục'
                time_info = li.find('p', {'class': 'time'}).text.strip()
                items.append({
                    'title': title,
                    'link': url + link,  # Thêm URL gốc vào link để có liên kết đầy đủ
                    'img_url': img_url,
                    'description': description,
                    'category': category,
                    'time_info': time_info
                })
        save_news_data(items)
    else:
        print(f'Yêu cầu không thành công. Mã trạng thái: {response.status_code}')

# Các hàm để quản lý người dùng và trò chơi
def add_user(phone, username, password, balance=200000.0, level=1):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE phone = ?', (phone,))
    if cursor.fetchone() is not None:
        conn.close()
        raise ValueError("Số điện thoại đã tồn tại")
    cursor.execute('''
        INSERT INTO users (phone, username, password, balance, level) 
        VALUES (?, ?, ?, ?, ?)
    ''', (phone, username, password, balance, level))
    conn.commit()
    conn.close()

def add_game(name, image, points='', genre='', auth='', video='', date='', discord='', storyline='', gameplay='', graphics='', reviews=''):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO games (name, image, points, genre, auth, video, date, discord, storyline, gameplay, graphics, reviews) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (name, image, points, genre, auth, video, date, discord, storyline, gameplay, graphics, reviews))
    game_id = cursor.lastrowid
    conn.commit()
    cursor.execute('''
        INSERT INTO forums (id_forum, members) VALUES (?, 0)
    ''', (game_id,))
    conn.commit()
    conn.close()

def get_all_games():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM games')
    rows = cursor.fetchall()
    games = [{
        "id": row['id'], "name": row['name'], "image": row['image'], "points": row['points'],
        "genre": row['genre'], "auth": row['auth'], "video": row['video'], "date": row['date'],
        "discord": row['discord'], "storyline": row['storyline'], "gameplay": row['gameplay'],
        "graphics": row['graphics'], "reviews": row['reviews']
    } for row in rows]
    conn.close()
    return games

def create_forum(forum_id, members):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO forums (id_forum, members) VALUES (?, ?)
    ''', (forum_id, members))
    conn.commit()
    conn.close()

def add_messenger(phone_number):
    conn = get_connection()
    cursor = conn.cursor()
    
    # Kiểm tra xem số điện thoại đã tồn tại hay chưa
    cursor.execute('SELECT * FROM messenger WHERE phone_number = ?', (phone_number,))
    if cursor.fetchone() is None:
        cursor.execute('''
            INSERT INTO messenger (phone_number) VALUES (?)
        ''', (phone_number,))
        conn.commit()
    
    conn.close()

def add_message(forum_id, phone_number, mess, time):
    conn = get_connection()
    cursor = conn.cursor()

    # Thêm thông tin người gửi nếu chưa có
    add_messenger(phone_number)

    # Thêm tin nhắn vào bảng messages
    cursor.execute('''
        INSERT INTO messages (phone_number, id_forum, mess, time) 
        VALUES (?, ?, ?, ?)
    ''', (phone_number, forum_id, mess, time))
    conn.commit()
    conn.close()

# Định nghĩa các route của API
@app.route('/api/users', methods=['GET'])
def get_users():
    conn = get_connection()
    users = conn.execute('SELECT * FROM users').fetchall()
    conn.close()
    return jsonify({'users': [dict(user) for user in users]})

@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.get_json()
    phone = data.get('phone')
    username = data.get('username')
    password = data.get('password')
    
    if not phone or not username or not password:
        return jsonify({'error': 'Thiếu thông tin cần thiết'}), 400
    
    try:
        add_user(phone, username, password)
        return jsonify({'message': 'Người dùng đã được tạo thành công'}), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Lỗi khi tạo người dùng'}), 500

@app.route('/api/games', methods=['GET'])
def get_games():
    games = get_all_games()
    return jsonify({"games": games})

@app.route('/api/games', methods=['POST'])
def create_game():
    data = request.get_json()
    name = data.get('name')
    image = data.get('image')
    points = data.get('points', '')
    genre = data.get('genre', '')
    auth = data.get('auth', '')
    video = data.get('video', '')
    date = data.get('date', '')
    discord = data.get('discord', '')
    storyline = data.get('storyline', '')
    gameplay = data.get('gameplay', '')
    graphics = data.get('graphics', '')
    reviews = data.get('reviews', '')

    if not all([name, image]):
        return jsonify({'error': 'Thiếu thông tin cần thiết'}), 400

    try:
        add_game(name, image, points, genre, auth, video, date, discord, storyline, gameplay, graphics, reviews)
        return jsonify({'message': 'Trò chơi đã được tạo thành công'}), 201
    except Exception as e:
        return jsonify({'error': 'Lỗi khi tạo trò chơi'}), 500

@app.route('/api/news', methods=['GET'])
def get_news():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM news')
    rows = cursor.fetchall()
    conn.close()
    news_list = [{
        "id": row['id'], "title": row['title'], "link": row['link'], "image_url": row['image_url'],
        "description": row['description'], "category": row['category'], "time_info": row['time_info']
    } for row in rows]
    return jsonify({"news": news_list})


@app.route('/api/forums', methods=['GET'])
def get_forums_endpoint():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM forums')
    forums = cursor.fetchall()
    conn.close()
    return jsonify({'forums': [dict(forum) for forum in forums]})

# API để lấy tất cả các tin nhắn
@app.route('/api/forums/<int:forum_id>/messages', methods=['GET'])
def get_messages(forum_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM messages WHERE id_forum = ?', (forum_id,))
    rows = cursor.fetchall()
    columns = [column[0] for column in cursor.description]
    messages = [dict(zip(columns, row)) for row in rows]
    conn.close()
    return jsonify({'messages': messages})

# API để thêm tin nhắn
@app.route('/api/forums/<int:forum_id>/messages', methods=['POST'])
def add_message_to_forum(forum_id):
    data = request.get_json()
    phone_number = data.get('phone_number')
    mess = data.get('mess')
    time = data.get('time')

    if not phone_number or not mess or not time:
        return jsonify({'error': 'Thiếu thông tin cần thiết'}), 400

    try:
        add_message(forum_id, phone_number, mess, time)
        return jsonify({'message': 'Tin nhắn đã được thêm thành công'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
# Tạo bảng khi khởi động ứng dụng
create_tables()

# Thu thập dữ liệu khi khởi động ứng dụng
scrape_data()

# Chạy ứng dụng Flask
if __name__ == '__main__':
    app.run(debug=True)
