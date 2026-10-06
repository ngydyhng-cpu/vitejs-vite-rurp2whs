import './style.css';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://tjfjzmyedgwkanbifots.supabase.co';
const SUPABASE_PUBLISHABLE_KEY =
  'sb_publishable_xnFTCE0EbcW7RcqTjwwDuQ_d9PZK2lP';

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

let allRooms = [];
let currentPriceFilter = 'all';
let currentPeopleFilter = 'all';
let activeImageIndices = {}; // Lưu chỉ mục ảnh đang chọn của từng phòng

window.changeRoomImage = function(roomId, index) {
  activeImageIndices[roomId] = index;
  renderApp(getFilteredRooms());
};

async function loadRooms() {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    document.querySelector('#app').innerHTML = `
      <div style="max-width: 600px; margin: 50px auto; padding: 20px; background: #fee2e2; border: 1px solid #ef4444; border-radius: 8px; color: #b91c1c; text-align: center;">
        <h2>Lỗi kết nối Supabase</h2>
        <p>${error.message}</p>
      </div>
    `;
    return;
  }

  allRooms = data || [];
  renderApp(allRooms);
}

function getFilteredRooms() {
  const priceValue = currentPriceFilter;
  const peopleValue = currentPeopleFilter;

  return allRooms.filter((room) => {
    let matchPrice = true;
    if (priceValue !== 'all') {
      const [min, max] = priceValue.split('-').map(Number);
      const roomPrice = room.gia_phong || 0;
      matchPrice = roomPrice >= min && roomPrice <= max;
    }

    let matchPeople = true;
    if (peopleValue !== 'all') {
      const roomPeopleStr = String(room.so_nguoi || '').trim();
      matchPeople = roomPeopleStr.includes(peopleValue);
    }

    return matchPrice && matchPeople;
  });
}

function renderApp(roomsToDisplay) {
  const appContainer = document.querySelector('#app');

  appContainer.innerHTML = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #f0f4ff 0%, #f8fafc 100%); min-height: 100vh; padding: 25px 15px; color: #334155;">
      
      <!-- Header -->
      <header style="max-width: 900px; margin: 0 auto 20px auto; background: #ffffff; padding: 30px; border-radius: 16px; box-shadow: 0 4px 20px rgba(30, 58, 138, 0.08); border-left: 6px solid #2563eb;">
        
        <div style="display: flex; align-items: center; gap: 24px; flex-wrap: wrap;">
          <!-- Logo to bên trái -->
          <img src="https://tjfjzmyedgwkanbifots.supabase.co/storage/v1/object/public/rooms/OIP.jpg" alt="Logo TNUS" style="width: 95px; height: 95px; object-fit: contain; flex-shrink: 0;" />
          
          <!-- Tiêu đề FindRoom to và rộng rãi -->
          <div style="flex-grow: 1;">
            <h1 style="color: #1e3a8a; font-size: 42px; margin: 0 0 6px 0; font-weight: 800; letter-spacing: 0.5px; line-height: 1.1;">FindRoom</h1>
            <div style="font-size: 15px; color: #475569; font-weight: 600; line-height: 1.4;">Đối tượng: Sinh viên năm 1 - trường Đại học Khoa học - Đại học Thái Nguyên</div>
          </div>
        </div>

        <!-- 3 mục Địa chỉ, SĐT, Nhóm thành hàng ngang ở dưới -->
        <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-top: 24px; padding-top: 18px; border-top: 1px solid #e2e8f0;">
          <div style="display: flex; align-items: center; gap: 6px; background: #f8fafc; padding: 8px 14px; border-radius: 8px; border: 1px solid #e2e8f0; color: #334155; font-size: 13px; font-weight: 600;">
            <span>📍 Địa chỉ:</span> <span style="font-weight: 500;">Phan Đình Phùng - Thái Nguyên</span>
          </div>

          <div style="display: flex; align-items: center; gap: 6px; background: #f8fafc; padding: 8px 14px; border-radius: 8px; border: 1px solid #e2e8f0; color