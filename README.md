# 🚀 KKU Classroom Feed App

แอปพลิเคชันโพสต์สถานะและจัดการสมาชิกชั้นเรียน  
พัฒนาโดย **React Native (Expo + TypeScript)**  
เชื่อมต่อกับ API ของระบบ **CIS KKU Classroom**

---

## Screenshots


| Screenshot 1 | Screenshot 2 | Screenshot 3 |
|--------------|--------------|--------------|
| (./assets/screenshot/IMG_5119.PNG) | (./assets/screenshot/IMG_5120.PNG) | (./assets/screenshot/IMG_5121.PNG) |

| Screenshot 4 | Screenshot 5 | Screenshot 6 |
|--------------|--------------|--------------|
| (./assets/screenshot/IMG_5122.PNG) | (./assets/screenshot/IMG_5123.PNG) | (./assets/screenshot/IMG_5124.PNG) |
| Screenshot 7 | Screenshot 8 | Screenshot 9 |
|--------------|--------------|--------------|
| (./assets/screenshot/IMG_5125.PNG) | (./assets/screenshot/IMG_5126.PNG) | (./assets/screenshot/IMG_5127.PNG) |
| Screenshot 10 | Screenshot 11 
|--------------|--------------|--------------|
| (./assets/screenshot/IMG_5128.PNG) | (./assets/screenshot/IMG_5129.PNG) 

---
## ✨ คุณสมบัติ (Features)

- 🔐 ระบบล็อกอินด้วย Token (JWT)
- 👤 หน้าข้อมูลผู้ใช้ (Profile)
- 🧑‍🤝‍🧑 หน้ารายชื่อสมาชิก (Members)
- 🗣️ ระบบโพสต์สถานะ (Feed)
  - สร้างโพสต์ใหม่
  - กด Like / Unlike
  - แสดงความคิดเห็น / ลบความคิดเห็น
  - ลบโพสต์ของตัวเองได้
- 🌗 **Dark / Light Mode Switch**
- 📱 รองรับ iOS / Android
- 🧩 ใช้โครงสร้าง Context สำหรับ Auth + Theme

---

## 🧰 เทคโนโลยีที่ใช้

| หมวดหมู่ | เทคโนโลยี |
|------------|-------------|
| Framework | [Expo](https://expo.dev/), [React Native](https://reactnative.dev/) |
| Language | TypeScript |
| Navigation | React Navigation (Bottom Tabs) |
| Theme | Context API + Custom Theme System |
| API | Axios + JWT Authorization |
| Safe Area | react-native-safe-area-context |
| Icon | Ionicons (Expo Vector Icons) |

---

## ⚙️ การติดตั้งและรันโปรเจกต์

### 1️⃣ Clone โปรเจกต์
```bash
git clone https://github.com/YOUR_USERNAME/kku-classroom-feed.git
cd kku-classroom-feed
```

### 2️⃣ ติดตั้ง Dependencies
```bash
npm install
```
หรือใช้ yarn:
```bash
yarn install
```

### 3️⃣ รันบนอุปกรณ์จำลองหรือมือถือ
```bash
npx expo start
```
- 🧩 กด `i` เพื่อรันบน iOS Simulator
- 🤖 กด `a` เพื่อรันบน Android Emulator
- 📱 หรือสแกน QR Code ด้วย Expo Go App

### 🔑 Environment Variables
สร้างไฟล์ `.env` ที่ root:
```
API_BASE_URL=https://cis.kku.ac.th/api
API_KEY=03e8b6f26b0b058c16e48359cb05028434639ddcaaf2d7a93b425fef24f547df
```
⚠️ ควรเก็บ API key ไว้ใน `.env` และอย่า commit ลง GitHub

### 🧭 โครงสร้างไฟล์
```
src/
 ┣ 📁 components/          # ส่วนประกอบ UI ย่อย ๆ
 ┣ 📁 context/             # AuthContext, ThemeContext
 ┣ 📁 navigation/          # การจัดการ Navigation (TabNavigator)
 ┣ 📁 screens/             # หน้าหลัก Feed, Profile, Members
 ┣ 📁 services/            # ฟังก์ชันเรียก API
 ┣ 📁 theme/               # Theme System (Dark/Light)
 ┣ 📁 utils/               # Utility เช่น formatThaiDateTime()
 ┗ App.tsx                 # Entry point
```

### 🌗 การจัดการ Theme
ใช้ Context + Hook:
```javascript
const { themeMode, toggleTheme } = useThemeMode();
const theme = useAppTheme(themeMode);
```
สลับโหมด:
```javascript
<Switch value={themeMode === "dark"} onValueChange={toggleTheme} />
```

### 📡 API Reference
| Endpoint                | Method | Description          |
|-------------------------|--------|----------------------|
| `/classroom/status`     | `GET`  | ดึงรายการโพสต์ทั้งหมด |
| `/classroom/status`     | `POST` | สร้างโพสต์ใหม่        |
| `/classroom/like`       | `POST` | กดถูกใจ              |
| `/classroom/like`       | `DELETE` | ยกเลิกถูกใจ           |
| `/classroom/comment`    | `POST` | แสดงความคิดเห็น       |
| `/comment/{id}`         | `DELETE` | ลบความคิดเห็น         |
| `/classroom/status/delete` | `POST` | ลบโพสต์              |

---

## 🧑‍💻 ผู้พัฒนา

**Boss**  
💼 Programmer / Developer  
📧 tha12@kkumail.com

💙 CIS KKU - Computer Science

---

## 🪄 License

MIT License © 2025 Boss

---

