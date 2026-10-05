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
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #f0f4ff 0%, #f8fafc 100%); min-height: 100vh; padding: 20px 15px; color: #334155;">
      
      <!-- Header -->
      <header style="max-width: 900px; margin: 0 auto 20px auto; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 20px; background: #ffffff; padding: 22px 30px; border-radius: 16px; box-shadow: 0 4px 16px rgba(30, 58, 138, 0.08); border-left: 6px solid #2563eb;">
        
        <!-- Cụm Logo và Tiêu đề chính -->
        <div style="display: flex; align-items: center; gap: 18px;">
          <img src="https://tjfjzmyedgwkanbifots.supabase.co/storage/v1/object/public/rooms/OIP.jpg" alt="Logo TNUS" style="width: 75px; height: 75px; object-fit: contain;" />
          <div>
            <h1 style="color: #1e3a8a; font-size: 34px; margin: 0 0 4px 0; font-weight: 800; line-height: 1.1;">FindRoom</h1>
            <div style="font-size: 14px; color: #1e293b; font-weight: 700;">Đối tượng: Sinh viên năm 1 - trường Đại học Khoa học - Đại học Thái Nguyên</div>
          </div>
        </div>

        <!-- Cụm thông tin phụ bên phải -->
        <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 8px; background: #f8fafc; padding: 8px 14px; border-radius: 20px; border: 1px solid #e2e8f0; color: #334155; font-size: 13px; font-weight: 600;">
            <span>📍 Địa chỉ:</span> <span>Phan Đình Phùng - Thái Nguyên</span>
          </div>

          <div style="background: #eff6ff; color: #1d4ed8; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; border: 1px solid #bfdbfe;">
            ✨ Nhóm 5
          </div>
        </div>

      </header>

      <!-- Slogan -->
      <div style="max-width: 900px; margin: 0 auto 25px auto;">
        <p style="color: #1e293b; font-size: 20px; line-height: 1.6; font-style: italic; font-weight: 600; text-align: center; background: #ffffff; padding: 18px 22px; border-radius: 12px; border: 1px solid #e2e8f0;">
          "Sứ mệnh của FindRoom là giúp sinh viên tìm được nơi ở phù hợp, an toàn và thuận tiện với mức giá hợp lý. Mình mong muốn giúp các bạn, đặc biệt là sinh viên năm nhất trường Đại học Khoa học - Thái Nguyên, dễ dàng tìm kiếm và lựa chọn chỗ ở có giá cả và dịch vụ phù hợp với nhu cầu, tránh mất nhiều thời gian và gặp khó khăn khi tìm trọ."
        </p>
      </div>

      <!-- Bộ lọc -->
      <div style="max-width: 900px; margin: 0 auto 25px auto; background: #ffffff; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; border-top: 3px solid #3b82f6;">
        
        <div>
          <label style="display: block; font-size: 13px; font-weight: 600; color: #1e3a8a; margin-bottom: 6px;">💰 Khoảng giá phòng</label>
          <select id="filter-price" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; background: #fff; outline: none;">
            <option value="all">Tất cả mức giá</option>
            <option value="0-1000000">Dưới 1 triệu</option>
            <option value="1000000-2000000">1 triệu - 2 triệu</option>
            <option value="2000000-3000000">2 triệu - 3 triệu</option>
            <option value="3000000-4000000">3 triệu - 4 triệu</option>
            <option value="4000000-5000000">4 triệu - 5 triệu</option>
            <option value="5000000-999999999">Trên 5 triệu</option>
          </select>
        </div>

        <div>
          <label style="display: block; font-size: 13px; font-weight: 600; color: #1e3a8a; margin-bottom: 6px;">👥 Số lượng người ở</label>
          <select id="filter-people" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; background: #fff; outline: none;">
            <option value="all">Tất cả số người</option>
            <option value="1">1 người</option>
            <option value="2">2 người</option>
            <option value="3">3 người</option>
          </select>
        </div>

      </div>

      <!-- Main Container -->
      <main style="max-width: 900px; margin: 0 auto;">
        <h2 style="font-size: 18px; color: #1e3a8a; margin-bottom: 20px; border-left: 4px solid #2563eb; padding-left: 10px; font-weight: 700;">
          Danh sách phòng trọ (${roomsToDisplay.length} kết quả)
        </h2>

        ${
          roomsToDisplay.length === 0
            ? '<div style="background: #fff; padding: 40px; text-align: center; border-radius: 12px; color: #64748b;">Không tìm thấy phòng trọ phù hợp với bộ lọc.</div>'
            : roomsToDisplay
                .map((room) => {
                  let imagesHtml =
                    '<div style="width: 100%; height: 240px; background: #e2e8f0; display: flex; align-items: center; justify-content: center; border-radius: 8px; color: #94a3b8; font-size: 14px;">Chưa có ảnh</div>';

                  if (room.hinh_anh) {
                    const imgUrls = room.hinh_anh
                      .split(',')
                      .map((url) => url.trim())
                      .filter((url) => url);
                    
                    if (imgUrls.length > 0) {
                      let activeIdx = activeImageIndices[room.id] || 0;
                      if (activeIdx >= imgUrls.length) activeIdx = 0;

                      imagesHtml = `
                        <div style="display: flex; flex-direction: column; gap: 10px; width: 100%;">
                          <!-- Ảnh lớn chính -->
                          <div style="width: 100%; height: 260px; background: #000; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                            <img src="${imgUrls[activeIdx]}" alt="Ảnh phòng trọ chính" style="width: 100%; height: 100%; object-fit: cover;" />
                          </div>
                          
                          <!-- Danh sách các ô ảnh phụ nhỏ -->
                          ${
                            imgUrls.length > 1
                              ? `
                            <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; width: 100%;">
                              ${imgUrls
                                .map(
                                  (url, idx) => `
                                <div onclick="window.changeRoomImage('${room.id}',${idx})" style="width: 60px; height: 60px; border-radius: 6px; border: ${idx === activeIdx ? '2px solid #2563eb' : '1px solid #cbd5e1'}; overflow: hidden; flex-shrink: 0; cursor: pointer; background: #fff; opacity: ${idx === activeIdx ? '1' : '0.7'}; transition: all 0.2s;">
                                  <img src="${url}" alt="Ảnh phụ ${idx + 1}" style="width: 100%; height: 100%; object-fit: cover;" />
                                </div>
                              `
                                )
                                .join('')}
                            </div>
                          `
                              : ''
                          }
                        </div>
                      `;
                    }
                  }

                  return `
                    <div class="room-card-item" style="background: #ffffff; border: 1px solid #e2e8f0; padding: 24px; margin-bottom: 24px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); display: grid; grid-template-columns: 320px 1fr; gap: 24px; align-items: start; box-sizing: border-box; overflow: hidden;">
                      <div style="width: 100%;">${imagesHtml}</div>
                      <div style="width: 100%; overflow: hidden;">
                        <h3 style="color: #1e3a8a; font-size: 20px; margin: 0 0 12px 0; font-weight: 600; word-break: break-word;">${
                          room.ten_phong || 'Phòng chưa có tên'
                        }</h3>
                        <div style="font-size: 18px; color: #16a34a; font-weight: 700; margin-bottom: 14px;">
                          ${
                            room.gia_phong
                              ? Number(room.gia_phong).toLocaleString() + ' đ / tháng'
                              : 'Liên hệ'
                          }
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 14px; margin-bottom: 14px; color: #475569; word-break: break-word;">
                          <div>📍 <strong>Địa chỉ:</strong> ${
                            room.dia_chi || 'Chưa có'
                          }</div>
                          <div>📏 <strong>Diện tích:</strong> ${
                            room.dien_tich ? room.dien_tich + ' m²' : 'Chưa có'
                          }</div>
                          <div>👥 <strong>Số người:</strong> ${
                            room.so_nguoi || 'Chưa có'
                          }</div>
                          <div>⚡ <strong>Điện:</strong> ${
                            room.gia_dien
                              ? Number(room.gia_dien).toLocaleString() + ' đ/số'
                              : 'Chưa có'
                          }</div>
                          <div>💧 <strong>Nước:</strong> ${
                            room.gia_nuoc
                              ? Number(room.gia_nuoc).toLocaleString() + ' đ'
                              : 'Chưa có'
                          }</div>
                          <div>🛠️ <strong>Dịch vụ:</strong> ${
                            room.dich_vu
                              ? (isNaN(room.dich_vu) ? room.dich_vu : Number(room.dich_vu).toLocaleString() + ' đ')
                              : 'Chưa có'
                          }</div>
                        </div>
                        <div style="background: #f8fafc; padding: 10px 14px; border-radius: 6px; font-size: 13px; color: #334155; line-height: 1.5; border: 1px solid #e2e8f0; word-break: break-word;">
                          <strong>Mô tả:</strong> ${
                            room.mo_ta || 'Không có mô tả chi tiết.'
                          }
                        </div>
                      </div>
                    </div>
                  `;
                })
                .join('')
        }
      </main>
    </div>

    <!-- Responsive tự động chuyển thành dạng dọc trên điện thoại -->
    <style>
      @media (max-width: 768px) {
        .room-card-item {
          grid-template-columns: 1fr !important;
        }
        header {
          flex-direction: column !important;
          align-items: flex-start !important;
        }
        header > div:last-child {
          align-items: flex-start !important;
          width: 100%;
        }
      }
    </style>
  `;

  document.getElementById('filter-price').value = currentPriceFilter;
  document.getElementById('filter-people').value = currentPeopleFilter;

  document.getElementById('filter-price').addEventListener('change', (e) => {
    currentPriceFilter = e.target.value;
    renderApp(getFilteredRooms());
  });
  document.getElementById('filter-people').addEventListener('change', (e) => {
    currentPeopleFilter = e.target.value;
    renderApp(getFilteredRooms());
  });
}

loadRooms();